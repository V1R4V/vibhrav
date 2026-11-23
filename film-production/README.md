# Product films — editable production package

Three independent Remotion compositions: Nura46s, StudyFlow44s, Vyaya34s.
All are1920×1080 at30FPS. Original films remain in the portfolio public folder
and at `checkpoint/product-films-before-rebuild` (`6e129082`).

## Reproduce a render

Use Node22+ and FFmpeg/ffprobe. The Remotion project has its own pinned React19
and TypeScript dependencies; the portfolio remains on React18.

```sh
cd film-production/remotion
npm ci
npm run lint
npm run dev
npx remotion render Nura ../deliverables/nura/master.mp4 --crf=12 --concurrency=3 --license-key=free-license
npx remotion render StudyFlow ../deliverables/studyflow/master.mp4 --crf=12 --concurrency=3 --license-key=free-license
npx remotion render Vyaya ../deliverables/vyaya/master.mp4 --crf=12 --concurrency=3 --license-key=free-license
```

The free Remotion license setting is appropriate to this individual portfolio;
review Remotion's license before reusing it for a different organization.
The renderer uses its bundled Chrome. Capture assets and fonts are already
included; recapturing applications is optional for reproducing these frames.

Audio is generated locally, not stored as separately redistributable tracks.
Create a Python environment with `kokoro-onnx`, `numpy`, `soundfile`, `Pillow`.
`FILM_TTS_DIR` points at the Kokoro model/voice directory containing
`models/kokoro-v1.0.onnx` and `voices/voices-v1.0.bin`. Default:
`~/.cache/hyperframes/tts`. Obtain the model from its primary licensed source.
`FILM_MUSIC_DIR` can point at licensed source files; otherwise the audio tool
attempts to fetch the exact Mixkit previews documented in `docs/product-films/licenses.md`.

From repository root:

```sh
python film-production/tools/audio.py
python film-production/tools/export-web.py
python film-production/tools/technical-qa.py
python film-production/tools/manifest.py
python film-production/tools/inspect-render.py nura film-production/deliverables/nura/master.mp4 final
```

Replace `python` with the configured environment's interpreter. Captions use
measured speech duration. Source scripts live in `audio/narration.json`.
Mixkit may deny automated requests; provide those licensed files through
`FILM_MUSIC_DIR` in that case. Audio files must exist before rendering. Masters, raw audio and decoded QA
frames are ignored build artifacts; web exports/posters/captions are tracked.

## Native UI capture

Capture scripts use root Playwright,1440×1000 CSS pixels,DPR2, loaded fonts and
fictional local data. Do not use a personal account or production health records.

- Nura: source revision and invariants in `docs/product-films/nura-product.md`.
  `capture/nura/seed.mts` runs against `NURA_SOURCE` (default isolated source
  `/tmp/nura-brag-capture-20261121`) using its actual TypeScript engine. Run with
  that source's `tsx`; it writes the demo dataset into that source's data folder.
  Start its native Next app on3238 with that fixture; then run `capture.mjs`.
  `NURA_DATASET` can override the validator dataset path.
- StudyFlow: isolated native Vite source on3259. `capture/studyflow/capture.mjs`
  seeds guest local storage from `seed.mjs`, controls the clock, executes the
  actual45-minute save and captures all states. Override server with
  `STUDYFLOW_CAPTURE_ORIGIN`. Static font responses are cached alongside it.
  `validate.mjs` imports the source app's actual `weekProgress()` implementation;
  update its source import if cloning to a different path.
- Vyaya: isolated source on5177, seeded by `make-demo.mjs`. Run `capture.mjs`,
  `capture-purchases.mjs`, then `finish-entry.mjs`. These operate only on a fresh
  fictional browser context. Actual Save uses the native changing button label.
  `source-verification.json` classifies capture-only source differences.

All dates/windows, image hashes and routes are documented under `capture/`.
Source paths record this machine's provenance; use equivalent isolated clones
at those paths or adjust capture origins/source imports when reproducing.

## Delivery and review

- Masters: `deliverables/{slug}/master.mp4`
- Captions, script and poster: same per-film folder
- Web exports: `../public/cinematic/films/*-v3*`
- Raw decoded frame/transition evidence: `qa/{slug}/final/`
- Technical decode/loudness results: `qa/technical/`
- Versioned review documents/contact sheets: `../docs/product-films/`

See the audit, references, storyboards, design system, per-product verified
inventory, asset manifest and QA notes there. No arbitrary3D asset or third-party
reference footage is included. The production project is not imported by Next.
