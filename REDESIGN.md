# Portfolio Redesign — Handoff & Source of Truth

> A new, lightweight, editorial portfolio for **Vibhrav Jha** (UW–Madison CS / Data Science / Economics, grad May 2027). This doc lets any agent or human pick up mid-stream. Read it fully before touching code.

---

## 1. Goal & Brief

Build a **brand-new, lightweight, clean** portfolio that shows off range: lots of projects, a deep tech stack, and real shipped experience with metrics. Replaces the old heavy site.

**Two non-negotiables (from the owner):**
1. A **crazy-good hero** page.
2. **Scroll animations** throughout.

**Working style:** design ideas are fed **one at a time**; each is pressure-tested against the editorial-minimal frame and the two non-negotiables before building. Owner explicitly delegates taste calls ("see your taste").

**Content source of truth:** `content.md` (raw inventory) → distilled into typed data at `lib/site-data.ts`. Edit `lib/site-data.ts` going forward; `content.md` is the original dump. **No live LinkedIn integration** (decided: it fights "lightweight" and the hand-tuned copy is better — paste updates manually).

---

## 2. Locked Design Decisions

| Dimension | Decision | Notes |
|---|---|---|
| **Hero concept** | Editorial Minimal | Chosen over kinetic-type / node-graph. "Crazy good" comes from craft density (line-mask reveal, living status line, buttery scroll), not gimmicks. |
| **Aesthetic** | **Editorial Dusk** — dark-first dual theme | A blend of three 2026 directions: *Editorial Noir* (type discipline — kept), *Aurora Graphite* (warm graphite dark, glass surfaces), *Dusk Chromatic* (a violet→rose→amber chromatic ramp as ambient light + the one accent). **Dark is the default**, light is a refined porcelain fallback. Theme toggle via `next-themes` (class strategy) in the nav. |
| **Palette** | Token-driven, retuned per theme | Same semantic token NAMES drive both themes (so components never changed): `--paper`/`--ink`/`--line`/`--burgundy`(=primary accent, now dusk-rose)/`--ember`(amber)/`--teal`(cyan). **Dark:** graphite `#14120F` paper, warm off-white `#F2EDE3` ink, vivid rose `#ED5C92` accent. **Light:** porcelain `#FBF9F3` paper, deep rose `#AE2A50` accent. Gradient stops `--grad-1/2/3` (violet/rose/amber) power `.text-grad`, the brand mark, and the aurora. All in `app/globals.css` (`:root` = light, `.dark` = dark overrides). |
| **Ambient** | Aurora glow field + grain | `components/site/ambient.tsx` — three heavily-blurred drifting chromatic orbs at `z-index:-1` (Soft Gradients 2.0), strength scaled per theme via `--aurora-strength`. Film grain blend-mode is theme-aware (`multiply` light / `soft-light` dark). Both reduced-motion safe. |
| **Type** | Fraunces (display serif) · Inter (body) · JetBrains Mono (labels/dates) | `next/font`. Mono uses tabular figures for metrics. Italic Fraunces + burgundy = the one emphasis accent. |
| **Motion stack** | Framer Motion 11 (already installed) + **Lenis** smooth scroll | Deliberately **no GSAP** to stay light. `EASE = [0.16, 1, 0.3, 1]` (expo-out) used everywhere. |
| **3D moment** | **Cobe globe** (Delhi↔Madison, ~5kb) + duotone tilt-portrait | One intentional, on-brand 3D element (his New Delhi → Madison story), not a generic blob. Lazy-loaded, pauses offscreen, reduced-motion safe. |
| **Photo** | `/IMG_0950.jpg` treated as warm **duotone** (SVG filter) | Used small in About as a pointer-tilt card. NOT a hero background (it's a casual backlit selfie; raw it would read "vacation pic"). |
| **A11y / perf** | `prefers-reduced-motion` fully respected | Lenis disables, all reveals settle, globe stops rotating. Reveals never permanently hide content. |

**Framework:** Next.js 14 App Router, React 18, Tailwind 3.4. Server Components by default; `"use client"` only on interactive pieces.

---

## 3. Architecture / File Map

**New site (all under these paths):**
```
app/
  layout.tsx          # fonts (Fraunces/Inter/JetBrains Mono), <SmoothScroll>, grain, metadata
  globals.css         # warm tokens, grain overlay, .eyebrow/.hairline/.reveal-line, reduced-motion
  page.tsx            # composes: Nav, Hero, Experience, About, Footer
lib/
  site-data.ts        # SINGLE SOURCE OF TRUTH: profile, timeline, metrics, projects,
                      #   projectCategories, skillGroups, marquee, about
components/site/
  smooth-scroll.tsx   # Lenis wrapper (disabled under reduced-motion)
  nav.tsx             # fixed nav, scroll-spy active underline, numbered links, Résumé
  hero.tsx            # editorial hero: line-mask reveal, status line, scroll-parallax fade
  experience.tsx      # center-spine timeline (draws on scroll), alternating sides, logos
  about.tsx           # duotone tilt-portrait + work pillars + personal + <Globe/>
  globe.tsx           # Cobe globe, Delhi↔Madison markers, lazy + offscreen-pause
  footer.tsx          # contact (#contact), email, socials
tailwind.config.ts    # added: fontFamily (sans/display/mono) + warm colors (paper, ink, burgundy, ember, line)
```

**Deps added:** `lenis@^1.3`, `cobe@^0.6`. Nothing else.

**Conventions:**
- Section pattern: `<section id="..">` + `.eyebrow` header ("0N — Title") + `max-w-6xl` container + `px-5 sm:px-8 py-24 sm:py-32`.
- Reveal pattern: `whileInView` with `viewport={{ once: true, amount: ~0.4 }}` and `EASE`. Stagger lists ~40–80ms.
- Colors via semantic Tailwind classes only: `text-ink / text-ink-soft / text-ink-faint / text-burgundy / text-ember / bg-paper / border-line`. No raw hex in components (except the duotone shadow `#2a0e12`).

---

## 4. What's Built & Verified (in-browser via /browse)

- ✅ **Hero** — Fraunces headline w/ line-mask reveal, italic-burgundy "*systems.*", living status line (pulsing dot), Lenis scroll, scroll cue. Mobile verified (390px).
- ✅ **Experience timeline** (idea #1) — burgundy spine draws on scroll, nodes fill/pop on enter, entries slide in per side, ember-dot metric bullets, grayscale→color company logos, **education folded in** as bottom node, single-rail on mobile.
- ✅ **About** (idea #2) — duotone tilt-portrait (SVG `#vj-duotone` filter), "Engineer, Builder, *Collaborator*", 3 work-style pillars, Personal block, **Cobe globe** Delhi↔Madison (tuned warm tan so it reads on cream, burgundy markers, halo+shadow).
- ✅ **Footer** — `#contact`, email, socials, Résumé.
- ✅ Build passes. New home route ≈ **137 kB** First Load JS (old `/about` legacy route is 471 kB — to be replaced).

**Run / verify:**
```bash
npx next dev -p 3210         # dev server
npx next build               # production build check
# screenshots via gstack /browse skill against http://localhost:3210
```

---

## 5. Ideas Pipeline (owner feeds one at a time)

- **Idea #1 — center-spine alternating experience timeline w/ company logos** → ✅ DONE (`experience.tsx`).
- **Idea #2 — use personal photo (cream/duotone) + a 3D element** → ✅ DONE (duotone portrait + Cobe globe).
- **Idea #3 — Projects (`#work`) + Stack (`#stack`) sections** → ✅ DONE (`work.tsx`, `stack.tsx`). Work = filterable card grid (category chips, image covers + typographic fallback). Stack = brand-logo marquee + grouped grid (logos via `cdn.simpleicons.org`, grayscale→color, text fallback on 404).
- **Idea #4 — globe "Places I've been" filter** → ✅ DONE (`globe.tsx`). Segmented toggle (My journey ↔ Places I've been); journey shows Delhi↔Madison in burgundy, travels shows 9 visited countries in teal. Clickable flag legend (`flagcdn.com`) spins the globe to each city; stat row + "resume spin". Data in `lib/site-data.ts` (`places`, `travelStats`). Cobe markerColor is global per instance, so the mode switch recreates the globe with the right color; `phiRef` persists rotation across recreation.
- **Idea #5+** → awaiting owner.

---

## 6. What's NOT Built Yet (next priorities)

1. ~~**Projects section** (`#work`)~~ → ✅ BUILT as a filterable grid (not horizontal-scroll — grid reads better with 15 projects + reflow animation on filter). `components/site/work.tsx`.
2. ~~**Tech Stack / Skill Atlas** (`#stack`)~~ → ✅ BUILT: logo marquee + grouped grid. `components/site/stack.tsx` + `techStack` in `lib/site-data.ts`. (Legacy `skillGroups`/`marquee` arrays remain in data but are now superseded by `techStack` for the live section.)
3. **About route rebuild** — `app/about/page.tsx` is still the **old/legacy** route. The home page already has an `#about` section, so decide: single-page (drop `/about`) or dedicated page. Rebuilding kills the 471 kB legacy bundle.
4. **Legacy cleanup** — see §7.
5. **Polish pass** — accessibility/contrast audit, focus states, 375px + landscape. ~~dark-mode (deferred)~~ → ✅ DONE: dark-first dual theme ("Editorial Dusk"). New files: `theme-provider.tsx`, `theme-toggle.tsx`, `ambient.tsx`. Verified light+dark at 1440px & 390px, no console errors, no horizontal overflow (fixed: `overflow-hidden` on Experience section to clip the `x:±28` reveal offset). Home route now ≈155 kB First Load JS.

---

## 7. Old Code — Location & Cleanup Plan

- **`main` branch = untouched archive of the original site.** Nothing was deleted there.
- On **`redesign`** branch (current work): `app/layout.tsx`, `app/globals.css`, `app/page.tsx` were overwritten (recover via `git show main:<path>`).
- **Legacy component files still on disk**, unused by the new home page: `components/hero.tsx`, `nav.tsx`, `projects.tsx`, `tech-stack.tsx`, `credentials-showcase.tsx`, `interactive-background.tsx`, `abouts.tsx`, `GooeyNav.tsx`, `AboutPillars.tsx`, plus `app/about/page.tsx` (old route still references them).
- **Recommended cleanup (not yet done):** keep `main` as the archive and **delete** the unused legacy files on `redesign` once the new Projects/Stack/About are in. Alternative: move them to `/legacy/` and gitignore. Don't delete without owner confirmation.
- Branch is **uncommitted** — work lives in the working tree on `redesign`. Commit when owner asks.

---

## 8. Known Issues / Watch-list

- Dev console shows a Framer Motion warning: *"ensure the container has a non-static position"* from a `useScroll` target. Benign (dev-only, scroll-offset accuracy). Low priority — confirm hero/experience scroll targets keep `position: relative`.
- Cobe globe needs WebGL; it lazy-mounts on scroll-in and pauses offscreen. If a marker/arc upgrade is wanted, note Cobe draws **markers (dots) only — no native arcs**; the Delhi→Madison "connection" is conveyed via the two markers + static labels, not a drawn arc on the sphere.
- Photo is `/IMG_0950.jpg` (3024×4032) served through `next/image` (auto-resized). A cleaner studio portrait could be swapped in later via `lib/site-data` if desired.

---

## 9. Quick Start for the Next Agent

1. `git checkout redesign`
2. `npx next dev -p 3210` and open `http://localhost:3210`.
3. Read `lib/site-data.ts` (content) + this doc (decisions).
4. Build the **Projects horizontal-scroll track** next (§6.1), matching the section/reveal conventions in §3.
5. Verify every change with `/browse` screenshots at 1440px and 390px; check reduced-motion.
