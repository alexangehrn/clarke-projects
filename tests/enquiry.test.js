// Contact form function: run with `npm test` (Node's built-in test runner, no dependencies).
// Resend and DNS are replaced by fakes, so nothing is sent and no network is used.
const test = require('node:test');
const assert = require('node:assert/strict');
const dns = require('dns').promises;

const DOMAINS = { 'example.org': [{ exchange: 'mx.example.org', priority: 10 }], 'accenture.com': [{ exchange: 'mx.accenture.com', priority: 10 }], 'nomail.org': [{ exchange: '', priority: 0 }] };
dns.resolveMx = async (d) => { if (DOMAINS[d]) return DOMAINS[d]; const e = new Error('nf'); e.code = 'ENOTFOUND'; throw e; };
dns.resolve4 = async () => []; dns.resolve6 = async () => [];

const handler = require('../api/enquiry.js');

let sent, resendReply;
global.fetch = async (url, init) => {
  sent.push({ url, headers: init.headers, body: JSON.parse(init.body) });
  return resendReply();
};

const ENV = { RESEND_API_KEY: 're_test', ENQUIRY_TO: 'owner@example.org', ENQUIRY_FROM: 'Clarke Projects <onboarding@resend.dev>' };
const valid = () => ({ name: 'Ann Lee', email: 'ann@example.org', message: 'Hello', elapsed: 5000, hp: '', key: 'k-12345678' });

async function call({ method = 'POST', body = valid(), headers = {}, env = ENV } = {}) {
  sent = []; Object.assign(process.env, { RESEND_API_KEY: '', ENQUIRY_TO: '', ENQUIRY_FROM: '' }, env);
  const out = { headers: {} };
  const res = {
    setHeader(k, v) { out.headers[k.toLowerCase()] = v; },
    status(c) { out.status = c; return this; },
    json(j) { out.body = j; return this; },
  };
  await handler({ method, body, headers: { 'content-type': 'application/json', host: 'site.test', ...headers } }, res);
  return out;
}

test.beforeEach(() => { resendReply = async () => ({ ok: true, text: async () => '' }); });

test('valid enquiry is sent once, as plain text, to the configured recipient with the visitor as Reply-To', async () => {
  const r = await call({ headers: { origin: 'https://site.test', referer: 'https://site.test/option-5a-scroll/?x=1#contact' } });
  assert.equal(r.status, 200); assert.deepEqual(r.body, { ok: true });
  assert.equal(sent.length, 1);
  const m = sent[0].body;
  assert.deepEqual(m.to, ['owner@example.org']);
  assert.equal(m.from, ENV.ENQUIRY_FROM);
  assert.equal(m.reply_to, 'ann@example.org');
  assert.equal(m.html, undefined);
  assert.match(m.text, /Sent from https:\/\/site\.test\/option-5a-scroll\/\n?$/); // query and fragment dropped
  assert.equal(sent[0].headers['Idempotency-Key'], 'k-12345678');
  assert.equal(r.headers['cache-control'], 'no-store');
});

test('international names and punctuation are accepted', async () => {
  const r = await call({ body: { ...valid(), name: 'Zoë O’Brien-Müller 王小明', message: 'Ça va? <b>bold</b> & “quotes”' } });
  assert.equal(r.status, 200);
  assert.equal(sent[0].body.subject, 'New enquiry from Zoë O’Brien-Müller 王小明');
  assert.match(sent[0].body.text, /<b>bold<\/b>/); // plain text email: markup is inert
});

test('company domains pass the domain check; typos and no-mail domains are refused', async () => {
  assert.equal((await call({ body: { ...valid(), email: 'alex.aa@accenture.com' } })).status, 200);
  assert.deepEqual((await call({ body: { ...valid(), email: 'ann@gmial.con' } })).body, { ok: false, error: 'email-domain' });
  assert.deepEqual((await call({ body: { ...valid(), email: 'ann@nomail.org' } })).body, { ok: false, error: 'email-domain' });
  assert.equal(sent.length, 0);
});

test('header injection: newlines in the name are flattened; an email with newlines, commas or brackets is refused', async () => {
  const r = await call({ body: { ...valid(), name: 'Ann\r\nBcc: victim@example.org' } });
  assert.equal(r.status, 200);
  assert.equal(sent[0].body.subject, 'New enquiry from Ann Bcc: victim@example.org');
  for (const email of ['ann@example.org\r\nBcc: x@example.org', 'ann@example.org,x@example.org', 'Ann <ann@example.org>', 'ann@example.org;x@example.org', 'a"b@example.org']) {
    const bad = await call({ body: { ...valid(), email } });
    assert.equal(bad.status, 400, email); assert.equal(sent.length, 0);
  }
});

