// Contact form → email, as a Vercel serverless function (POST /api/enquiry).
// Settings live in Vercel environment variables, never in the code:
//   RESEND_API_KEY  API key from resend.com
//   ENQUIRY_TO      where enquiries are delivered (comma-separate several addresses)
//   ENQUIRY_FROM    the sender, e.g. "Clarke Projects <onboarding@resend.dev>" until a domain is verified in Resend
// The visitor's address is set as Reply-To, so replying in the mail app answers them directly.

const EMAIL = /^\S+@\S+\.\S+$/;
const MIN_MS = 3000;

const clean = (value, max) => String(value == null ? '' : value).trim().slice(0, max);

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method-not-allowed' });
  }

  const body = readBody(req);

  // Honeypot: people never see or fill the "company" field; bots usually do. Pretend it worked.
  if (clean(body.company, 200)) return res.status(200).json({ ok: true });

  // Time check: the page sends how long it was open (ms). No one completes the form in under 3 seconds;
  // bots do, or post here directly without the page. Pretend it worked here too.
  const elapsed = Number(body.elapsed);
  if (!(elapsed >= MIN_MS)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 200).replace(/[\r\n]+/g, ' ');
  const email = clean(body.email, 320);
  const message = clean(body.message, 5000);
  if (!name || !EMAIL.test(email) || !message) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }

  const { RESEND_API_KEY, ENQUIRY_TO, ENQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_TO || !ENQUIRY_FROM) {
    console.error('Enquiry form: RESEND_API_KEY, ENQUIRY_TO and ENQUIRY_FROM must be set');
    return res.status(500).json({ ok: false, error: 'not-configured' });
  }

  const page = clean(req.headers.referer, 300) || 'the website';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: ENQUIRY_FROM,
      to: ENQUIRY_TO.split(',').map((a) => a.trim()).filter(Boolean),
      reply_to: email,
      subject: `New enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}\n\n—\nSent from ${page}`,
    }),
  }).catch((err) => ({ ok: false, status: 0, text: async () => String(err) }));

  if (!response.ok) {
    console.error('Enquiry form: Resend error', response.status, await response.text());
    return res.status(502).json({ ok: false, error: 'send-failed' });
  }
  return res.status(200).json({ ok: true });
};
