import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { z } from 'zod';

const MAX_BYTES = 64_000;
const TOKEN_LIFETIME = 600_000;
const MIN_FILL_TIME = 1500;
const safeLine = (value) => !/[\r\n\x00-\x1f\x7f]/.test(value);
const fields = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters.').max(100, 'Use 100 characters or fewer.').refine(safeLine, 'Please use a single line.'),
  email: z.string().trim().max(254, 'Use 254 characters or fewer.').email('Please enter a valid email address.').refine(safeLine),
  message: z.string().trim().min(20, 'Please enter at least 20 characters.').max(5000, 'Use 5,000 characters or fewer.').refine((value) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value), 'Please remove unsupported characters.'),
  website: z.string().max(0).optional(),
  challenge: z.string().max(256),
}).strict();
const hmac = (value, secret) => createHmac('sha256', secret).update(value).digest('base64url');

export function issueChallenge(secret, now = Date.now()) {
  const payload = `${now}.${randomBytes(24).toString('base64url')}`;
  return `${payload}.${hmac(payload, secret)}`;
}
export function verifyChallenge(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || !/^\d{13}\.[\w-]{32}\.[\w-]{43}$/.test(token)) return null;
  const [issued, nonce, signature] = token.split('.');
  const expected = hmac(`${issued}.${nonce}`, secret);
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const age = now - Number(issued);
  return age >= MIN_FILL_TIME && age <= TOKEN_LIFETIME ? { nonce } : null;
}
function configuration(env) {
  const keys = ['RESEND_API_KEY', 'CONTACT_FROM', 'CONTACT_TO', 'CONTACT_ALLOWED_ORIGINS', 'CONTACT_FORM_SECRET', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'];
  if (keys.some((key) => !env[key]?.trim()) || env.CONTACT_FORM_SECRET.length < 32) return null;
  const sender = env.CONTACT_FROM.match(/^(?:[^<>\r\n]+ <([^<>]+)>|([^<>\r\n]+))$/);
  if (!sender || !safeLine(env.CONTACT_FROM) || !z.string().email().safeParse(sender[1] || sender[2]).success || !z.string().email().safeParse(env.CONTACT_TO).success) return null;
  try {
    const redis = new URL(env.UPSTASH_REDIS_REST_URL);
    if (redis.protocol !== 'https:' || redis.username || redis.password || redis.search || redis.hash || redis.pathname !== '/') return null;
    const origins = env.CONTACT_ALLOWED_ORIGINS.split(',').map((value) => value.trim());
    if (!origins.length || origins.some((value) => {
      const url = new URL(value);
      return value !== url.origin || (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)));
    })) return null;
    return { origins };
  } catch { return null; }
}
function allowedRequest(request, config, requireOrigin) {
  const origin = request.headers.get('origin');
  const servingOrigin = new URL(request.url).origin;
  return config.origins.includes(servingOrigin) && (!requireOrigin && origin === null || origin === servingOrigin && config.origins.includes(origin));
}
function clientHash(request, env) {
  // Vercel overwrites this header at its edge. Never trust arbitrary forwarding headers.
  const candidate = env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for')?.trim() : '';
  return hmac(candidate && isIP(candidate) ? candidate : 'unavailable', env.CONTACT_FORM_SECRET);
}
async function boundedJson(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw { status: 413 };
  const reader = request.body?.getReader();
  if (!reader) throw { status: 400 };
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw { status: 413 }; }
      chunks.push(Buffer.from(value));
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) { throw { status: error?.status === 413 ? 413 : 400 }; }
  finally { reader.releaseLock(); }
}
// Limits and challenge consumption share a transaction, across every application instance.
const LIMIT_SCRIPT = `
if redis.call('EXISTS', KEYS[3]) == 1 then
  if redis.call('HGET', KEYS[3], 'digest') ~= ARGV[1] then return {-1, 0} end
  if tonumber(redis.call('HGET', KEYS[3], 'attempts') or '3') >= 3 then return {-1, 0} end
  redis.call('HINCRBY', KEYS[3], 'attempts', 1)
  return {2, 0}
end
local perIp = tonumber(redis.call('GET', KEYS[1]) or '0')
local global = tonumber(redis.call('GET', KEYS[2]) or '0')
if perIp >= 5 or global >= 30 then
  return {0, math.max(redis.call('TTL', KEYS[1]), redis.call('TTL', KEYS[2]), 1)}
end
redis.call('HSET', KEYS[3], 'digest', ARGV[1], 'attempts', 1)
redis.call('EXPIRE', KEYS[3], 600)
for i = 1, 2 do
  if redis.call('INCR', KEYS[i]) == 1 then redis.call('EXPIRE', KEYS[i], 3600) end
end
return {1, 0}`;
async function persistentLimit({ nonce, ipHash, digest }, env, fetcher) {
  const response = await fetcher(env.UPSTASH_REDIS_REST_URL, {
    method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', LIMIT_SCRIPT, '3', `contact:ip:${ipHash}`, 'contact:global', `contact:nonce:${nonce}`, digest]),
    signal: AbortSignal.timeout(4000), cache: 'no-store',
  });
  if (!response.ok) throw Error('Rate limit unavailable');
  const body = await response.json();
  if (body.error || !Array.isArray(body.result) || body.result.length !== 2 || !body.result.every(Number.isInteger)) throw Error('Invalid rate limit response');
  const [code, ttl] = body.result;
  if (code === 1 || code === 2) return { status: 'allowed' };
  if (code === -1) return { status: 'replay' };
  if (code === 0 && ttl > 0 && ttl <= 3600) return { status: 'limited', retryAfter: ttl };
  throw Error('Invalid rate limit response');
}
export function createContactHandlers(options = {}) {
  const env = options.env ?? process.env;
  const fetcher = options.fetch ?? fetch;
  const now = options.now ?? Date.now;
  const rateLimit = options.rateLimit ?? ((input) => persistentLimit(input, env, fetcher));
  const respond = (status, body, requestId, extra = {}) => Response.json({ ...body, requestId }, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra } });
  const fail = (status, requestId, extra) => respond(status, { error: status === 503 ? 'The form is temporarily unavailable. Please email me directly.' : status === 429 ? 'Too many messages. Please try again later or email me directly.' : status === 409 ? 'This message cannot be retried safely. Please email me directly.' : 'Your message could not be sent. Please check the form and try again.' }, requestId, extra);
  return {
    async GET(request) {
      const requestId = randomUUID(); const config = configuration(env);
      if (!config) return fail(503, requestId);
      if (!allowedRequest(request, config, false)) return fail(403, requestId);
      return respond(200, { challenge: issueChallenge(env.CONTACT_FORM_SECRET, now()), readyAfterMs: MIN_FILL_TIME, expiresAfterMs: TOKEN_LIFETIME }, requestId);
    },
    async POST(request) {
      const requestId = randomUUID(); const config = configuration(env);
      if (!config) return fail(503, requestId);
      if (!allowedRequest(request, config, true)) return fail(403, requestId);
      if (!/^application\/json(?:\s*;.*)?$/i.test(request.headers.get('content-type') ?? '')) return fail(415, requestId);
      let body;
      try { body = await boundedJson(request); } catch (error) { return fail(error.status, requestId); }
      const parsed = fields.safeParse(body);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        const fieldErrors = Object.fromEntries(['name', 'email', 'message'].filter((key) => errors[key]).map((key) => [key, errors[key][0]]));
        return respond(400, { error: 'Please check the form and try again.', fieldErrors }, requestId);
      }
      const token = verifyChallenge(parsed.data.challenge, env.CONTACT_FORM_SECRET, now());
      if (!token) return fail(400, requestId);
      try {
        const { name, email, message } = parsed.data;
        const digest = hmac(JSON.stringify({ name, email, message }), env.CONTACT_FORM_SECRET);
        const limit = await rateLimit({ nonce: token.nonce, ipHash: clientHash(request, env), digest });
        if (limit.status === 'limited') return fail(429, requestId, { 'Retry-After': String(limit.retryAfter) });
        if (limit.status === 'replay') return fail(409, requestId);
        if (limit.status !== 'allowed') return fail(503, requestId);
        const response = await fetcher('https://api.resend.com/emails', {
          method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `portfolio-contact/${token.nonce}` },
          body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: email, subject: 'Portfolio contact', text: `Name: ${name}\nEmail: ${email}\n\n${message}` }),
          signal: AbortSignal.timeout(8000), cache: 'no-store',
        });
        if (!response.ok) return fail(503, requestId);
        const accepted = await response.json();
        if (accepted.error || typeof accepted.id !== 'string' || !accepted.id.trim()) return fail(503, requestId);
        return respond(202, { message: 'Your message was sent. Thank you for getting in touch.' }, requestId);
      } catch { return fail(503, requestId); }
    },
  };
}
