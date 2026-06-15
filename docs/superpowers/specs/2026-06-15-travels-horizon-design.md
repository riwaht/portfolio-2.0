# Travels "Horizon" — weaving the itineraries hub into `/journey`

**Date:** 2026-06-15
**Status:** Approved design, ready for implementation planning

## Context & goal

The portfolio (`portfolio-2.0`, Astro + React) links to the travel itineraries site
(`itineraries.riwashouse.live`, a separate static deployment with a "Journeys." hub plus
`/dolomites` and `/corfu` trip pages). Today the only link is buried: the two upcoming trips
appear as ordinary cards at the bottom of the `/journey` timeline with a plain
"View itinerary →" link that jumps out in a new tab. The hub itself never appears inside the
portfolio, and direct deep-links bypass it entirely.

**Goal:** make the trips a *designed, unmissable* part of the portfolio, with the hub concept as
the place the experience lands — not a dead-end link. Chosen creative direction (from
brainstorming): **"The Horizon" (lives inside `/journey`) fused with "The Collection" (travel
ephemera), opening trips straight-through with a departure wash.**

## Decisions locked in brainstorming

1. The integration lives **inside `/journey`** — no new page, **no new nav item**.
2. The end of the timeline crests into **The Horizon**: a warm zone where upcoming trips appear.
3. Trips render as **both** a **departures board** and **postcards** (keep both).
4. Opening a trip goes **straight through to the full trip page**, preceded by a **departure
   wash** (an outgoing animation in the trip's palette), not an in-place preview.
5. `itineraries.riwashouse.live` **stays live** as the standalone, externally-shareable artifact
   and remains the single source of truth for trip content.
6. Build it **incrementally with live preview** — the result is visible after every phase.

## User-facing experience

Scrolling `/journey` from the past toward the present already pans a map and reveals a route.
We extend the scroll so it **crests into The Horizon**:

- The map's route — already drawn through every place lived — continues, but the final
  segments to the upcoming trips render **dashed in each destination's color** (coral toward
  Dolomites, teal toward Corfu), ending in **themed destination pins**.
- The timeline panel's background **warms** from the dark ink toward the hub's cream as the
  Horizon comes into view (subtle; the past stays dark).
- The upcoming trips arrive as a small **Collection**: a compact **departures board**
  (`JUL 23 · DOLOMITES · IT · 4 nights`, etc.) and **postcards** (banner art in each trip's
  palette, name, region, dates, a one-line summary).
- Clicking a postcard plays a **departure wash** — a full-screen sweep in that trip's palette
  (paper/coral for Dolomites, sea/teal for Corfu) — then navigates to the full trip page. Because
  the destination already wears that palette, the load feels continuous.

## Architecture

### Data layer — `src/Utils/journeyData.js`

The two `upcoming` points (`dolomites-jul-2026`, `corfu-aug-2026`) already carry
`city`, `country`, `geo`, `coordinates`, `dateRange`, `month`, `description`, `itinerary`.
Enrich each with Collection fields so the Horizon is fully data-driven (adding a future trip =
one more object):

| Field | Dolomites | Corfu | Used by |
|---|---|---|---|
| `kind` | `"Couple's road trip"` | `"Family trip"` | postcard sub-label |
| `region` | `"Italy · The Alps"` | `"Greece · Ionian Sea"` | postcard place chip |
| `nights` | `4` | `4` | departures board + postcard |
| `depart` | `"Jul 23"` | `"Aug 5"` | departures board date column |
| `code` | `"IT"` | `"GR"` | departures board country code |
| `theme` | `"alpine"` | `"sea"` | banner art, accent, wash colors |

Existing `description` is reused as the postcard summary; `dateRange` for the full date line;
`city` for the name; `itinerary` for the destination URL.

**Theme palettes** (mapped in component/CSS, echoing the hub and trip pages):
- `alpine` — banner `linear-gradient(135deg,#4F5E69,#2C353C)` with a coral peak `#C56F66`;
  wash = paper `#EFEDE6` + coral.
- `sea` — banner `linear-gradient(135deg,#114E5C,#0C3B45)` with gold sun `#D8A53D` + teal
  waves `#5FB6B6`; wash = sea `#0C3B45` + teal.

### Components

- **`src/Components/Journey/JourneyTimeline.jsx`** — stop rendering `type === 'upcoming'` points
  as ordinary cards. Render past/now cards as today, then render `<JourneyHorizon>` (before the
  bottom spacer). Remove the `journey-card-itinerary-link` block and the `upcoming` card branch.

- **NEW `src/Components/Journey/JourneyHorizon.jsx`** — the warm zone. Renders:
  - a divider/eyebrow ("The Horizon · upcoming"),
  - a **`DeparturesBoard`** (compact split-flap-style rows, one per upcoming point: `depart`,
    `city`, `code`, `nights`),
  - a **postcard grid** (one postcard per point: themed banner SVG, `city`, `region`, `kind`,
    `dateRange`, `description`).
  - Props: `{ points, registerRef, activePointId }`. **Each postcard calls
    `registerRef(point.id, el)`** so the existing active-point detection in `Journey.jsx` keeps
    panning the map and lighting the pin as the Horizon scrolls in. **(Critical: without ref
    registration the map stops tracking the upcoming points.)**
  - Clicking a postcard invokes the departure wash for that point.

- **NEW departure wash** (a `DepartureWash` overlay, owned by `JourneyHorizon`) — a fixed,
  full-screen overlay. On trigger: animate a color sweep in the point's theme palette + show the
  destination name (~0.7s), then `window.location.href = point.itinerary`. If
  `prefers-reduced-motion: reduce`, skip the animation and navigate immediately.
  *Honest constraint:* the trip pages are a **different origin**, so this is a one-way departure
  animation + navigation, not a shared-element morph. Acceptable — the matching palette on the
  destination sells the continuity.

