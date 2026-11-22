# Project documentation and browsing

Project detail pages retain the reviewed case study and provide a direct reading
link. Public repositories have a rendered README below the overview and imagery.
Projects without a public README link to the existing project notes instead.

`content/project-readmes/` contains 27 public README snapshots captured November
21, 2026. `index.json` records each source URL, raw asset base, Git blob hash,
content fingerprint and capture date. Only unauthenticated public GitHub
responses were imported. Private repositories and local research files are not
documentation sources for this feature. Fashion-MNIST's linked repository did
not return a README, so that page uses its existing notes.

The server renders Markdown with GFM tables, code blocks, lists and links.
Raw HTML is skipped. The image-only PCA README has two explicit image URLs in
its snapshot metadata so it renders without enabling arbitrary HTML. URLs pass the renderer's protocol filter, relative paths
resolve against the repository, and local table-of-contents links target the
embedded document. Native details/summary keeps the full README optional and
works without JavaScript. Snapshots avoid runtime GitHub requests and rate limits.
To refresh one, retrieve its public README again and update its file and manifest
together; inspect any changed content before publishing.

The project chooser shows all 34 projects using existing titles and imagery.
It supports native touch/trackpad scrolling, explicit left/right buttons, arrow
keys, Home/End and ordinary project links. It has no automatic rotation. Reduced
motion uses immediate scrolling. Initial positioning changes horizontal scroll
only, preserving the detail page's title position. With JavaScript disabled,
the list remains scrollable and its links remain usable.

The implementation does not change reviewed project narratives, experience
bullets or leadership copy. Check with `npm run typecheck`, `npm run lint`,
`npm run build` and `CI=1 npx playwright test tests/project-reading.spec.ts`.
The browser checks cover rendering, anchors, project navigation, touch and
keyboard input, no-JavaScript use, narrow viewports and accessibility.