test('missing, wrong-type and oversized fields are refused without sending', async () => {
  for (const body of [{ ...valid(), name: '' }, { ...valid(), message: '   ' }, { ...valid(), email: 'nope' }, { ...valid(), name: ['a'] }, { ...valid(), message: { a: 1 } }, { ...valid(), email: undefined }]) {
    const r = await call({ body }); assert.equal(r.status, 400); assert.equal(r.body.error, 'invalid');
  }
  for (const body of [{ ...valid(), message: 'x'.repeat(5001) }, { ...valid(), name: 'x'.repeat(201) }, { ...valid(), email: 'a'.repeat(250) + '@example.org' }]) {
    const r = await call({ body }); assert.equal(r.status, 400); assert.equal(r.body.error, 'too-long');
  }
  assert.equal((await call({ body: { ...valid(), message: 'x'.repeat(5000) } })).status, 200);
  for (const body of ['not json', '[1,2]', [1, 2]]) assert.equal((await call({ body })).status, 400);
  assert.equal((await call({ body: null })).status, 200); // empty: no timing, so treated as a bot post
  assert.equal(sent.length, 0);
});

test('wrong method, content type or cross-site origin is refused', async () => {
  const get = await call({ method: 'GET' });
  assert.equal(get.status, 405); assert.equal(get.headers.allow, 'POST');
  assert.equal((await call({ method: 'OPTIONS' })).status, 405);
  assert.equal((await call({ headers: { 'content-type': 'application/x-www-form-urlencoded' } })).status, 415);
  assert.equal((await call({ headers: { 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await call({ headers: { origin: 'https://evil.test' } })).status, 403);
  assert.equal((await call({ headers: { origin: 'null' } })).status, 403);
  assert.equal(sent.length, 0);
});

test('bots: honeypot and direct posts are silently accepted but not sent; a too-fast person is asked to retry', async () => {
  assert.deepEqual((await call({ body: { ...valid(), hp: 'http://spam.test' } })).body, { ok: true });
  const { elapsed, ...noTiming } = valid();
  assert.deepEqual((await call({ body: noTiming })).body, { ok: true });
  assert.deepEqual((await call({ body: { ...valid(), elapsed: 'abc' } })).body, { ok: true });
  assert.equal(sent.length, 0);
  assert.deepEqual((await call({ body: { ...valid(), elapsed: 1200 } })).body, { ok: false, error: 'too-fast' });
});

test('an invalid idempotency key is not forwarded', async () => {
  await call({ body: { ...valid(), key: 'bad key!\r\nX: y' } });
  assert.equal(sent[0].headers['Idempotency-Key'], undefined);
});

test('Resend failures and timeouts give a safe 502 without the submission in the logs', async () => {
  const logs = []; const orig = console.error; console.error = (...a) => logs.push(a.join(' '));
  try {
    resendReply = async () => ({ ok: false, status: 429, text: async () => '{"message":"Too many requests"}' });
    assert.deepEqual((await call()).body, { ok: false, error: 'send-failed' });
    resendReply = async () => { const e = new Error('timeout'); e.name = 'TimeoutError'; throw e; };
    assert.deepEqual((await call()).body, { ok: false, error: 'send-failed' });
  } finally { console.error = orig; }
  assert.equal(logs.length, 2);
  for (const l of logs) { assert.doesNotMatch(l, /Ann Lee|ann@example\.org|Hello/); }
});

test('missing configuration is reported as not-configured, nothing sent', async () => {
  const r = await call({ env: { RESEND_API_KEY: '', ENQUIRY_TO: '', ENQUIRY_FROM: '' } });
  assert.equal(r.status, 500); assert.equal(r.body.error, 'not-configured'); assert.equal(sent.length, 0);
});

test('concurrent submissions are each handled independently', async () => {
  sent = [];
  const results = await Promise.all(Array.from({ length: 20 }, (_, i) => call({ body: { ...valid(), key: 'k-concurrent-' + i } })));
  assert.ok(results.every((r) => r.status === 200));
});

test('domain check: a slow DNS answer lets the enquiry through', async () => {
  const orig = dns.resolveMx; dns.resolveMx = () => new Promise(() => {});
  try { assert.equal(await handler.domainReceivesMail('slow.test'), true); } finally { dns.resolveMx = orig; }
});
