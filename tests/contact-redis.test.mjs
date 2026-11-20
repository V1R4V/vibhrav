import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFile } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';
import { createContactHandlers } from '../lib/contact/server.mjs';

const run = promisify(execFile);
const origin = 'https://portfolio.example';
const visitor = { name: 'Synthetic visitor', email: 'synthetic@example.net', message: 'This is a synthetic Redis integration test message.', website: '' };
const env = {
  RESEND_API_KEY: 'synthetic-key', CONTACT_FROM: 'Portfolio <hello@example.com>', CONTACT_TO: 'synthetic@example.com',
  CONTACT_ALLOWED_ORIGINS: origin, CONTACT_FORM_SECRET: 'synthetic-hmac-secret-at-least-32-characters',
  UPSTASH_REDIS_REST_URL: 'https://synthetic-redis.example', UPSTASH_REDIS_REST_TOKEN: 'synthetic-token', VERCEL: '1',
};
function request(body, ip = '203.0.113.1') {
  return new Request(`${origin}/api/contact`, { method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-vercel-forwarded-for': ip }, body: JSON.stringify(body) });
}

test('real Redis atomically enforces contact limits across two application instances', async (t) => {
  // Keep Darwin's Unix socket path short; use the system temp directory on CI.
  const directory = await mkdtemp(join(process.platform === 'darwin' ? '/tmp' : tmpdir(), 'portfolio-contact-redis-'));
  const socket = join(directory, 'redis.sock');
  const child = spawn('redis-server', ['--port', '0', '--unixsocket', socket, '--unixsocketperm', '700', '--save', '', '--appendonly', 'no', '--dir', directory], { stdio: ['ignore', 'ignore', 'pipe'] });
  let startupError;
  let stderr = '';
  child.on('error', (error) => { startupError = error; });
  child.stderr.on('data', (chunk) => { stderr = `${stderr}${chunk}`.slice(-2000); });
  const redis = async (...command) => {
    const { stdout } = await run('redis-cli', ['-s', socket, '--json', ...command.map(String)], { timeout: 5000 });
    return JSON.parse(stdout);
  };
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (startupError) throw startupError;
      if (child.exitCode !== null) throw new Error(`Owned Redis exited before readiness: ${stderr}`);
      try { ready = await redis('PING') === 'PONG'; } catch { /* Socket may not exist until Redis is ready. */ }
      if (ready) break;
      await delay(25);
    }
    assert.ok(ready, `Owned Redis did not become ready: ${stderr}`);
    let clock = 1_800_000_000_000;
    const accepted = new Map();
    const providerKeys = [];
    let timeoutAfterAcceptance = false;
    const fetcher = async (url, options) => {
      if (url === env.UPSTASH_REDIS_REST_URL) return Response.json({ result: await redis(...JSON.parse(options.body)) });
      assert.equal(url, 'https://api.resend.com/emails');
      const key = options.headers['Idempotency-Key'];
      providerKeys.push(key);
      const existing = accepted.get(key);
      if (existing) assert.equal(existing.body, options.body, 'Idempotent retry must retain its exact envelope');
      else accepted.set(key, { body: options.body, id: `synthetic-${accepted.size + 1}` });
      if (timeoutAfterAcceptance) { timeoutAfterAcceptance = false; throw new DOMException('Synthetic timeout after acceptance', 'TimeoutError'); }
      return Response.json({ id: accepted.get(key).id });
    };
    const instances = [0, 1].map(() => createContactHandlers({ env, now: () => clock, fetch: fetcher }));
    const bodies = async (count) => {
      const values = await Promise.all(Array.from({ length: count }, async (_, index) => {
        const response = await instances[index % 2].GET(new Request(`${origin}/api/contact`));
        assert.equal(response.status, 200);
        return { ...visitor, challenge: (await response.json()).challenge };
      }));
      clock += 2000;
      return values;
    };
    const reset = async () => { await redis('FLUSHDB'); accepted.clear(); providerKeys.length = 0; };

    await t.test('concurrent sends across instances allow only five per trusted IP', async () => {
      await reset();
      const values = await bodies(12);
      const responses = await Promise.all(values.map((body, index) => instances[index % 2].POST(request(body))));
      assert.equal(responses.filter((response) => response.status === 202).length, 5);
      assert.equal(responses.filter((response) => response.status === 429).length, 7);
      assert.equal(accepted.size, 5);
      for (const response of responses.filter((value) => value.status === 429)) assert.ok(Number(response.headers.get('retry-after')) > 0);
      assert.equal(await redis('GET', 'contact:global'), '5');
    });

    await t.test('different trusted IPs still share the atomic thirty-message global limit', async () => {
      await reset();
      const values = await bodies(40);
      const responses = await Promise.all(values.map((body, index) => instances[index % 2].POST(request(body, `203.0.113.${index + 1}`))));
      assert.equal(responses.filter((response) => response.status === 202).length, 30);
      assert.equal(responses.filter((response) => response.status === 429).length, 10);
      assert.equal(accepted.size, 30);
      assert.equal(await redis('GET', 'contact:global'), '30');
    });

    await t.test('an ambiguous send retries safely across instances with three total attempts', async () => {
      await reset();
      const [body] = await bodies(1);
      timeoutAfterAcceptance = true;
      assert.equal((await instances[0].POST(request(body))).status, 503);
      assert.equal((await instances[1].POST(request({ ...body, message: 'A changed synthetic payload that must never be sent.' }))).status, 409);
      assert.equal((await instances[1].POST(request(body))).status, 202);
      assert.equal((await instances[0].POST(request(body))).status, 202);
      assert.equal((await instances[1].POST(request(body))).status, 409);
      assert.equal(accepted.size, 1);
      assert.equal(providerKeys.length, 3);
      assert.equal(new Set(providerKeys).size, 1);
      assert.equal(await redis('GET', 'contact:global'), '1', 'Retries must not consume additional send quota');
      const nonceKey = (await redis('KEYS', 'contact:nonce:*'))[0];
      assert.equal(await redis('HGET', nonceKey, 'attempts'), '3');
      assert.match(await redis('HGET', nonceKey, 'digest'), /^[\w-]{43}$/);
      assert.ok(await redis('TTL', nonceKey) > 0);
    });
  } finally {
    if (child.pid && child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit');
      child.kill('SIGTERM');
      await exited;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
