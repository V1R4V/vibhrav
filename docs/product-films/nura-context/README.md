# Nura — Behind the number

Standalone54s film,1920×1080,30FPS. New composition `NuraContext`; existing Nura, StudyFlow and Vyaya films remain intact. The new film is authored motion graphics rather than a screen recording or a reconstruction of app screens.

## Reproduce

1. `cd film-production/remotion && npm ci --ignore-scripts`.
2. Fetch the CC0 studio reflection asset listed in `asset-manifest.json` into `film-production/public/context/`. Font and brand resources already reside under `public/brand/`.
3. Use the existing fictional capture environment (`capture/nura/seed.mts`) if regenerating source records. `NURA_SOURCE=/path/to/isolated/nura node --experimental-strip-types film-production/context/export-data.mts` recomputes the film JSON with the native engine. The committed compactJSON is sufficient to render visuals without running Nura.
4. For immediate preview, extract the combined soundtrack from the supplied finished master: `ffmpeg -i /path/to/Nura-Behind-the-Number-1080p.mp4 -vn -ar 48000 film-production/public/context/mix.wav`. This keeps licensed music inside the supplied film rather than redistributing a standalone track. To regenerate narration and mix, run `context/audio.py` using the same Kokoro82M environment documented in ../licenses.md. The script fetches the licensed track if absent. `mix.wav` is an authoring intermediate, deliberately ignored rather than distributed as standalone music.
5. `node film-production/context/validate.mjs` checks the film data and narration timing. Run the existing `capture/nura/validate.mjs` against the raw seeded source for its2,865 additional checks.
6. In `film-production/remotion`: `npm run lint`; `npx remotion bundle src/index.ts`; `npx remotion render build NuraContext ../deliverables/nura-context/Nura-Behind-the-Number-1080p.mp4 --gl=angle --concurrency=3 --crf=15 --audio-bitrate=320k`.
7. `context/inspect-film.py /absolute/path/to/movie.mp4` generates exact-frame survey and transition contact sheets. `context/preview.mjs` takes frame numbers and renders stills from the prebuilt bundle with one shared browser, avoiding bundler-cache write races.

The master and web encodes are the same film. Any draft files are internal review artifacts, not alternative creative deliveries. See treatment.md for the storyboard and qa.md for observed results and limits.

Preview the completed delivery with `node film-production/context/review-server.mjs /path/to/delivery-folder`. It binds only127.0.0.1 and implements byte ranges so scrubbing and native captions work. The plain Python HTTP server is unsuitable for this check because it advertises no seekable range.
