// Contact form → email, as a Vercel serverless function (POST /api/enquiry/).
// Settings live in Vercel environment variables, never in the code:
//   RESEND_API_KEY  API key from resend.com
//   ENQUIRY_TO      where enquiries are delivered (comma-separate several addresses)
//   ENQUIRY_FROM    the sender, e.g. "Clarke Projects <onboarding@resend.dev>" until a domain is verified in Resend
// The visitor's address is set as Reply-To, so replying in the mail app answers them directly.
// Nothing from a submission is logged; errors log only a status and Resend's short reason.

const dns = require('dns').promises;

const LIMITS = { name: 200, email: 254, message: 5000 };
// One address only: no spaces, commas, angle brackets or quotes (they could smuggle in more recipients).
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;
const MIN_MS = 3000;
const SEND_TIMEOUT_MS = 8000;

// Can the domain after the @ receive email? Built-in DNS lookup, no outside service.
// Only a definite "no" counts: a slow or failed lookup lets the enquiry through.
async function domainReceivesMail(domain) {
  const lookup = async () => {
    try {
      const mx = await dns.resolveMx(domain);
      if (mx.length) return !(mx.length === 1 && mx[0].exchange === ''); // "null MX": the domain declares it takes no mail
    } catch (err) {
      if (err.code === 'ENOTFOUND') return false; // the domain doesn't exist (e.g. a typo)
      if (err.code !== 'ENODATA') return true;
    }
    // No MX record: mail falls back to the domain's own address, if it has one.
    const found = await Promise.all([dns.resolve4(domain), dns.resolve6(domain)].map((p) => p.then((a) => a.length > 0, () => false)));
    return found.some(Boolean);
  };
  return Promise.race([lookup().catch(() => true), new Promise((resolve) => setTimeout(resolve, 2500, true))]);
}

function readBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
  try { return JSON.parse(String(req.body || '{}')); } catch { return null; }
}

// A browser on another site can't send JSON here without our permission (CORS preflight), and we never grant it.
// The Origin check below is an extra guard for browsers, not a defence against scripts, which can send any header.
function crossSite(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try { return new URL(origin).host !== host; } catch { return true; }
}

const send = (res, status, body) => res.status(status).json(body);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method-not-allowed' });
  }
  if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) return send(res, 415, { ok: false, error: 'unsupported-type' });
  if (crossSite(req)) return send(res, 403, { ok: false, error: 'forbidden' });

  const body = readBody(req);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return send(res, 400, { ok: false, error: 'invalid' });

  // Honeypot: people never see or fill the hidden field; bots usually do. Pretend it worked.
  if (body.hp) return send(res, 200, { ok: true });

  // Time check: the page sends how long it was open (ms). A request without it didn't come from the page: pretend it worked.
  // A real person who is very quick (autofill + paste) gets a visible "please send again" rather than a silent loss.
  const elapsed = Number(body.elapsed);
  if (body.elapsed === undefined || !Number.isFinite(elapsed)) return send(res, 200, { ok: true });
  if (elapsed < MIN_MS) return send(res, 400, { ok: false, error: 'too-fast' });

  const fields = {};
  for (const key of Object.keys(LIMITS)) {
    const value = body[key];
    if (typeof value !== 'string') return send(res, 400, { ok: false, error: 'invalid' });
    fields[key] = value.trim();
    if (fields[key].length > LIMITS[key]) return send(res, 400, { ok: false, error: 'too-long' });
  }
  const name = fields.name.replace(/[\r\n\t]+/g, ' ');
  const { email, message } = fields;
  if (!name || !EMAIL.test(email) || !message) return send(res, 400, { ok: false, error: 'invalid' });
  if (!(await domainReceivesMail(email.split('@').pop().toLowerCase()))) return send(res, 400, { ok: false, error: 'email-domain' });

  const { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) {
    console.error('Enquiry form: RESEND_API_KEY, ENQUIRY_TO and ENQUIRY_FROM must be set');
    return send(res, 500, { ok: false, error: 'not-configured' });
  }

  // Same key for a resend of the same enquiry (e.g. after a timeout), so Resend delivers it once.
  const key = typeof body.key === 'string' && /^[A-Za-z0-9-]{8,64}$/.test(body.key) ? body.key : null;
  let page = 'the website';
  try { const ref = new URL(req.headers.referer); page = ref.origin + ref.pathname; } catch { /* no referrer */ }

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json', ...(key && { 'Idempotency-Key': key }) },
      body: JSON.stringify({
        from: ENQUIRY_FROM,
        to: ENQUIRY_TO.split(',').map((a) => a.trim()).filter(Boolean),
        reply_to: email,
        subject: `New enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}\n\n—\nSent from ${page}`,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
  } catch (err) {
    console.error('Enquiry form: Resend unreachable', err.name);
    return send(res, 502, { ok: false, error: 'send-failed' });
  }
  if (!response.ok) {
    const reason = await response.text().catch(() => '');
    console.error('Enquiry form: Resend error', response.status, reason.slice(0, 200));
    return send(res, 502, { ok: false, error: 'send-failed' });
  }
  return send(res, 200, { ok: true });
};

module.exports.domainReceivesMail = domainReceivesMail;
