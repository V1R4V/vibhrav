# Vibhrav Jha portfolio

Personal engineering portfolio built with Next.js, React, TypeScript, Three.js
and GSAP. Includes an animated introduction, eight experience entries, six
flagship exhibits, a searchable 33-project catalogue, leadership and an
interactive ink footer.

## Local development

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 4310
```

Open http://127.0.0.1:4310. To preview a production build, run `npm run build`,
then `npm run start -- --hostname 127.0.0.1 --port 4310`.

The first-visit curtain plays once per browser session. Motion controls,
reduced-motion preferences and static WebGL fallbacks are supported.

## Checks

```sh
npm run lint
npm run typecheck
npm run test:contact
npm run test:browser
```

Contact integration tests require `redis-server` and `redis-cli`. Browser tests
use Google Chrome. For CI, build first and run browser tests with `CI=1`.

## Contact configuration

Configure server-only email and rate-limit credentials following
[contact setup](docs/contact-setup.md). Until configured, the form offers direct
email. Provider acceptance alone does not establish actual inbox delivery.

Public portfolio content lives in `lib/portfolio-data.ts` and
`lib/public-copy.ts`. Private work references, editorial verification and
local project inventories are excluded from this repository.
