import test from 'node:test';
import assert from 'node:assert/strict';
import { browserContactConfiguration, sendBrowserContact } from '../lib/contact/browser.mjs';
const key = '00000000-0000-4000-8000-000000000001';
const values = { name: ' Test visitor ', email: ' visitor@example.com ', message: ' A message about a software engineering opportunity. ', website: '' };
test('uses only a valid public Web3Forms key and exposes no private environment values', () => {
  for (const value of ['', '[SENSITIVE]', 'bad']) assert.equal(browserContactConfiguration({ NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: value }), null);
  const config = browserContactConfiguration({ NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY: key, RESEND_API_KEY: 'private' });
  assert.equal(config.provider, 'web3forms'); assert.equal(config.accessKey, key);
  assert.ok(!JSON.stringify(config).includes('private'));
});
test('submits directly to Web3Forms with reply address, honeypot and fixed subject', async () => {
  let captured;
  const result = await sendBrowserContact(key, values, new AbortController().signal, async (url, options) => {
    captured = { url, ...JSON.parse(options.body) }; return Response.json({ success: true });
  });
  assert.equal(result.status, 202);
  assert.deepEqual(captured, { url: 'https://api.web3forms.com/submit', access_key: key, name: 'Test visitor', email: 'visitor@example.com', message: values.message.trim(), subject: 'Portfolio contact', from_name: 'Vibhrav Jha · Portfolio', botcheck: false });
});
test('honeypot and invalid fields stop submission before the provider', async () => {
  for (const patch of [{ website: 'spam' }, { email: 'invalid' }, { name: 'a' }, { message: 'short' }]) {
    const result = await sendBrowserContact(key, { ...values, ...patch }, undefined, () => { throw Error('must not send'); });
    assert.equal(result.status, 400);
  }
});
test('only explicit successful provider responses report success', async () => {
  for (const [body, status] of [[{}, 200], [{ success: false }, 200], [{ success: true }, 500], [{ success: false }, 429]]) {
    const result = await sendBrowserContact(key, values, undefined, async () => Response.json(body, { status }));
    assert.equal(result.status, status === 429 ? 429 : 503);
  }
  await assert.rejects(sendBrowserContact(key, values, undefined, async () => { throw Error('timeout'); }));
  await assert.rejects(sendBrowserContact(key, values, undefined, async () => new Response('not JSON')));
});
