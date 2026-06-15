# Journey Redesign — "Arrivals & Departures" Implementation Plan

> **For agentic workers:** This is a design-heavy frontend build with **no test framework**.
> The verification gate per task is **`npm run build` passing** + **live-preview visual check**
> (Preview MCP serverId `89b79c73-80ff-4c1a-b2c7-172c6a610be7`, `localhost:4321`). Lint repo-wide
> is already failing on master (~160 pre-existing prop-types/no-unused errors in untouched files);
> the gate is "build passes and we add no NEW error categories," not "lint clean."

**Goal:** Rebuild `/journey` as a cohesive *Arrivals & Departures* airport board in the approved
Passport×Terminal hybrid aesthetic, roll Fraunces site-wide, and preserve the live world-map +
departure-wash (re-skinned) with a new Solari split-flap reveal on the Departures rows.

**Architecture:** Full-width single-column board. Past + present + future unified under one board
metaphor. The chronological `journeyPoints` array stays intact (the map route depends on its
order + transit duplicates); the board derives views from it (departures split by date, a
deduped arrivals ledger). The world map returns as a sticky scroll-stage behind the Arrivals
ledger, driven by IntersectionObserver → existing pan/path machinery.

**Tech Stack:** Astro 6 + React 18 islands (`client:only="react"`), vanilla CSS in `src/styles.css`,
Fraunces + Spline Sans Mono (Google Fonts), no new deps.

**Branch:** `feat/travels-horizon` (build forward — new commits replace the Horizon content; no revert).

---

## Design tokens (hybrid palette, from `public/mockups/hybrid.html`)

```
--paper:#ECE4D2;  --card:#F6F1E3;  --ink:#21252A;  --ink-2:#4A4F57;
--muted:#8C8474;  --hair:#D8CEB9;  --line:#21252A;  (strong rule)
--oxblood:#8A3F35;  --gold:#A9833F;  --coral:#C2655A (alpine);  --teal:#2C8181 (sea);
--font-display/--font-body: 'Fraunces';   --font-mono: 'Spline Sans Mono';
```

These live page-scoped on the journey board AND feed the site-wide font vars (Phase A).

---

## File structure

- **Modify** `src/layouts/BaseLayout.astro` — swap Satoshi `<link>` for Fraunces + Spline Sans Mono (preconnect + css2).
- **Modify** `src/styles.css` — (A) `:root` font vars + global Satoshi→var swap; (C) new `.jb-*` board styles replacing the `.journey-scroll-*` / `.horizon-*` blocks; (D) re-skinned map/legend/pin colors.
- **Modify** `src/Utils/journeyData.js` — ISO dates + IATA codes on upcoming trips; `getBoardState()`, `getArrivalsLedger()`, `getUpClose()` helpers.
- **Rewrite** `src/Components/Journey.jsx` — orchestrates the full-width board + sticky map stage; IntersectionObserver scroll engine (replaces panel-scroll engine).
- **Create** `src/Components/Journey/JourneyBoard.jsx` — the board (hero, departures, boarding passes, arrivals ledger, up close). Composes small sub-components.
- **Create** `src/Components/Journey/BoardRow.jsx` — one Departures flip row.
- **Create** `src/Components/Journey/BoardingPass.jsx` — one ticket (perforation, MRZ, CTA).
- **Create** `src/Components/Journey/ArrivalsLedger.jsx` — the stamped ledger rows.
- **Modify** `src/Components/Journey/JourneyMap.jsx` — palette props/CSS hooks; accept active index from observer; keep internals.
- **Retire** `src/Components/Journey/JourneyTimeline.jsx` and `JourneyHorizon.jsx` (logic folds into JourneyBoard; delete once board is wired).

---

## Phase A — Fraunces site-wide

**Files:** `BaseLayout.astro`, `src/styles.css`

