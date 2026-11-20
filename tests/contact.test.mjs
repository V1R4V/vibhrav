import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandlers, issueChallenge, verifyChallenge } from '../lib/contact/server.mjs';

const env = {
  RESEND_API_KEY: 'test-key', CONTACT_FROM: 'Portfolio <hello@example.com>',
  CONTACT_TO: 'owner@example.com', CONTACT_ALLOWED_ORIGINS: 'https://portfolio.example',
  CONTACT_FORM_SECRET: 'a-secret-long-enough-for-hmac-signing-tests',
  UPSTASH_REDIS_REST_URL: 'https://redis.example', UPSTASH_REDIS_REST_TOKEN: 'redis-token',
};
const origin = 'https://portfolio.example';
const start = 1_800_000_000_000;
const good = { name: 'A visitor', email: 'visitor@example.net', message: 'I would like to discuss a project with you.', website: '' };
function setup(overrides = {}) {
  let time = start;
  const sent = [];
  const used = new Map();
  const handlers = createContactHandlers({ env, now: () => time, fetch: async (url, options) => {
    sent.push({ url, options });
    return Response.json({ id: 'accepted-email-id' });
  }, rateLimit: async ({ nonce, digest }) => {
    const previous = used.get(nonce);
    if (previous && (previous.digest !== digest || previous.attempts >= 3)) return { status: 'replay' };
    used.set(nonce, { digest, attempts: (previous?.attempts ?? 0) + 1 });
    return { status: 'allowed' };
  }, ...overrides });
  return { ...handlers, sent, advance: (ms) => { time += ms; } };
}
function post(body, options = {}) {
  return new Request(`${origin}/api/contact`, { method: 'POST', headers: { origin, 'content-type': 'application/json', ...options.headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
async function challenge(h) {
  const res = await h.GET(new Request(`${origin}/api/contact`));
  assert.equal(res.status, 200);
  return (await res.json()).challenge;
}
async function ready(h) { const token = await challenge(h); h.advance(2000); return { ...good, challenge: token }; }

test('HMAC challenge verifies its age and rejects modifications, premature fill, expiry and future issue times', () => {
  const token = issueChallenge(env.CONTACT_FORM_SECRET, start);
  assert.ok(verifyChallenge(token, env.CONTACT_FORM_SECRET, start + 2000));
  for (const [value, now] of [[`${token}x`, start + 2000], [token, start], [token, start + 600001], [token, start - 1]]) {
    assert.equal(verifyChallenge(value, env.CONTACT_FORM_SECRET, now), null);
  }
});
test('returns 202 only for actual provider acceptance with fixed sender, recipient, reply_to and nonce idempotency', async () => {
  const h = setup(); const body = await ready(h);
  const res = await h.POST(post(body));
  assert.equal(res.status, 202);
  const { options, url } = h.sent[0]; const payload = JSON.parse(options.body);
  assert.equal(url, 'https://api.resend.com/emails');
  assert.equal(payload.from, env.CONTACT_FROM); assert.deepEqual(payload.to, [env.CONTACT_TO]);
  assert.equal(payload.reply_to, good.email); assert.equal(payload.html, undefined);
  assert.ok(payload.text.includes(good.message));
  assert.match(options.headers['Idempotency-Key'], /^portfolio-contact\//);
  assert.equal((await h.POST(post(body))).status, 202);
  assert.equal((await h.POST(post(body))).status, 202);
  assert.equal((await h.POST(post(body))).status, 409);
  assert.equal(h.sent.length, 3);
  assert.equal(h.sent[0].options.headers['Idempotency-Key'], h.sent[1].options.headers['Idempotency-Key']);
});
test('missing server credentials fail closed and never report delivery', async () => {
  for (const key of Object.keys(env)) {
    const h = setup({ env: { ...env, [key]: '' } });
    assert.equal((await h.GET(new Request(`${origin}/api/contact`))).status, 503, key);
    assert.equal((await h.POST(post(good))).status, 503, key);
    assert.equal(h.sent.length, 0);
  }
});
test('origin checks reject missing, cross-site, deceptive and unconfigured request origins', async () => {
  const h = setup(); const body = await ready(h);
  for (const value of ['', 'null', 'https://evil.example', `${origin}.evil.example`]) {
    assert.equal((await h.POST(post(body, { headers: { origin: value } }))).status, 403);
  }
  assert.equal((await h.GET(new Request('https://evil.example/api/contact'))).status, 403);
  assert.equal(h.sent.length, 0);
});
test('content type, malformed JSON and bounded streamed body reject before provider', async () => {
  const h = setup(); const body = await ready(h);
  assert.equal((await h.POST(post(body, { headers: { 'content-type': 'text/plain' } }))).status, 415);
  assert.equal((await h.POST(post('{'))).status, 400);
  assert.equal((await h.POST(post('x'.repeat(64001)))).status, 413);
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('x'.repeat(64001))); controller.close(); } });
  const req = new Request(`${origin}/api/contact`, { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: stream, duplex: 'half' });
  assert.equal((await h.POST(req)).status, 413);
  assert.equal(h.sent.length, 0);
});
test('validation returns accessible field errors and blocks unbounded fields, control characters, spam and invalid challenges', async () => {
  const h = setup(); const body = await ready(h);
  for (const invalid of [{ name: 'a' }, { name: 'a'.repeat(101) }, { email: 'bad' }, { email: `${'a'.repeat(250)}@test.com` }, { message: 'short' }, { message: 'a'.repeat(5001) }, { name: 'Header\r\nvalue' }]) {
    const res = await h.POST(post({ ...body, ...invalid }));
    assert.equal(res.status, 400); assert.ok((await res.json()).fieldErrors);
  }
  assert.equal((await h.POST(post({ ...body, website: 'spam.example' }))).status, 400);
  assert.equal((await h.POST(post({ ...body, challenge: 'forged' }))).status, 400);
  assert.equal(h.sent.length, 0);
});
test('persistent limiter 429 includes retry-after and backend failure remains 503', async () => {
  for (const [expected, rateLimit] of [[429, async () => ({ status: 'limited', retryAfter: 321 })], [503, async () => { throw Error('private database error'); }]]) {
    const h = setup({ rateLimit }); const body = await ready(h); const res = await h.POST(post(body));
    assert.equal(res.status, expected);
    if (res.status === 429) assert.equal(res.headers.get('retry-after'), '321');
    assert.equal(h.sent.length, 0); assert.ok(!(await res.text()).includes('private database'));
  }
});
test('provider failures, missing id, success-shaped errors, invalid JSON and timeouts never become success', async () => {
  for (const provider of [async () => Response.json({ message: 'secret failure' }, { status: 403 }), async () => Response.json({}), async () => Response.json({ id: 'id', error: 'bad' }), async () => new Response('invalid'), async () => { throw new DOMException('timed out', 'TimeoutError'); }]) {
    const h = setup({ fetch: provider }); const res = await h.POST(post(await ready(h)));
    assert.equal(res.status, 503); const result = await res.json();
    assert.ok(result.requestId); assert.ok(!JSON.stringify(result).includes('secret failure'));
  }
});
test('real Redis adapter requires atomic EVAL and fails closed on malformed or denied responses', async () => {
  for (const result of [{ result: [1, 0] }, { result: [2, 0] }, { result: [0, 300] }, { result: [-1, 0] }, { error: 'private redis error' }, { result: 'OK' }]) {
    let command;
    const h = setup({ rateLimit: undefined, fetch: async (url, options) => {
      if (url === env.UPSTASH_REDIS_REST_URL) { command = JSON.parse(options.body); return Response.json(result); }
      return Response.json({ id: 'email-id' });
    } });
    const res = await h.POST(post(await ready(h)));
    assert.equal(res.status, Array.isArray(result.result) ? ({ 1: 202, 2: 202, 0: 429, '-1': 409 })[result.result[0]] : 503);
    assert.equal(command[0], 'EVAL'); assert.ok(command[1].includes("redis.call('HSET'"));
    assert.ok(!JSON.stringify(command).includes('visitor@example.net'));
  }
});
test('ignores public spoofed forwarding headers and only hashes platform-trusted IPs', async () => {
  const hashes = [];
  const rateLimit = async ({ ipHash }) => { hashes.push(ipHash); return { status: 'allowed' }; };
  for (const vercel of [undefined, '1']) {
    const h = setup({ env: { ...env, VERCEL: vercel }, rateLimit });
    for (const ip of ['203.0.113.1', '203.0.113.2']) {
      assert.equal((await h.POST(post(await ready(h), { headers: { 'x-forwarded-for': ip, 'x-vercel-forwarded-for': ip } }))).status, 202);
    }
  }
  assert.equal(hashes[0], hashes[1]); assert.notEqual(hashes[2], hashes[3]);
  for (const hash of hashes) assert.match(hash, /^[\w-]{43}$/);
});
test('premature and expired POST challenges never reach the provider', async () => {
  const h = setup(); const token = await challenge(h);
  assert.equal((await h.POST(post({ ...good, challenge: token }))).status, 400);
  h.advance(600001);
  assert.equal((await h.POST(post({ ...good, challenge: token }))).status, 400);
  assert.equal(h.sent.length, 0);
});
test('provider requests carry an enforced timeout and no cache', async () => {
  const h = setup(); assert.equal((await h.POST(post(await ready(h)))).status, 202);
  assert.ok(h.sent[0].options.signal instanceof AbortSignal);
  assert.equal(h.sent[0].options.cache, 'no-store');
});

test('a 5,000-character CJK message and escaped JSON fit within the bounded body', async () => {
  const h = setup(); const body = { ...await ready(h), message: '文'.repeat(5000) };
  assert.equal((await h.POST(post(body))).status, 202);
  const other = setup(); const escaped = JSON.stringify({ ...await ready(other), message: '文'.repeat(5000) }).replaceAll('文', '\\u6587');
  assert.equal((await other.POST(post(escaped))).status, 202);
});
test('an ambiguous provider failure retries the identical canonical message with the same idempotency key', async () => {
  const calls = [];
  const h = setup({ fetch: async (_url, options) => {
    calls.push(options); if (calls.length === 1) throw new DOMException('timeout', 'TimeoutError');
    return Response.json({ id: 'accepted-once' });
  } });
  const body = await ready(h);
  assert.equal((await h.POST(post(body))).status, 503);
  assert.equal((await h.POST(post({ ...body, message: 'A completely different message with enough characters.' }))).status, 409);
  assert.equal((await h.POST(post({ ...body, name: `  ${body.name}  ` }))).status, 202);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].headers['Idempotency-Key'], calls[1].headers['Idempotency-Key']);
  assert.equal(calls[0].body, calls[1].body);
});
test('challenge response describes the server readiness and lifetime', async () => {
  const h = setup(); const response = await h.GET(new Request(`${origin}/api/contact`));
  const data = await response.json();
  assert.equal(data.readyAfterMs, 1500); assert.equal(data.expiresAfterMs, 600000);
});
