# /journey Terminal Takeover — Design

**Date:** 2026-06-16
**Status:** Approved (design dialogue) — ready for implementation plan
**Branch:** `feat/travels-horizon` (draft PR #6)

## Goal

Recast the entire `/journey` page as one art-directed airport flight-information
display — **"RIWA HOTEIT INTL"** — so Departures and Arrivals are mirrored
split-flap boards and the page reads, top to bottom, like a real terminal screen.

## Approved decisions

1. **Scope: full terminal takeover.** The board metaphor swallows the whole page
   (not just an added Arrivals board). The masthead becomes a terminal header;
   the poster spreads are kept but re-captioned as "gate detail"; a new Arrivals
   board mirrors Departures.
2. **The hall: always-dark screen.** The whole `/journey` page is the dark
   terminal regardless of the site's light/dark toggle — one continuous screen,
   maximum immersion (a real FIDS display is always dark). The site theme toggle
   no longer lightens this page; the page renders its own device palette.

## Concept & narrative spine

```
┌ TERMINAL HEADER — RIWA HOTEIT INTL · live clock · stats · LED ticker ┐
│  DEPARTURES   → split-flap board (upcoming + documented itineraries)  │
│  NOW BOARDING → the poster spreads, re-captioned as the gate detail   │
│  ARRIVALS     → split-flap board, ~22 cities, every row "ARRIVED"     │
└ TERMINAL FOOTER — end-of-display chrome ─────────────────────────────┘
```

Departures = where I'm headed · Now Boarding = the journeys in detail ·
Arrivals = everywhere I've already landed.

## Parts

### 1. Terminal header (`TerminalHeader.jsx`) — replaces the editorial masthead
- Top strip (mono): `RIWA HOTEIT INTL · RWA` in amber (left); live ticking clock
  `HH:MM:SS` + date `MON 16 JUN` in screen-ink (right).
- Title **`Journeys.`** retained in Fraunces italic, cream on the dark screen
  (keeps the typographic soul). Eyebrow `THE TRAVEL INDEX` above, amber mono.
- Stats readout (mono): `22 CITIES · 13 COUNTRIES · 02 CONTINENTS · SINCE 2018`
  with `● NOW IN PARIS` (the live ping dot, reuses `jbPing`/`--ping`).
- LED ticker: a horizontally scrolling marquee of the lead line + boarding call,
  e.g. `…EVERYWHERE ELSE THE ROAD HAS GONE ✦ NOW BOARDING: DOLOMITES ✦ CORFU ✦`.
  Pauses/!animates under `prefers-reduced-motion`.

### 2. DEPARTURES board — existing behaviour, re-skinned via the shared primitive
The current `DeparturesBoard` content (featured itineraries, REMARKS =
Boarding/On time/Departed) is preserved; it is re-expressed through the new
shared `FlapBoard` primitive (see Architecture).

### 3. NOW BOARDING — the poster spreads, kept and re-captioned
`FeatureItinerary` spreads stay (poster art + tagline + stops + CTA). Only the
section label changes from "Departures / Featured itineraries" to terminal
signage: `NOW BOARDING` with a gate-style tag. These are the gate detail for the
trips the Departures board lists.

### 4. ARRIVALS board (`ArrivalsBoard.jsx`) — new, mirrors Departures
Fed by `getArrivalsLedger()` (~22 deduped cities, already carries `label`,
`city`, `region`, `iata`, `status`, `tone`).
- Columns: `ARRIVED` (`label`) · `FROM` (`city` + `region`) · `FLIGHT` (`iata`) ·
  `REMARKS`.
- Remarks mapping from `status`:
  - `STAMPED` → `ARRIVED`
  - `RESIDENT` (Paris/now) → `● LIVE · HOME` (uses the live ping)
  - `HOME` (Beirut) → `HOME`
- Thin year-divider rows (`—— 2025 ——`) between year groups preserve the index's
  year structure and break up 22 identical rows. Year grouping derives from the
  ledger's `sortKey` (the existing `AtlasIndex` year logic moves here).
- The "NN stops" tally moves into the section header (was the atlas aside).
- Rows are non-linking (no per-city itinerary), unlike Departures rows.

### 5. Terminal footer — closing line reframed as terminal chrome
`END OF DISPLAY` + a short baggage-claim quip; keeps the existing two-line foot
content, restyled.

## Architecture

Shared primitives (DRY — consistent with the just-completed cleanup pass):

- **`Clock.jsx`** — extract the ticking clock currently inline in
  `DeparturesBoard`; used by both `TerminalHeader` and `FlapBoard` header.
- **`FlapBoard.jsx`** — generic split-flap board. Props:
  `{ title, live, columns, rows }`. Renders the device shell, header
  (title · live dot · clock), column heads, and the staggered flap rows. Each row
  carries its own navigation: `{ key, href?, onClick?, cells: [{ content, className }] }`
  — so Departures rows supply the wash `onClick`/`href` and Arrivals rows omit them
  (non-linking). Both boards are thin configs over this.
- **`TerminalHeader.jsx`** — the airport header (identity, clock, stats, ticker).
- **`ArrivalsBoard.jsx`** — maps `getArrivalsLedger()` → `FlapBoard` rows.
- **`DeparturesBoard.jsx`** — reduced to a thin config over `FlapBoard`.
- **`AtlasIndex.jsx`** — removed (its data + year logic move into `ArrivalsBoard`).
- **`JourneyBoard.jsx`** — recomposed: `TerminalHeader` → Departures `FlapBoard`
  → Now Boarding posters → Arrivals `FlapBoard` → footer.

CSS (`styles.css`): rename the `.dep-*` board rules to a shared `.fb-*` (flap
board) namespace used by both boards; keep `.dep-status-*` remark variants and
add the `ARRIVED`/`HOME` variants. Make the whole `body.journey-page` render the
dark device palette unconditionally (drop the light-paper + dark-override split,
since the page is now always-dark); the per-theme jb-* palette block is replaced
by a single screen palette. The departure-wash overlay stays.

## Data mapping notes

- `getArrivalsLedger()` already returns everything the Arrivals board needs; no
  data-model change required.
- Flight code for Arrivals = `iata` (e.g. `WAW`, `LHR`). Departures keeps its
  `RH ####` derived number.
- Year groups: reuse the `yearKey`/sort logic from `AtlasIndex` against `sortKey`.

## Motion & accessibility

- Flap stagger reused from the board; cap the Arrivals stagger so ~22 rows finish
  quickly (clamp total reveal, e.g. compress per-row delay for large lists).
- `prefers-reduced-motion`: no flap animation, no ticker scroll, no ping (extends
  the existing reduced-motion block).
- Live regions/labels: each board keeps an `aria-label`; ticker marked
  `aria-hidden` (decorative), stats remain readable text.

## Responsive

- Terminal header stacks on mobile (identity over clock; stats wrap; ticker
  full-width).
- Boards reuse the existing board responsive rules (hide Flight col, condense
  columns under 720px).

## Out of scope (YAGNI)

- No new data fields, no real flight API, no per-arrival itinerary pages.
- No click-to-expand "gate" interaction on Departures rows (posters stay visible
  inline rather than behind a click).
- No always-dark treatment leaking to other site pages — scoped to
  `body.journey-page`.

## Success criteria

- `/journey` reads as one continuous dark airport terminal in both site themes.
- Departures and Arrivals are visibly mirrored boards; Arrivals shows `ARRIVED`
  on nearly every row with `● LIVE · HOME` (Paris) and `HOME` (Beirut).
- Poster spreads survive, re-captioned as `NOW BOARDING`.
- `Journeys.` title still set in Fraunces.
- `npm run build` passes; verified in light + dark via preview screenshots and
  computed-style checks; reduced-motion verified.
- No regression to the departure-wash navigation or bfcache fix.
```
