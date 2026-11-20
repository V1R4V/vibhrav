# Contact delivery setup

Configure these server-only environment variables in Vercel or an ignored
`.env.local` file. Never use a `NEXT_PUBLIC_` prefix for credentials.

- `RESEND_API_KEY`: sending key from Resend.
- `CONTACT_FROM`: verified sender address.
- `CONTACT_TO`: destination inbox.
- `CONTACT_ALLOWED_ORIGINS`: exact comma-separated allowed origins.
- `CONTACT_FORM_SECRET`: random secret of at least 32 characters.
- `UPSTASH_REDIS_REST_URL`: Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN`: writable Redis REST token.

Use `.env.example` for the variable names and origin examples. Verify the sender
with Resend and configure persistent Upstash Redis before enabling the form.
The visitor address is used as reply-to, never as the sender.

After configuration, submit a clearly identified test message through the actual
website. Confirm receipt in the configured inbox, including spam folders, and
check that Reply addresses the visitor. Provider acceptance alone does not prove
inbox delivery. Do not commit provider IDs or test-message contents.

The endpoint validates JSON, field limits, a honeypot and a signed form challenge.
Redis applies persistent rate limits and retry protection. Missing configuration
or provider failures return an error and retain the direct email fallback.

Run `npm run test:contact` for unit and real isolated Redis tests. The browser
suite verifies interface states; intercepted provider responses do not send mail.
