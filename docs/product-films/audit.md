# Replacement film audit — 22 November 2026

This is an audit of the **exported films**, their authoring sources, app sources,
demo records and portfolio player. It precedes the replacement creative work.
Checkpoint: `6e129082c4f3159ab6aeea1a4a2fa78a6b965897` on
`feat/product-films-rebuild`. Originals remain at that commit and in the previous
local production directory. Nothing has been overwritten or unpublished.

## Inspection method and limits

FFprobe inspected all streams. FFmpeg extracted a three-second survey, opening,
ending and source-timeline boundary samples at −.3/−.1/0/+.1/+.3/+.6/+1.2/+2s.
See `old-film-evidence/`, with labeled transition sheets and metadata. Source
inspection includes `index.html`, `scene.js`, narration/timeline JSON and native
capture scripts. `film-production/tools/audit-old.py` reproduces the extraction.

The image-capable inspection available here reads extracted frames and ordered
motion samples; it does **not** amount to watching/listening to the entire MP4.
Normal-speed/browser playback and metadata checks are additional technical
evidence, not a substitute for perceptual audiovisual review. No claim of having
watched the films is made. Sound judgments below concern mix/timing evidence and
script density, not an invented listening review.

## Inventory and delivery baseline

| Film | Export | Actual duration | Delivery |
|---|---|---:|---|
| Nura | `nura-80.mp4` | 80.0s | 1920×1080, 30fps, H.264/AAC |
| StudyFlow | `studyflow-81.mp4` | 81.0s | 1920×1080, 30fps, H.264/AAC |
| Vyaya | `vyaya-26.mp4` | 26.1s | 1920×1080, 30fps, H.264/AAC |

The shelf, three `/films/[slug]` pages, and two project-page players all read
`lib/project-films.ts`. Controls, caption tracks, poster images, viewer-initiated
loading, dismissal pause and focus return are useful infrastructure to retain.
There are exactly three Product Films; Nura is not a reviewed catalogue entry.

## Nura

1. **Product:** Apple Watch health-data analytics, with a unified dashboard,
   daily summaries, period analytics, activity/workouts and historical browsing.
2. **Audience/purpose:** people already collecting watch data who want context
   across days and metrics, rather than disconnected numbers.
3. **Value:** see current readings and longer-term patterns with inspectable
   score inputs. Scores are app estimates, not validated diagnoses.
4. **Strong shipped features:** daily/period health summaries, trends, workout
   details and zones, calendar navigation, separate recovery and sleep pages.
   Source-level verification and exclusions are recorded in `nura-product.md`.
5. **Compelling screens:** dashboard summary; health contributions/trend chart;
   workout heart-rate trace/zones; calendar with selected day's records.
6. **Useful interactions:** open health summary; change day/period scope;
   inspect workout; select an earlier day. Zone→workout cross-linking must be
   independently verified before implying a continuous drilldown.
7. **Weak shots:** abstract rings lead for 4.6s; recovery leads 4.8–15.2s and
   sleep 15.4–26s. Broader health purpose waits until 36.5s. Most UI is scaled
   down into the same 1540×780 wrapper. Dense methodology at 70–76s cannot be
   read as editorial proof. Top of the target shot is visibly clipped.
8. **Transition failures:** at 4.7, 15.3, 52.7, 60.4 and 69.9s sampled frames
   lose nearly all useful content. Repeated .5s fade-out/.65s fade-in looks
   like page replacement, with no spatial continuity. The **first decoded
   frame is a recovery poster**, then the abstract intro appears at .1s:
   an actual opening discontinuity caused by baking the wrong poster.
9. **3D:** three metallic toruses and detached end mark are legible shapes but
   communicate no actual analytic relationship. Repeated glossy materials,
   no grounded staging, no useful UI relationship. Remove them.
10. **Script:** score-by-score documentation dominates. Body Age and target
    planner take scarce hero-film time and invite interpretation far beyond a
    quick overview. Daily versus selected-period constructs need visible labels.
11. **Bad data:** old generator hardcodes recovery/sleep, repeats 45-minute
    workouts and zone splits, uses a 120–150 HR trace while declaring HRmax170
    and zone4/5 minutes, and REM segment sums disagree with REM totals.
    These failures require replacing the seed and recomputing derived scores.
12. **Pacing:** too slow for feature-by-feature holds, too fast for dense
    medical-method text. The product overview never gets its own clear opening.
    Replace with a 40–50s dashboard-first story, keeping supporting signals late.

