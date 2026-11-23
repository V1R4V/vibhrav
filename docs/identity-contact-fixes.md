# Identity, quick links, and contact repair

The animated hero, navigation signature, and footer now consistently use
“Vibhrav Jha”. Letter entrances and the existing cinematic scroll choreography
are preserved. Reusable monochrome line icons link to the existing LinkedIn,
GitHub, résumé PDF, and email in the hero and footer. No unverified YouTube URL
has been invented.

## Contact root cause and repair

Production returned HTTP 503 because the endpoint required Resend and Upstash
settings, while the Vercel project only contained its original
`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. The API now advertises the configured public
Web3Forms form ID, and the client submits directly to that provider as its free
plan requires. Private Resend keys are never exposed. The existing signed
challenge, Redis limits, and idempotent Resend implementation remain the
alternative when Web3Forms is not configured.

The browser and server use the same validation schema. The managed path uses
Web3Forms' server-side spam checks, plus the existing honeypot and minimum fill
time in the UI. It does not claim the Redis limits or Resend idempotency.
Only HTTP success AND `success: true` from the provider clears the form and
shows acceptance. A timeout or ambiguous failure preserves the message,
disables duplicate submission, and offers direct email. There is no automatic
retry of non-idempotent provider requests.

References: [API and browser-side requirements](https://docs.web3forms.com/getting-started/api-reference),
[provider spam protection](https://docs.web3forms.com/getting-started/customizations/spam-protection).

## Verification

- New provider tests reproduced missing implementation before the fix.
- 23 contact tests pass, including existing real Redis integration, shared
  validation, provider failure, malformed replies, and spam fields.
- Browser checks cover title-case names, quick links, responsive bounds,
  accessibility, accepted submissions, uncertain delivery, the existing
  Resend client path, navigation, and project pages.
- Browser provider submissions in automated tests are intercepted; they do
  not send email. Live inbox receipt requires an authorized real submission
  and confirmation from the inbox owner. Do not treat API readiness or mock
  acceptance as delivery evidence.
- Visual review includes desktop hero and mobile hero/footer screenshots.
- Six existing unrelated img lint warnings remain; no new lint errors.
