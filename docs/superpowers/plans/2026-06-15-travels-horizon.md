# Travels "Horizon" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the itineraries hub an unmissable part of `/journey` — the timeline crests into a warm "Horizon" where upcoming trips appear as a departures board + postcards, opening each trip straight-through with a departure wash.

**Architecture:** Pull the `type === 'upcoming'` points out of the normal timeline and render them in a new `JourneyHorizon` section (its own warm cream identity so it reads in both light and dark themes). The existing scroll→map machinery is reused: the Horizon's postcards register refs so the map still pans to each trip and the route reveals to them in destination colors. Clicking a postcard plays a full-screen wash in the trip's palette, then navigates to the live trip page.

**Tech Stack:** Astro 6 + React 18 (client islands), vanilla CSS in `src/styles.css`. No test runner — verification is `npm run build` (catches import/syntax errors), `npm run lint` (eslint, strict `--max-warnings 0`), and live preview via the Claude Preview MCP at desktop (1440×900) and mobile (390px) widths.

**Spec:** `docs/superpowers/specs/2026-06-15-travels-horizon-design.md`

**Verification note (read once):** This codebase has no unit-test harness, and the feature is visual + scroll-driven. Every task therefore verifies with: (1) `npm run build` passes, (2) `npm run lint` passes, (3) a specific live-preview check described in the task. Keep `npm run dev` running throughout so each phase is visible as it lands.

---

## File structure

**Create:**
- `src/Components/Journey/JourneyHorizon.jsx` — the Horizon section: eyebrow, `DeparturesBoard`, postcard grid, and the departure-wash overlay. Contains small `BannerArt`, `DeparturesBoard`, and `Postcard` sub-components (used only here, so they live together).

**Modify:**
- `src/Utils/journeyData.js` — enrich the two `upcoming` points with Collection fields.
- `src/Components/Journey/JourneyTimeline.jsx` — stop rendering `upcoming` as cards; render `<JourneyHorizon>`; add the jump pill; drop the old "View itinerary" link.
- `src/Components/Journey.jsx` — mobile branch renders `<JourneyHorizon mobile>`; add `#horizon` hash-scroll on load.
- `src/Components/Journey/JourneyMap.jsx` — themed color for route segments leading to upcoming points; themed active pin.
- `src/styles.css` — add the Horizon / board / postcard / wash / jump-pill styles; remove the now-dead `.journey-card-upcoming*` and `.journey-card-itinerary-link*` rules.

---

## Task 1: Enrich the upcoming trip data

**Files:**
- Modify: `src/Utils/journeyData.js` (the `dolomites-jul-2026` and `corfu-aug-2026` objects, ~lines 515–540)

- [ ] **Step 1: Add Collection fields to the Dolomites point**

In `src/Utils/journeyData.js`, find the `dolomites-jul-2026` object and replace it with:

```js
  {
    id: 'dolomites-jul-2026',
    city: 'Dolomites',
    country: 'Italy',
    geo: { lon: 12.13, lat: 46.54 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: '23–27 Jul 2026',
    month: 7,
    type: 'upcoming',
    description: 'A clockwise loop out of Venice — east to the Tre Cime and the pale lakes, then west to Val Gardena, with two nights spent high on the mountain.',
    itinerary: 'https://itineraries.riwashouse.live/dolomites',
    professional: null,
    kind: "Couple's road trip",
    region: 'Italy · The Alps',
    nights: 4,
    depart: 'Jul 23',
    code: 'IT',
    theme: 'alpine',
  },
```

- [ ] **Step 2: Add Collection fields to the Corfu point**

Replace the `corfu-aug-2026` object with:

```js
  {
    id: 'corfu-aug-2026',
    city: 'Corfu',
    country: 'Greece',
    geo: { lon: 19.92, lat: 39.62 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: '5–9 Aug 2026',
    month: 8,
    type: 'upcoming',
    description: 'Four of us converging on one Ionian island — parents from Athens, sister from Birmingham, me from Paris — based in Dassia on the green northeast coast.',
    itinerary: 'https://itineraries.riwashouse.live/corfu',
    professional: null,
    kind: 'Family trip',
    region: 'Greece · Ionian Sea',
    nights: 4,
    depart: 'Aug 5',
    code: 'GR',
    theme: 'sea',
  }
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed (data-only change; no behavior change yet).

- [ ] **Step 4: Commit**

```bash
git add src/Utils/journeyData.js
git commit -m "feat(journey): enrich upcoming trips with Horizon collection fields"
```

---

## Task 2: Build the Horizon section (static) — Phase 1

The visible result of this task: scrolling `/journey` to the bottom shows a warm "Journeys" collection — a departures board and two postcards — and the postcards link to the trips (plain navigation; the wash comes in Task 3).

**Files:**
- Create: `src/Components/Journey/JourneyHorizon.jsx`
- Modify: `src/Components/Journey/JourneyTimeline.jsx` (full rewrite, below)
- Modify: `src/styles.css` (append the Horizon styles; remove dead upcoming-card rules)

- [ ] **Step 1: Create `JourneyHorizon.jsx`**

Create `src/Components/Journey/JourneyHorizon.jsx` with exactly:

```jsx
import React, { useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function BannerArt({ theme }) {
  if (theme === 'sea') {
    return (
      <svg className="horizon-banner-svg" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="hzSea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#114E5C" />
            <stop offset="1" stopColor="#0C3B45" />
          </linearGradient>
        </defs>
        <rect width="320" height="120" fill="url(#hzSea)" />
        <circle cx="232" cy="40" r="24" fill="#D8A53D" opacity="0.95" />
        <path d="M0,78 q26,-13 52,0 t52,0 t52,0 t52,0 t52,0 t52,0" fill="none" stroke="#5FB6B6" strokeWidth="3" strokeLinecap="round" />
        <path d="M0,94 q26,-13 52,0 t52,0 t52,0 t52,0 t52,0 t52,0" fill="none" stroke="#FBF6EC" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M0,110 q26,-13 52,0 t52,0 t52,0 t52,0 t52,0 t52,0" fill="none" stroke="#5FB6B6" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg className="horizon-banner-svg" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hzAlp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5B6A75" />
          <stop offset="1" stopColor="#3A444C" />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill="url(#hzAlp)" />
      <path d="M0,120 L0,88 L46,56 L78,78 L120,36 L150,64 L196,22 L240,70 L286,44 L320,72 L320,120 Z" fill="#2C353C" />
      <path d="M196,22 L214,44 L178,44 Z" fill="#C56F66" />
    </svg>
  );
}

function DeparturesBoard({ points }) {
  return (
    <div className="horizon-board">
      <div className="horizon-board-head">
        <span className="horizon-board-title">Departures</span>
        <span className="horizon-board-dot" />
      </div>
      {points.map((p) => (
        <div className="horizon-board-row" key={p.id}>
          <span className="horizon-board-date">{p.depart}</span>
          <span className="horizon-board-dest">{p.city}</span>
          <span className="horizon-board-code">{p.code}</span>
          <span className="horizon-board-nights">{p.nights} nights</span>
        </div>
      ))}
    </div>
  );
}

function Postcard({ point, onOpen }) {
  return (
    <a
      className={`horizon-postcard horizon-postcard-${point.theme}`}
      href={point.itinerary}
      onClick={(e) => onOpen(e, point)}
    >
      <div className="horizon-postcard-banner">
        <BannerArt theme={point.theme} />
        <span className="horizon-postcard-stamp" aria-hidden="true" />
        <span className="horizon-postcard-place">{point.region}</span>
      </div>
      <div className="horizon-postcard-body">
        <span className="horizon-postcard-kind">{point.kind} · {point.nights} nights</span>
        <h3 className="horizon-postcard-city">{point.city}</h3>
        <span className="horizon-postcard-dates">{point.dateRange}</span>
        <p className="horizon-postcard-summary">{point.description}</p>
        <span className="horizon-postcard-go">
          Open itinerary <span className="horizon-postcard-arrow">→</span>
        </span>
      </div>
    </a>
  );
}

function JourneyHorizon({ points, registerRef, mobile = false }) {
  const [departing, setDeparting] = useState(null);

  const handleOpen = (e, point) => {
    if (prefersReducedMotion()) return; // let the <a href> navigate normally
    e.preventDefault();
    setDeparting(point);
    window.setTimeout(() => {
      window.location.href = point.itinerary;
    }, 700);
  };

  return (
    <section id="horizon" className={`journey-horizon${mobile ? ' journey-horizon-mobile' : ''}`}>
      {mobile && (
        <h2 className="horizon-mobile-title">Journeys<span className="horizon-dot">.</span></h2>
      )}
      <div className="horizon-eyebrow">The Horizon · upcoming</div>
      <DeparturesBoard points={points} />
      <div className="horizon-postcards">
        {points.map((point) => (
          <div
            key={point.id}
            ref={mobile || !registerRef ? undefined : (el) => registerRef(point.id, el)}
            data-point-id={point.id}
            className="horizon-entry"
          >
            <Postcard point={point} onOpen={handleOpen} />
          </div>
        ))}
      </div>
      {departing && (
        <div className={`departure-wash departure-wash-${departing.theme}`}>
          <span className="departure-wash-label">{departing.city}</span>
        </div>
      )}
    </section>
  );
}

export default JourneyHorizon;
```

- [ ] **Step 2: Rewrite `JourneyTimeline.jsx`**

Replace the entire contents of `src/Components/Journey/JourneyTimeline.jsx` with:

```jsx
import React from 'react';
import { journeyPoints } from '../../Utils/journeyData';
import JourneyHorizon from './JourneyHorizon';

function JourneyTimeline({ activePointId, registerRef }) {
  const getTypeLabel = (type) => {
    switch (type) {
      case 'home': return 'home';
      case 'work': return 'work';
      case 'travel': return 'travel';
      case 'current': return 'now';
      default: return '';
    }
  };

  const timelinePoints = journeyPoints.filter((p) => p.type !== 'upcoming');
  const upcomingPoints = journeyPoints.filter((p) => p.type === 'upcoming');
  const activeIdx = journeyPoints.findIndex((p) => p.id === activePointId);

  return (
    <div className="journey-timeline">
      <button
        type="button"
        className="horizon-jump"
        onClick={() =>
          document.getElementById('horizon')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      >
        ↓ upcoming journeys
      </button>

      <div className="journey-scroll-spacer-top" />

      {timelinePoints.map((point, i) => {
        const isActive = activePointId === point.id;
        const isPast = activeIdx >= 0 && i < activeIdx;

        return (
          <div
            key={point.id}
            ref={(el) => registerRef(point.id, el)}
            data-point-id={point.id}
            className={`journey-scroll-entry${isActive ? ' active' : ''}${isPast ? ' past' : ''}`}
          >
            <div className={`journey-scroll-card journey-card-${point.type}`}>
              <div className="journey-card-accent" />
              <div className="journey-card-body">
                <div className="journey-card-header">
                  <span className="journey-card-date">{point.dateRange}</span>
                  <span className="journey-card-type">{getTypeLabel(point.type)}</span>
                </div>
                <h3 className="journey-card-location">{point.city}</h3>
                <span className="journey-card-country">{point.country}</span>
                <p className="journey-card-desc">{point.description}</p>
                {point.professional && (
                  <div className="journey-card-pros">
                    {point.professional.map((pro, j) => (
                      <span key={j} className="journey-card-pro">
                        {pro.role} · {pro.company}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <JourneyHorizon points={upcomingPoints} registerRef={registerRef} />

      <div className="journey-scroll-spacer-bottom" />
    </div>
  );
}

export default JourneyTimeline;
```

- [ ] **Step 3: Remove the dead upcoming-card CSS**

In `src/styles.css`, delete these two rules (currently ~lines 3042–3050):

```css
.journey-card-upcoming .journey-card-accent {
  background: var(--accent-secondary);
}

/* Upcoming trips read as "planned" — dashed type label, warm accent */
.journey-card-upcoming .journey-card-type {
  color: var(--accent-secondary);
  opacity: 0.9;
}
```

And delete this block (currently ~lines 3133–3160):

```css
/* "View itinerary" deep link on upcoming trip cards */
.journey-card-itinerary-link {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-secondary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.55rem;
  transition: gap 0.18s ease, opacity 0.18s ease;
}

.journey-card-itinerary-link:hover {
  opacity: 0.8;
  gap: 0.5rem;
}

.journey-card-itinerary-arrow {
  transition: transform 0.18s ease;
}

.journey-card-itinerary-link:hover .journey-card-itinerary-arrow {
  transform: translateX(2px);
}
```

- [ ] **Step 4: Append the Horizon styles**

Add the following at the END of `src/styles.css`:

```css
/* ============================================================
   The Horizon — upcoming trips as a warm "Journeys" collection.
   Its own warm identity (hub palette) so it reads in BOTH themes.
   ============================================================ */
.journey-horizon {
  position: relative;
  margin: 1.5rem 0 0;
  padding: 2.25rem 1.25rem 1.5rem;
  border-radius: 18px;
  background: #F4F0E8;
  border: 1px solid #DBD3C4;
  color: #1E2A2E;
  scroll-margin-top: 90px;
}
/* soft fade easing the timeline into the warm collection */
.journey-horizon::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -48px;
  height: 48px;
  background: linear-gradient(to bottom, transparent, #F4F0E8);
  pointer-events: none;
}

.horizon-eyebrow {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 800;
  color: #3C5A63;
  margin-bottom: 0.85rem;
}

.horizon-mobile-title {
  font-family: 'Satoshi', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #1E2A2E;
  margin: 0 0 0.25rem;
}
.horizon-dot { color: #CE6B5C; }

/* departures board */
.horizon-board {
  background: #1E2A2E;
  border-radius: 10px;
  padding: 0.6rem 0.8rem;
  margin-bottom: 1rem;
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
}
.horizon-board-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.4rem;
  margin-bottom: 0.45rem;
}
.horizon-board-title {
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  color: #F6AE2D;
}
.horizon-board-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #5FB6B6;
  margin-left: auto;
  box-shadow: 0 0 6px #5FB6B6;
}
.horizon-board-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.72rem;
  color: #E7ECEB;
  padding: 0.18rem 0;
}
.horizon-board-date { font-weight: 700; color: #fff; letter-spacing: 0.04em; }
.horizon-board-dest { letter-spacing: 0.06em; text-transform: uppercase; }
.horizon-board-code { color: #8B9794; font-size: 0.62rem; }
.horizon-board-nights { color: #5FB6B6; font-size: 0.62rem; letter-spacing: 0.05em; }

/* postcards */
.horizon-postcards { display: flex; flex-direction: column; gap: 1rem; }
.horizon-entry { scroll-margin-top: 90px; }

.horizon-postcard {
  display: block;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid #E3DCCC;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 24px -18px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.horizon-postcard:hover {
  transform: translateY(-3px);
  box-shadow: 0 22px 40px -24px rgba(0, 0, 0, 0.55);
  border-color: #C9BFAD;
}

.horizon-postcard-banner {
  position: relative;
  height: 96px;
  display: flex;
  align-items: flex-end;
  padding: 0.6rem 0.75rem;
}
.horizon-banner-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.horizon-postcard-stamp {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  width: 18px;
  height: 22px;
  background: #FBF6EC;
  border: 1.5px dashed #C9BFAA;
  border-radius: 2px;
}
.horizon-postcard-place {
  position: relative;
  z-index: 1;
  font-family: 'Satoshi', sans-serif;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
}

.horizon-postcard-body { padding: 0.85rem 0.95rem 1rem; }
.horizon-postcard-kind {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3C5A63;
}
.horizon-postcard-city {
  font-family: 'Satoshi', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1E2A2E;
  margin: 0.2rem 0 0;
}
.horizon-postcard-dates {
  display: block;
  font-size: 0.7rem;
  color: #5C656B;
  margin-top: 0.2rem;
}
.horizon-postcard-summary {
  font-size: 0.74rem;
  line-height: 1.5;
  color: #5C656B;
  margin: 0.55rem 0 0;
}
.horizon-postcard-go {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.8rem;
  font-family: 'Satoshi', sans-serif;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.horizon-postcard-arrow { transition: transform 0.2s ease; }
.horizon-postcard:hover .horizon-postcard-arrow { transform: translateX(4px); }
.horizon-postcard-alpine .horizon-postcard-go { color: #C56F66; }
.horizon-postcard-sea .horizon-postcard-go { color: #11707C; }

/* jump pill — sticky, right-aligned, subtle */
.horizon-jump {
  position: sticky;
  top: 0.5rem;
  z-index: 5;
  display: block;
  width: max-content;
  margin: 0 0 0.5rem auto;
  padding: 0.3rem 0.7rem;
  font-family: 'Satoshi', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}
.horizon-jump:hover { opacity: 1; }

/* mobile horizon */
.journey-horizon-mobile { margin: 1rem 1rem 2rem; }
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 6: Live-preview check (desktop)**

With `npm run dev` running, open the preview at 1440×900, navigate to `/journey`, and scroll the right-hand timeline to the bottom.
Expected: below the last timeline card, a warm cream "Horizon" panel appears with a dark "Departures" board (two rows: `Jul 23 · DOLOMITES · IT · 4 nights`, `Aug 5 · CORFU · GR · 4 nights`) and two stacked postcards (Dolomites alpine art with coral peak; Corfu sea art with gold sun + teal waves). Hovering a postcard lifts it. Clicking opens the trip page in the same tab (no wash yet). A subtle "↓ upcoming journeys" pill sits at the top-right of the timeline and scrolls down when clicked.

- [ ] **Step 7: Commit**

```bash
git add src/Components/Journey/JourneyHorizon.jsx src/Components/Journey/JourneyTimeline.jsx src/styles.css
git commit -m "feat(journey): add the Horizon collection (departures board + postcards)"
```

---

## Task 3: The departure wash — Phase 2

The wash *logic* already shipped in Task 2 (`JourneyHorizon`'s `handleOpen` sets `departing` and navigates after 700 ms; the overlay element renders when `departing` is set). This task adds the **styles** that make that overlay a full-screen palette sweep, plus the reduced-motion guard. No JS changes.

**Files:**
- Modify: `src/styles.css` (append the wash styles)

- [ ] **Step 1: Append the departure-wash styles**

Add the following at the END of `src/styles.css`:

```css
/* ============================================================
   Departure wash — full-screen palette sweep when a postcard
   is opened, then navigation to the live trip page.
   ============================================================ */
.departure-wash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: washIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.departure-wash-alpine {
  background: radial-gradient(circle at 50% 60%, #EFEDE6, #C56F66);
}
.departure-wash-sea {
  background: radial-gradient(circle at 50% 60%, #114E5C, #0C3B45);
}
.departure-wash-label {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  animation: washLabel 0.7s ease forwards;
}
.departure-wash-alpine .departure-wash-label { color: #2C353C; }

@keyframes washIn {
  from { clip-path: circle(0% at 50% 60%); opacity: 0.6; }
  to   { clip-path: circle(150% at 50% 60%); opacity: 1; }
}
@keyframes washLabel {
  0%   { opacity: 0; transform: translateY(12px); }
  45%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .departure-wash,
  .departure-wash-label { animation: none; }
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 3: Live-preview check (desktop)**

With `npm run dev` running, open the preview at 1440×900, go to `/journey`, scroll to the Horizon, and click the **Dolomites** postcard.
Expected: a paper→coral radial wash sweeps from center, the word "Dolomites" fades up in dark ink, and after ~0.7 s the tab navigates to `https://itineraries.riwashouse.live/dolomites`. Repeat for **Corfu**: a sea→deep-teal wash with "Corfu" in white, landing on `/corfu`.

- [ ] **Step 4: Live-preview check (reduced motion)**

In the preview, emulate `prefers-reduced-motion: reduce` (via the Preview MCP's `preview_eval` to set the emulation, or DevTools rendering emulation), then click a postcard.
Expected: no wash overlay; the link navigates immediately to the trip page (the `<a href>` default fires because `handleOpen` returns early).

- [ ] **Step 5: Commit**

```bash
git add src/styles.css
git commit -m "feat(journey): play a themed departure wash when opening a trip"
```

---

## Task 4: The warming map — themed route + pins — Phase 3

Make the map's final route segments and active pin wear each destination's color when the active/target point is `upcoming` (coral → Dolomites, teal → Corfu). The route's scroll-reveal already uses `strokeDasharray`/`strokeDashoffset` for the draw-on effect, so we change **color**, not dashing (literal dashes would fight the reveal). The upcoming points are last in `journeyPoints`, so the existing route already reaches them — we only recolor.

**Files:**
- Modify: `src/Components/Journey/JourneyMap.jsx` (segments memo ~49–64; active-pin color ~30 + 235/243/247; render color ~199)

- [ ] **Step 1: Add a themed color to upcoming segments**

In `src/Components/Journey/JourneyMap.jsx`, replace the `segments` memo (currently lines 49–64):

```jsx
  // Per-segment paths with seasonal colors
  const segments = useMemo(() => {
    if (pointCoords.length < 2) return [];
    return journeyPoints.slice(1).map((point, i) => {
      const prev = pointCoords[i];
      const curr = pointCoords[i + 1];
      const dx = curr.x - prev.x;
      const cx = prev.x + dx * 0.5;
      const cy = prev.y - Math.abs(dx) * 0.12;
      const hue = getSeasonalHue(point.month);
      return {
        d: `M ${prev.x} ${prev.y} Q ${cx} ${cy}, ${curr.x} ${curr.y}`,
        hue,
        color: hue !== null ? `hsl(${hue}, 65%, 55%)` : null,
      };
    });
  }, [pointCoords]);
```

with:

```jsx
  // Per-segment paths — seasonal color, except segments arriving at an
  // upcoming trip, which take that destination's theme color.
  const segments = useMemo(() => {
    if (pointCoords.length < 2) return [];
    return journeyPoints.slice(1).map((point, i) => {
      const prev = pointCoords[i];
      const curr = pointCoords[i + 1];
      const dx = curr.x - prev.x;
      const cx = prev.x + dx * 0.5;
      const cy = prev.y - Math.abs(dx) * 0.12;
      const hue = getSeasonalHue(point.month);
      const upcoming = point.type === 'upcoming';
      const themeColor = upcoming ? (point.theme === 'sea' ? '#2C8A8A' : '#CE6B5C') : null;
      return {
        d: `M ${prev.x} ${prev.y} Q ${cx} ${cy}, ${curr.x} ${curr.y}`,
        hue,
        color: hue !== null ? `hsl(${hue}, 65%, 55%)` : null,
        upcoming,
        themeColor,
      };
    });
  }, [pointCoords]);
```

- [ ] **Step 2: Use the themed color when rendering the segment**

Replace the render color line (currently line 199):

```jsx
          const color = seg.color || 'var(--accent-primary)';
```

with:

```jsx
          const color = seg.upcoming ? seg.themeColor : (seg.color || 'var(--accent-primary)');
```

- [ ] **Step 3: Compute the active pin's themed color**

Replace the `seasonalHue` line (currently line 30):

```jsx
  const seasonalHue = activeIdx >= 0 ? getSeasonalHue(journeyPoints[activeIdx].month) : null;
```

with:

```jsx
  const seasonalHue = activeIdx >= 0 ? getSeasonalHue(journeyPoints[activeIdx].month) : null;
  const activePoint = activeIdx >= 0 ? journeyPoints[activeIdx] : null;
  const upcomingPinColor =
    activePoint && activePoint.type === 'upcoming'
      ? (activePoint.theme === 'sea' ? '#2C8A8A' : '#CE6B5C')
      : null;
```

- [ ] **Step 4: Apply the themed color to the active pin's halo, dot, and label**

In the active-pin block, add an inline `fill` to three elements. Replace the halo circle (currently line 235):

```jsx
            <circle cx={activeCoords.x} cy={activeCoords.y} r="1.2" filter="url(#pinGlow)" className="journey-pin-halo" />
```

with:

```jsx
            <circle cx={activeCoords.x} cy={activeCoords.y} r="1.2" filter="url(#pinGlow)" className="journey-pin-halo" style={upcomingPinColor ? { fill: upcomingPinColor } : undefined} />
```

Replace the pin dot (currently line 243):

```jsx
            <circle cx={activeCoords.x} cy={activeCoords.y} r="0.5" className="journey-pin-dot journey-pin-state-active" />
```

with:

```jsx
            <circle cx={activeCoords.x} cy={activeCoords.y} r="0.5" className="journey-pin-dot journey-pin-state-active" style={upcomingPinColor ? { fill: upcomingPinColor } : undefined} />
```

Replace the label `<text>` (currently lines 246–252):

```jsx
            <text
              x={activeCoords.x} y={activeCoords.y - 1.3}
              className="journey-pin-label active-label"
              textAnchor="middle"
            >
              {journeyPoints[activeIdx].city || journeyPoints[activeIdx].country}
            </text>
```

with:

```jsx
            <text
              x={activeCoords.x} y={activeCoords.y - 1.3}
              className="journey-pin-label active-label"
              textAnchor="middle"
              style={upcomingPinColor ? { fill: upcomingPinColor } : undefined}
            >
              {journeyPoints[activeIdx].city || journeyPoints[activeIdx].country}
            </text>
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 6: Live-preview check (desktop)**

With `npm run dev` running, open `/journey` at 1440×900 and scroll all the way down so the Horizon (and its postcards) come into view.
Expected: as the route draws past the last "lived" point, the segment to **Dolomites** reveals in coral and its pin/label turn coral; continuing to Corfu, that segment reveals in teal and the pin/label turn teal. The earlier (seasonal) segments are unchanged. The cream Horizon panel from Task 2 still warms the bottom of the timeline.

- [ ] **Step 7: Commit**

```bash
git add src/Components/Journey/JourneyMap.jsx
git commit -m "feat(journey): color the route and pins toward upcoming trips by theme"
```

---

## Task 5: Reach — mobile Horizon, deep link, jump pill — Phase 4

Replace the mobile "see it on your laptop" dead end with the mobile Horizon (stacked collection, full warm palette, no map), make `riwashouse.live/journey#horizon` scroll straight to the Horizon on load, and confirm the jump pill (added in Task 2) works.

**Files:**
- Modify: `src/Components/Journey.jsx` (import; `upcomingPoints`; hash-scroll effect; mobile branch)

- [ ] **Step 1: Import `JourneyHorizon`**

In `src/Components/Journey.jsx`, after the `JourneyTimeline` import (line 5):

```jsx
import JourneyTimeline from './Journey/JourneyTimeline';
```

add:

```jsx
import JourneyHorizon from './Journey/JourneyHorizon';
```

- [ ] **Step 2: Derive the upcoming points**

Right after `const isMobile = useIsMobile();` (line 27), add:

```jsx
  const upcomingPoints = journeyPoints.filter((p) => p.type === 'upcoming');
```

- [ ] **Step 3: Add the `#horizon` hash-scroll effect**

Immediately after the wheel-handler `useEffect` (the one ending `}, [isMobile]);` at line 114) and before the `if (isMobile)` block, add:

```jsx
  useEffect(() => {
    if (isMobile) return;
    if (typeof window === 'undefined' || window.location.hash !== '#horizon') return;
    const t = window.setTimeout(() => {
      document.getElementById('horizon')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
    return () => window.clearTimeout(t);
  }, [isMobile]);
```

(The 350 ms delay lets the React island hydrate and the timeline refs register before we scroll. On mobile the Horizon is near the top, so no scroll is needed there.)

- [ ] **Step 4: Replace the mobile branch with the mobile Horizon**

Replace the mobile fallback (currently lines 116–128):

```jsx
  if (isMobile) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="journey-mobile-fallback">
          <p className="journey-mobile-text">
            better to see it on your laptop for now
          </p>
        </div>
        <Footer />
      </div>
    );
  }
```

with:

```jsx
  if (isMobile) {
    return (
      <div className="page-container">
        <Navbar />
        <JourneyHorizon points={upcomingPoints} mobile />
        <Footer />
      </div>
    );
  }
```

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 6: Live-preview check (mobile)**

With `npm run dev` running, open the preview and resize to 390×844 (mobile), then go to `/journey`.
Expected: instead of the "see it on your laptop" message, the stacked mobile Horizon renders — "Journeys." title, "The Horizon · upcoming" eyebrow, the dark departures board, and the two postcards stacked vertically on the warm cream panel. Tapping a postcard plays the wash and opens the trip page.

- [ ] **Step 7: Live-preview check (deep link + jump pill)**

Still in preview, at desktop 1440×900, load `/journey#horizon` directly.
Expected: after load the timeline auto-scrolls so the Horizon is centered (map route shows coral/teal toward the pins). Then scroll back up and click the "↓ upcoming journeys" pill (top-right of the timeline) — it scrolls back down to the Horizon.

- [ ] **Step 8: Commit**

```bash
git add src/Components/Journey.jsx
git commit -m "feat(journey): mobile Horizon, #horizon deep link, jump-pill reach"
```

---

## Self-review

**Spec coverage** — every locked decision maps to a task:

| Spec requirement | Task |
|---|---|
| Horizon lives inside `/journey`, no new nav item | Task 2 (rendered inside the timeline; no nav changes anywhere) |
| Departures board **and** postcards (keep both) | Task 2 (`DeparturesBoard` + `Postcard` grid) |
| Open trip straight-through with a departure wash | Task 2 (logic) + Task 3 (wash styles) |
| Postcards register refs so the map keeps tracking upcoming points | Task 2 (`registerRef(point.id, el)` on each desktop entry) |
| Warm route to the pins, themed pins | Task 4 (coral/teal segment color + pin fill) |
| Palette warming toward the Horizon | Task 2 — realized as a self-contained warm **cream island** + `::before` fade (robust in both light and dark themes; a JS panel-bg interpolation would be invisible in light mode) |
| Mobile Horizon replaces the laptop wall | Task 5 |
| `#horizon` deep link | Task 5 (hash-scroll effect) |
| Entry pill scrolls to the Horizon | Task 2 (`.horizon-jump`, sticky top-right of the timeline — the journey page has no separate hero, so the pill lives in the timeline panel) |
| Remove old "View itinerary →" link + upcoming-card path | Task 2 (Timeline rewrite + CSS removals) |
| `prefers-reduced-motion` skips the wash | Task 2 (early return) + Task 3 (media query) |
| `npm run build` succeeds | Every task |

**Three conscious deviations from the spec's literal wording** (all noted above): (1) warming is a cream island, not a JS-interpolated panel background — because dark mode would hide a bg interpolation; (2) the route to upcoming pins is themed **color**, not literal dashes — because the reveal animation already owns `strokeDasharray`; (3) the entry pill sits in the timeline panel, not a separate "hero." Each preserves the spec's intent.

**Placeholder scan:** no TBD/TODO/"handle appropriately" — every code step shows complete code and exact find/replace targets.

**Type/name consistency (checked across tasks):**
- Props: `JourneyHorizon({ points, registerRef, mobile })` — Timeline passes `points={upcomingPoints} registerRef={registerRef}` (Task 2); Journey mobile passes `points={upcomingPoints} mobile` (Task 5). ✓
- Data fields used by the Horizon (`depart`, `code`, `nights`, `region`, `kind`, `dateRange`, `description`, `city`, `itinerary`, `theme`) are all added in Task 1. ✓
- `theme` values `'alpine' | 'sea'` are consistent across `BannerArt`, postcard className, wash className (Task 2/3), and `JourneyMap` themeColor/pin (Task 4). ✓
- CSS selectors (`.departure-wash`, `.departure-wash-alpine|-sea`, `.departure-wash-label`, `.horizon-postcard-alpine|-sea`) match the class strings the JSX builds. ✓

**Scope:** single subsystem (the `/journey` Horizon). Appropriate for one plan.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-15-travels-horizon.md`. Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Because the user asked to build it incrementally with live preview ("I want to always see it as we build it") and to "create a draft pr after," this plan is executed **inline** in this session: a feature branch, then Phase 1 → 4 each committed and previewed, then a draft PR against `master`.