- [ ] **A1.** In `BaseLayout.astro`, replace the Satoshi `<link>` (line 22) with:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Spline+Sans+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```
- [ ] **A2.** In `styles.css`, remove the `@import "...satoshi"` (line 1). Add to `:root`:
```css
--font-sans: 'Fraunces', Georgia, serif;
--font-mono: 'Spline Sans Mono', ui-monospace, monospace;
```
- [ ] **A3.** Replace every `font-family: "Satoshi", sans-serif;` and `'Satoshi', sans-serif;` with `var(--font-sans);` (≈40 occurrences — use Edit `replace_all` for each quote style).
- [ ] **A4.** Verify: `npm run build` passes; preview `/`, `/projects`, `/journey`, `/blog` — body + headings render in Fraunces, no FOIT/missing-glyph. Tune any spot where serif body is too heavy (e.g. set nav code-labels to `--font-mono` if `< about />` looks off).

**Commit:** `feat(type): adopt Fraunces site-wide as the signature face`

---

## Phase B — Data model + auto-by-date lifecycle

**Files:** `src/Utils/journeyData.js`

- [ ] **B1.** On the two upcoming trips, add ISO dates + true IATA + return label. Keep existing fields:
```js
// dolomites-jul-2026:
startDate: '2026-07-23', endDate: '2026-07-27', iata: 'VCE', ret: 'Jul 27',
// corfu-aug-2026:
startDate: '2026-08-05', endDate: '2026-08-09', iata: 'CFU', ret: 'Aug 9',
```
- [ ] **B2.** Add `getBoardState(today = new Date())`:
```js
export function getBoardState(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  const upcoming = journeyPoints.filter(p => p.type === 'upcoming');
  const departures = upcoming
    .filter(p => p.endDate >= iso)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const graduated = upcoming.filter(p => p.endDate < iso); // flew already → arrivals
  return { departures, graduated };
}
```
- [ ] **B3.** Add `getArrivalsLedger(today)` — unique places, newest-first, for the ledger. Dedupe the
chronological array by city keeping the most recent + most "significant" entry (prefer
`current`>`work`>`home`>`travel`), append any `graduated` trips at their date slot. Each ledger
item carries `{ id, city, country, iata, label (e.g. 'NOW' or 'MAY 2026'), status ('RESIDENT'|'STAMPED'|'HOME'), stampTone }`.
- [ ] **B4.** Add `getUpClose()` — the 2 editorial cards (Paris current, Tokyo) by id.
- [ ] **B5.** Add an `iata` to the home/current/notable points used by the ledger (Beirut BEY, Paris CDG, Amsterdam AMS, London LHR, Tokyo HND, Warsaw WAW, Copenhagen CPH, …). Map city→IATA in one lookup object; ledger reads it.
- [ ] **B6.** Verify: `npm run build` passes. Smoke-check (temp preview eval) that `getBoardState()` today (2026-06-15) returns both Dolomites + Corfu in `departures`, `graduated` empty; `getArrivalsLedger()` has Paris first with status RESIDENT and no duplicate cities.

**Commit:** `feat(journey): add auto-by-date board state + arrivals ledger selectors`

---

## Phase C — Full-width hybrid board (static, no live map yet)

**Files:** create `JourneyBoard.jsx`, `BoardRow.jsx`, `BoardingPass.jsx`, `ArrivalsLedger.jsx`;
rewrite `Journey.jsx`; add `.jb-*` CSS block to `styles.css`.

- [ ] **C1.** Port the hybrid markup from `public/mockups/hybrid.html` into components, data-driven from
Phase B selectors. Structure inside a `.jb-wrap` (max-width ~1180px, centered):
  - `.jb-hero` — eyebrow "ARRIVALS & DEPARTURES" (oxblood mono), `Journeys.` italic Fraunces, stats right-aligned (`getJourneyStats()`), 2px bottom rule.
  - `.jb-board-label` (Departures) — italic Fraunces h2 + blinking oxblood `.sig` dot + "UPCOMING · 2026" meta.
  - `BoardRow` per departure — grid `132px 1fr 110px 90px 150px`: date (mono), city (display Fraunces) + region, nights, IATA (theme-tinted), status. **Solari flip** via `@keyframes jbFlap { 0%{transform:rotateX(-90deg);opacity:0} 55%{opacity:1} 100%{transform:rotateX(0);opacity:1} }`, `transform-origin:top`, staggered `animation-delay`.
  - `.jb-passes` — 2-up grid of `BoardingPass` (collapses to 1-up under ~900px). Perforation notches (`::before/::after` circles cut from `--paper`), dashed divider, DEPART/RETURN/NIGHTS, dark `.jb-mrz` strip, `OPEN ITINERARY →` (wired to departure-wash in C3).
  - `.jb-board-label` (Arrivals) + `ArrivalsLedger` — `.jb-lrow` per place: label (mono), city (italic Fraunces) + region, IATA, rotated pill `.jb-stamp` (RESIDENT=gold, STAMPED=teal, HOME=oxblood). Lifecycle note line.
  - `.jb-board-label` (Up Close) + 2 `.jb-acard` editorial cards with rotated circular ink `.jb-cstamp`.
- [ ] **C2.** Rewrite `Journey.jsx` to render `<Navbar/> <JourneyBoard …/> <Footer/>` (drop the two-panel layout for now; map returns in D). Keep `useIsMobile`.
- [ ] **C3.** Reuse the departure-wash: lift `handleOpen` + the `.departure-wash` element into `BoardingPass`/`JourneyBoard`; re-skin `.departure-wash-alpine/sea` to coral/teal over paper; `OPEN ITINERARY →` triggers it then `window.location = itinerary` (respect `prefers-reduced-motion` → plain navigate).
- [ ] **C4.** Delete `JourneyTimeline.jsx`, `JourneyHorizon.jsx`; remove now-dead `.journey-scroll-*`, `.horizon-*` CSS blocks (≈ styles.css 2972–3490).
- [ ] **C5.** Verify: build passes; preview top→bottom matches the mockup (use the collapse-above-target eval trick for below-the-fold screenshots). Fix the status-dot overlap on BOARDING/SCHEDULED (give the dot its own column/gap).

**Commit:** `feat(journey): rebuild as full-width Arrivals & Departures board`

---

## Phase D — Integrate the live world-map as a scroll-stage

**Files:** `Journey.jsx`, `JourneyMap.jsx`, `styles.css`

- [ ] **D1.** Wrap the Arrivals section in a relative `.jb-arrivals-stage`; render `JourneyMap` as a `position:sticky; top:70px` layer behind the ledger rows (ledger rows sit in a higher z-index column with a translucent-paper backing for legibility).
- [ ] **D2.** Scroll engine: IntersectionObserver on each `.jb-lrow` (rootMargin centered band). Active row → `activePointId` (map pin) + derive `scrollProgress` from the active place's chronological index in `journeyPoints` so the route reveals city-to-city. Keep `scrollSpeedRef` (use scroll delta) for the existing damping.
- [ ] **D3.** Re-skin map CSS: land dots on paper (`fill` muted warm + visited oxblood-tinted), `.journey-travel-path` stroke → oxblood, upcoming segments stay coral/teal, pin label → Fraunces, legend → mono. Tune `.journey-map-vignette` to fade into paper.
- [ ] **D4.** Verify: build passes; scrolling the Arrivals ledger pans the map + reveals the route; text stays readable over the map; Departures/passes/Up-Close unaffected. Tune veil opacity + which rows the map backs, live with the user.

**Commit:** `feat(journey): live world-map scroll-stage behind the arrivals ledger`

---

## Phase E — Mobile + reduced-motion polish

**Files:** `Journey.jsx`, `styles.css`

- [ ] **E1.** Mobile (`useIsMobile`): single-column board, board grids collapse, boarding passes 1-up, **no sticky map** (optional static decorative strip). Hero scales down.
- [ ] **E2.** `@media (prefers-reduced-motion: reduce)`: disable `jbFlap` + blink + departure-wash (instant navigate); rows render in place.
- [ ] **E3.** A11y: `OPEN ITINERARY` is a real `<a href>`; stamps `aria-hidden`; board labels are headings; focus-visible rings in oxblood.
- [ ] **E4.** Verify: build passes; preview at mobile/tablet/desktop presets; reduced-motion via preview motion emulation.

**Commit:** `feat(journey): responsive board + reduced-motion fallbacks`

---

## Final — Verify + clean up + PR

- [ ] **F1.** `npm run build` (must pass) + `npm run lint` (confirm no NEW error categories vs master).
- [ ] **F2.** Delete `public/mockups/` (throwaway comps).
- [ ] **F3.** Update this plan's checkboxes; commit cleanup.
- [ ] **F4.** Open **draft PR** against master: title "Redesign /journey as an Arrivals & Departures board + Fraunces site-wide"; body summarizes the pivot, phases, and the preserved map/wash + new flip; test plan = build + manual preview matrix.

---

## Self-review notes
- **Map order vs board order:** board shows future→present→past(newest-first), but the map route is
  chronological. Resolved by driving `scrollProgress` from the active place's *chronological index*
  (not board scroll fraction), so the route always reads oldest→newest regardless of board order.
- **Duplicates:** `journeyPoints` keeps transit duplicates (Warsaw ×6 etc.) for the map path; the
  ledger dedupes by city. Never mutate `journeyPoints`.
- **Lifecycle correctness:** with today=2026-06-15 both trips are future → Departures; after Aug 9
  2026 both auto-move to Arrivals with zero edits. `getBoardState` is the single source of truth.
- **No placeholders:** every phase lists exact files, the real keyframe, the real selectors, the
  real palette. Boarding-pass/MRZ/stamp markup is ported verbatim from the approved mockup.
