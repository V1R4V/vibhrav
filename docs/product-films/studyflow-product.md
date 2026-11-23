# StudyFlow — product truth and capture audit

## Product and audience

StudyFlow is a subject-based study timer, weekly planner, and session journal for students and independent learners. Its practical promise is continuity between the hours a learner plans, the work they actually time, and the record they review afterwards. It is not a learning-outcome or productivity-scoring engine.

Verified source: `/Users/vibhravjha/Code/StudyFlow`, commit `47c1e61d1045338e31f043b2d52e2751b2f91d6d`. The source working tree has an unrelated preexisting `.gitignore` modification, left untouched. Capture uses an existing isolated tracked-source copy at `/tmp/studyflow-brag-v2-capture-20261122`, served on `http://127.0.0.1:3259`.

## Strongest implemented features

| Feature | Actual source | Meaningful native interaction | Visual priority |
|---|---|---|---|
| Per-subject weekly goals and explicit date plans | `src/pages/CommandCenter.jsx`, `src/utils/plan.js`, `src/utils/progress.js` | Edit a Saturday hour cell; commit on Enter; per-subject actual/goal bars remain distinct from plans | High: a compact three-subject week makes the relationship legible |
| Focus timer with subject association | `src/components/StudyTimer.jsx`, `src/context/TimerContext.jsx` | Select Algorithms, choose Custom, enter 45 minutes, Start, Pause and Resume | High: large readable timer with actual state changes |
| Session completion and reflection | `src/components/EndSessionModal.jsx`, `src/context/TimerContext.jsx` | Auto-end the custom timer, rate focus, enter specific notes, save | High: shows what is being recorded, rather than a decorative countdown |
| Shared progress updates | `src/context/StudyDataContext.jsx`, `src/pages/Dashboard.jsx`, `src/utils/progress.js` | Save once; dashboard, planner and history all reflect that session | Highest proof of product value |
| Searchable/filterable session history | `src/pages/Sessions.jsx`, `src/utils/sessionHistory.js`, `src/utils/sessionTiming.js` | Set range to All, filter to Algorithms; read source timestamps, notes and ratings | Supporting, keep top rows readable |
| Derived analytics | `src/pages/Statistics.jsx`, `src/components/StudyTimingCard.jsx` | Select all-time range, switch weekday/hour distribution, inspect heatmap | Supporting: actual logged time and self-reported focus only |
| Subject management | `src/pages/SubjectManager.jsx`, `src/components/SubjectForm.jsx` | Create/edit a name and color | Real but less compelling than the plan–focus–review loop |
| Natural-language reminders | `src/pages/Reminders.jsx`, `src/utils/reminderParse.js` | Reminder creation and scheduling | Implemented, omitted from the hero film to preserve narrative focus |

## Claims and limitations

- The film may say: plan subjects, choose a timer, save a session with notes, review actual hours and patterns.
- Focus ratings are **self-reported**, not inferred attention or validated cognitive measurements.
- A timer does not prove learning or absence of distraction. Do not promise better grades, diagnosis, or quantified learning gains.
- Guest mode stores data in localStorage. Captures use this real native mode; they do not claim to demonstrate cloud synchronization.
- The `src/utils/formatters.js` file contains old unused TODO helpers; production pages use `progress.js` and `sessions.js`. Do not claim the scaffold file itself proves a broken visible feature.
- Weekly goals and scheduled hours are distinct. Plans may be edited independently of completed study.
- Goal credit is capped at each subject's own goal; excess time in one subject cannot complete another subject's goal.
- Daily schedule progress is similarly capped per subject, so total focus minutes can exceed total scheduled minutes before all scheduled subjects are complete. Do not label the after shot “schedule complete.”

## Old demo-data weaknesses

The previous full-workflow seed manufactured 175 near-daily dates using repeating 25–75-minute durations and six reused notes. That created an unusually regular activity pattern and generic history. It also assigned `pomodoro` to some sessions longer than the app's 25-minute automatic cap. The new source records remove that mode inconsistency: historical sessions are Custom or Stopwatch, and the demonstrated new session is a real 45-minute Custom session.

The prior capture flow modified a subject and goal while jumping among unrelated pages. The new source-level story keeps the same three subjects throughout and uses a single session to prove the state change. Root's frame-level film audit owns the exact old rendered shot/transition criticism.

## New coherent fictional dataset

Files: `film-production/capture/studyflow/seed.mjs`, `fixture.json`, `validation.json`, `final-storage.json`.