## StudyFlow

1. **Product:** subject-based study planner, focus timer, session log and progress
   analytics linked to weekly goals.
2. **Audience/purpose:** students and self-directed learners balancing several
   subjects and wanting a record of where their effort went.
3. **Value:** one continuous loop: plan → focus → save → see progress.
4. **Strong shipped features:** per-subject weekly goals/date plans; Pomodoro,
   custom and stopwatch modes; pause/resume/distraction logging; focus-rated
   session save; filtered history, charts and heatmap.
5. **Compelling screens:** weekly planner with three active subjects, large timer,
   completed-session review, updated progress and subject breakdown.
6. **Useful interactions:** choose a subject; start and pause; save a real session;
   show the same time added to goal credit and history.
7. **Weak shots:** subject rename at 4.7–12.1s spends time on setup and leaves
   most of the frame empty. Planner is too small for its seven columns. Timer
   and save modal share the same split layout for 26s. Statistics shrink dense
   charts into a generic window instead of selecting a meaningful question.
8. **Transition failures:** near-empty 4.6/12.2s boundary frames; every new shot
   lifts32px and flattens2.5° with the same fade. **First decoded frame is a
   focus-session poster**, then the clock intro replaces it. Source videos
   include scrolling independent of the wrapper camera, weakening continuity.
9. **3D:** a generic timer slab duplicates an existing, better native timer.
   Star/extruded mark plus arbitrary orbit adds visual machinery without value.
10. **Script:** a menu tour (“your subjects”, “your week”, eight numbered steps)
    instead of a learner's outcome. Preserve male narration but cut redundant
    instructions; show one coherent session changing the plan.
11. **Bad data:** old seed has 175 near-daily repeated records and reused notes;
    hour-of-day histogram is dominated by the same synthetic time. New seed
    must derive totals from distinct, dated records, with no future completions.
12. **Pacing:** 81s is excessive for basic naming and timer mode changes.
    Focus on a 40–50s workflow with a clear before/after and a quiet end hold.

## Vyaya

1. **Product:** spending and earned-income tracker; separates Everyday, Fees &
   Funding and Settlements rather than mixing all money movements.
2. **Audience/purpose:** people tracking purchases, subscriptions and income,
   including people whose funding and repayments obscure everyday spending.
3. **Value:** understand spending and the money left after expenses; inspect the
   transactions behind totals. “Budget/spending tracker” remains the category,
   but do not claim an implemented envelope-budget system or bank sync.
4. **Strong shipped features:** period/category summaries, income-to-category
   flow, real transaction drilldowns, quick entry, three operational lanes.
5. **Compelling screens:** meaningful month overview, Sankey/category breakdown,
   filtered transaction list and explicit lane switches.
6. **Useful interactions:** select a category; inspect its purchases; add one
   purchase with a category; switch funding/settlements separately.
7. **Weak shots:** dashboard at 3–9s is too small to read; Sankey at 9–13s sits
   distant at right while copy occupies the strongest space. Tall expense form
   appears isolated. Three-lane finale substitutes blocks for actual feature UI.
8. **Transitions:** repeated title-left/object-right framing means little visual
   development. Data panels fade instead of carrying an object between views.
   Need explicit row/category/period continuity rather than more effect presets.
9. **3D:** glossy loose expense cards, scattered tokens and parallel stacks are
   toy-like; no trustworthy relation to actual totals. Remove all three.
10. **Script:** generally accurate category framing, but “what's left” must mean
    tracked income minus tracked expenses, never imply a verified bank balance.
    Explain lane separation with real app states near the end.
11. **Bad data:** previous seed inserts Salary into every month, including
    authored no-income months, and overwrites wages using a formula. Replace
    with a manually authored ledger; generic Salary, no personal names.
12. **Pacing:** 26s gives the form and lanes too little useful reading time while
    still spending precious seconds on decorative geometry. Target 30–36s with
    income/spend first, concrete drilldown, entry, lanes, end card.

## Replacement gates

No decorative 3D is carried forward. Every hero shot must use fresh native UI
captures, expose a clear focal point and hold readable final positions. Data
checks happen before capture. Every transition receives a dense frame strip;
frame0 must belong to the actual opening. New filenames preserve old exports.
No release occurs until source, rendered frame evidence, playback and portfolio
checks are complete. Subjective evaluation must report inspection limitations.