### Map enhancements — `src/Components/Journey/JourneyMap.jsx`

The map already draws a scroll-revealed travel path through all points (per-segment seasonal
color) and pans/zooms to follow `scrollProgress`; the upcoming points are the last in the array,
so the route already reaches them. Two additions:

1. **Warm dashed route:** for segments whose *target* point is `type === 'upcoming'`, render a
   **dashed** stroke in the destination theme color instead of the seasonal solid (coral →
   Dolomites, teal → Corfu).
2. **Themed pins:** when the active point is `upcoming`, the pin uses the theme accent.

Optional (Phase 3): the map's background/vignette warms slightly as `scrollProgress → 1`.

### Palette warming — `src/Components/Journey.jsx` + `src/styles.css`

Introduce a `--horizon-warmth` CSS variable (0→1) derived from `scrollProgress` (warming begins
only as the final segments reveal, e.g. `clamp((scrollProgress − 0.78) / 0.22, 0, 1)`; exact
threshold tuned to where the upcoming points sit). Interpolate the timeline panel's background
from the current dark ink toward the hub cream `#F4F0E8`. **Constraint:** past/now cards must
stay readable — warming concentrates at the Horizon end, not the whole panel.

### Mobile — `src/Components/Journey.jsx`

Today the `isMobile` branch shows "better to see it on your laptop." Replace that dead end with a
**mobile Horizon**: a stacked, scrollable view (intro + `DeparturesBoard` + postcards, full warm
palette, no map). The scroll-driven map+timeline remains desktop-only (it genuinely needs the
viewport), but mobile visitors can now discover and open the trips. The wash works on mobile too.

### Shareable entry — no nav item

- The Horizon section carries `id="horizon"`. On mount, `Journey.jsx` checks
  `location.hash === '#horizon'` and scrolls the timeline panel to it — so
  `riwashouse.live/journey#horizon` deep-links straight to the trips.
- A small "↓ upcoming journeys" pill on the journey hero scrolls to `#horizon`.
- **No `< travels />` nav entry** (per decision). The standalone hub stays the external share URL.

## Data flow

```
scroll
  → Journey.jsx computes activePointId + scrollProgress
      → JourneyMap: route reveal, pan/zoom, themed dashed upcoming segments, themed pins, warmth
      → JourneyTimeline: past/now cards, then <JourneyHorizon>
          → JourneyHorizon registers refs for upcoming points (joins active-detection)
              → reaching them warms palette + lights destination pins
              → click postcard → DepartureWash overlay → window.location → trip page
```

## What we remove

- The `journey-card-itinerary-link` ("View itinerary →") rendering in `JourneyTimeline.jsx` and
  its CSS in `styles.css`.
- The ordinary-card rendering path for `type === 'upcoming'` (those points now render via
  `JourneyHorizon`). The `getTypeLabel('upcoming')` case and `.journey-card-upcoming` styles are
  removed or repurposed for the new treatment.

## Build order (each phase ends with a live-preview check)

**Phase 0 — baseline.** Start `npm run dev`; open in Claude Preview at desktop width to confirm
the current `/journey` renders.

**Phase 1 — the Collection (static).** Enrich `journeyData`; build `JourneyHorizon`
(`DeparturesBoard` + postcards); wire it into `JourneyTimeline` and remove the old upcoming-card
path. *Preview:* scroll to the bottom — the departures board + postcards appear; postcards link to
the trips (plain navigation, no wash yet).

**Phase 2 — departure wash.** Add the `DepartureWash` overlay; postcards trigger it then navigate.
*Preview:* click a postcard — the themed wash plays and lands on the trip page; reduced-motion
skips it.

**Phase 3 — the warming map.** Dashed themed route to the upcoming pins, themed pins, and the
`--horizon-warmth` palette transition. *Preview:* scroll in — the route goes dashed/colored to the
pins and the panel warms.

**Phase 4 — reach.** Mobile Horizon (replace the laptop wall) + `#horizon` deep link + hero pill.
*Preview:* mobile width shows the stacked Collection; `/journey#horizon` scrolls straight there.

## Verification

Via Claude Preview MCP:
- Desktop (≈1440×900): scroll reveals the Horizon; postcards show correct art/region/dates;
  departures board rows correct; clicking plays the wash and navigates to
  `itineraries.riwashouse.live/dolomites` / `/corfu`; map route reaches both pins dashed/themed;
  panel warms near the bottom.
- Mobile (≈390px): the stacked mobile Horizon renders and postcards open the trips.
- `/journey#horizon` scrolls to the Horizon on load.
- `prefers-reduced-motion` skips the wash.
- `npm run build` succeeds.

## Out of scope (now)

- Re-hosting the trip pages under the portfolio origin / true cross-origin shared-element
  transitions.
- A dedicated `/travels` route or a new nav item.
- Redesigning the trip pages or the standalone hub.
- Adding more than the two existing trips (data-driven — trivial to add later).

## Risks & trade-offs

- **One-way wash:** cross-origin navigation can't truly morph; mitigated by matching palettes.
- **Palette-warming tuning:** must not muddy the existing dark timeline — warming stays at the
  Horizon end.
- **Map sync depends on ref registration:** `JourneyHorizon` must register refs for the upcoming
  point ids or the map stops tracking them.
- **Split-flap board:** keep the animation CSS-only and minimal to avoid jank.