Five weeks of coursework: Algorithms (blue, 6h weekly goal), Computer Systems (teal, 4h), Product Studio (amber, 4h). Every session has a specific study note, start/end timestamps, duration in seconds, a self-reported focus rating, and a plausible distraction count. Sundays are rest days. No completed session is dated after the fixed capture clock.

The current week is **Sunday Nov 15 through Saturday Nov 21, 2026**. Capture clock begins **Friday Nov 20, 13:30 America/Chicago**. The per-date plan totals 14h and matches the 14h of weekly goals. Saturday is future planned work and displays Upcoming, not completed time.

| State | Week actual | Friday actual | Algorithms actual / goal | Overall goal credit |
|---|---|---|---|---|
| Before afternoon session | 9h45 | 1h20 | 4h10 / 6h | 69% |
| After actual native 45min save | 10h30 | 2h05 | 4h55 / 6h | 75% |

Computer Systems remains 2h30 / 4h. Product Studio remains 3h05 / 4h. The new Algorithms session runs 13:30–14:15, is rated 5/5, and records: “Solved two shortest-path problems; compared Dijkstra with BFS.” The capture automation advances its isolated browser clock to demonstrate completion; no real-world elapsed-time claim is made.

The planner-edited capture demonstrates changing Saturday Algorithms from 1h to 1.5h. The script restores it to 1h before the focus sequence so later screenshots consistently refer to the same 14h base plan. The edit is scheduled time, not completed study.

## Reproducible native capture pipeline

Run the isolated app: `npm run dev -- --host 127.0.0.1 --port 3259`.

Run capture: `node film-production/capture/studyflow/capture.mjs`.

Run validation: `TZ=America/Chicago node film-production/capture/studyflow/validate.mjs`.

- Chromium Playwright, viewport 1440×1000, DPR 2 → sharp 2880×2000 PNGs.
- Native Plus Jakarta Sans loaded from a previously captured official Google Fonts response; `document.fonts.ready` awaited and Jakarta font presence checked.
- Dark theme, America/Chicago timezone, fixed date, deterministic fixture.
- Guest mode and blocked outbound services prevent any real account/health/personal data access.
- No application UI reconstruction, DOM text replacement, UI styling changes, invented widgets or fabricated screens.
- Reduced-motion preference avoids capturing intermediate entrance states; each shot waits for native charts/fonts to settle.
- No real person name appears. The actual guest sidebar shows Sign In and dashboard greeting “Good afternoon.”
- `captures.json` records each screenshot's originating route, viewport, DPR, native focal rectangles, scroll position, font status, and visible UI text. All coordinates use CSS pixels; multiply by 2 for source PNG pixel coordinates.
- Validation uses the **actual application's `weekProgress()` implementation**, asserts timestamp/duration agreement, no overlapping sessions, no future sessions, goal/plan totals, and the actual session saved through native UI.

## Capture register and framing advice

All assets under `film-production/public/studyflow/`.

| File | Native state / focal point |
|---|---|
| `dashboard.png` | Before session; all four KPIs, weekly bars, timer and today's subject plan |
| `planner.png` | Three rows and the complete week; 14h planned, 9h45 actual |
| `planner-edited.png` | Real Saturday plan-cell edit to 1.5h |
| `timer-ready.png` | Algorithms selected; custom 45:00 ready to start |
| `timer-started.png` | Native running timer after Start |
| `timer-paused.png` | Native Pause after 12 minutes; 33:00 remaining |
| `session-review.png` | Real completion modal, 45min, focus 5/5 and specific notes |
| `dashboard-saved.png` | Native save reflected in Friday and weekly totals |
| `planner-saved.png` | Algorithms 4h55/6h and weekly 10h30 after saving |
| `history-algorithms.png` | All-time range filtered to Algorithms; newest actual saved session first |
| `statistics.png` | All-time KPIs and subject distribution based on the same records |
| `statistics-weekdays.png` | Native weekday distribution |
| `activity-heatmap.png` | Five-week activity pattern with genuinely empty rest days |

Framing: full dashboard establishes identity; then crop toward the central timer or top KPI row. Use the planner table as a wide, held shot, with a tighter crop on Algorithms progress for the before/after connection. The completion modal is tall; a close-up of focused time, rating and notes is more legible than trying to show every field. Do not scale the full 2880px screenshot down to an unreadable floating postage stamp. At the end, reuse the same dashboard framing with the updated totals to make the causal relationship clear.
