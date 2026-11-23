import { fields } from './validation.mjs';

// This provider intentionally uses a public form ID, never an email API secret.
export function browserContactConfiguration(env) {
  const accessKey = env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(accessKey)) return null;
  return { provider: 'web3forms', accessKey, challenge: 'web3forms', readyAfterMs: 1500, expiresAfterMs: 600000 };
}

export async function sendBrowserContact(accessKey, values, signal, fetcher = fetch) {
  const parsed = fields.safeParse({ ...values, challenge: 'web3forms' });
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).map(([key, errors]) => [key, errors[0]]));
    return Response.json({ fieldErrors }, { status: 400 });
  }
  const { name, email, message } = parsed.data;
  const response = await fetcher('https://api.web3forms.com/submit', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, signal,
    body: JSON.stringify({ access_key: accessKey, name, email, message, subject: 'Portfolio contact', from_name: 'Vibhrav Jha · Portfolio', botcheck: false }),
  });
  const data = await response.json();
  // An HTTP 200 without the provider's explicit success flag is not acceptance.
  const status = response.ok && data.success === true ? 202 : response.status === 429 ? 429 : response.status === 400 ? 400 : 503;
  return Response.json({}, { status });
}
