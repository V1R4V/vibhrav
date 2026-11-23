# Product-film replacement delivery

Three native product demonstrations, independently directed and rendered:

| Film | New runtime | Original | Concrete replacement |
|---|---:|---:|---|
| Nura |46s|80s|Overview first; distinct daily/period windows; workout trace, zones and historical day; sleep/recovery support the close|
| StudyFlow |44s|81s|One Algorithms session links plan→timer→reflection→actual saved progress; male narration|
| Vyaya |34s|26s|Tracked income/spend, category purchases and a real$5.25save; native three-lane controls near the end|

Every film has a1920×1080/30FPS master, optimized H.264/AAC web export, a composed
poster, measured WebVTT captions and an editable Remotion composition. New
versioned files preserve all old exports. No invented product capability,
personal record, production marker or third-party reference footage is used.

## Review package

- [Initial audit](audit.md), [old decoded evidence](old-film-evidence/)
- [Reference research](references.md), [editorial/motion system](design-system.md)
- [Scripts and storyboards](storyboards.md)
- Verified inventories: [Nura](nura-product.md), [StudyFlow](studyflow-product.md), [Vyaya](vyaya-product.md)
- [Source/asset/export hashes](asset-manifest.json), [licenses](licenses.md)
- [Rendered-output critiques and limitations](qa.md), [final decoded contact sheets](review-evidence/)
- [Reproduction instructions](../../film-production/README.md)

The capture manifests record each native route/state, fictional source records,
viewport/DPR, focal rectangles and image identity. Nura's engine-derived seed
passes2865checks; StudyFlow passes335including the native saved session; Vyaya's
cent-based ledger and actual save preserve188existing records and add one row.

## File paths

- `film-production/remotion/src/{Nura,StudyFlow,Vyaya}.tsx`: editable timelines
- `film-production/deliverables/{slug}/master.mp4`: high-quality local masters
- Same directory: `poster.png`, `captions.vtt`, `script.txt`
- `public/cinematic/films/{slug}-{duration}-v3.mp4`: shipped web movies
- `public/cinematic/films/{slug}-v3-poster.webp`, `{slug}-v3.vtt`
- `film-production/qa/{slug}/final/`: exact decoded survey/transition frames
- `film-production/qa/technical/`: complete decode/audio/caption checks
- `film-production/qa/browser/`: real browser playback/layout/accessibility evidence

Large masters, raw mixed music and decoded-frame build artifacts remain local;
finished web exports, sources, capture assets and review contact sheets are
versioned. Use the production README to regenerate them.

The original assets remain at `checkpoint/product-films-before-rebuild`, commit
`6e129082`, and in `public/cinematic/films/`. Restore the old metadata paths to
roll back without needing to recreate old footage.

## Honest remaining limits

The visual review uses decoded frames, full-resolution crops and chronological
transition strips; browser playback is automated. Full human audiovisual
viewing/listening is not claimed. A person should assess the voice performance
on speakers/headphones. Dense UI is best read fullscreen on a phone. Vyaya's
public app URL remains unverified, so no invented trial link is shown. Native
health scores are app estimates; no clinical validation is implied.

## Verification evidence

[Technical results](technical-results.json) contain full-file decode, audio,
stream/frame and timed-caption checks. [Playback results](playback-results.json)
contain end-to-end1×playback with0dropped frames/no waits and all listed transition
intervals at.5×. [Audio remux](audio-remux.json) confirms picture packets unchanged.
The full133browser tests and19contact tests passed. The dedicated close-regression
fix receives a separate focused check because it is added after that broad run.
