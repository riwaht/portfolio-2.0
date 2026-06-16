# /journey Terminal Takeover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recast the whole `/journey` page as one art-directed airport flight-information display — "RIWA HOTEIT INTL" — with Departures and Arrivals as mirrored split-flap boards on an always-dark terminal screen.

**Architecture:** Extract a shared `FlapBoard` split-flap primitive (and a `Clock`) that both Departures and Arrivals render as thin configs. Replace the editorial masthead with a `TerminalHeader` (identity, clock, stats, LED ticker), keep the poster spreads re-captioned as "Now Boarding," and add an `ArrivalsBoard` fed by the existing `getArrivalsLedger()`. Make `body.journey-page` render a single dark device palette regardless of the site light/dark toggle.

**Tech Stack:** Astro 6 + React 18 (`client:only` islands), vanilla CSS in `src/styles.css`. No test framework — every task is gated by `npm run build` passing plus a live-preview visual check.

---

## Conventions & guardrails (read once)

- **Branch:** all commits go on `feat/travels-horizon` (draft PR #6). **Never push to `master`/default.** Push to update the PR when convenient (e.g. after each verified task).
- **Build warning to ignore:** `npm run build` always prints a `(!) Some chunks are larger than 500 kB after minification` notice. That is expected — it is NOT a failure. The build is green if it exits 0 and writes `dist/`.
- **No unit tests exist.** "Verify" = `npm run build` exits clean **and** the live preview at `/journey` shows the described result. Where colour/theme is the point, also confirm via a computed-style read (`getComputedStyle`) because the offscreen preview tab can render a stale background image.
- **Always-dark caveat (Task 3 onward):** the page is dark in BOTH site-theme states. To verify, toggle the site theme and confirm the page does NOT lighten.
- **DRY / YAGNI / TDD-adapted / frequent commits.** One focused commit per task; each commit leaves `/journey` working.

## File structure

**New files**
- `src/Components/Journey/Clock.jsx` — shared ticking screen clock (`HH:MM`, opt-in `HH:MM:SS`). Used by `FlapBoard` and `TerminalHeader`.
- `src/Components/Journey/FlapBoard.jsx` — generic split-flap board: device shell, header (title · live · clock), column heads, staggered flap rows + year-divider rows. Departures and Arrivals are thin configs over it.
- `src/Components/Journey/TerminalHeader.jsx` — airport identity header (ID strip, Fraunces `Journeys.` title, stats readout with live ping, LED ticker).
- `src/Components/Journey/ArrivalsBoard.jsx` — maps `getArrivalsLedger()` → `FlapBoard` rows with year dividers and `ARRIVED`/`HOME`/`LIVE · HOME` remarks.

**Modified files**
- `src/Components/Journey/DeparturesBoard.jsx` — reduced to a thin config over `FlapBoard`.
- `src/Components/Journey/JourneyBoard.jsx` — recomposed: `TerminalHeader` → Departures board → Now Boarding posters → Arrivals board → terminal footer. Departure-wash + bfcache `pageshow` handler preserved verbatim.
- `src/styles.css` — rename `.dep-*` board rules → shared `.fb-*`; add divider + arrival remark variants; collapse the per-theme `jb-*` palette into one always-dark screen palette; add `.th-*` header rules; remove dead masthead/atlas rules.

**Removed files**
- `src/Components/Journey/AtlasIndex.jsx` — its data grouping + year logic move into `ArrivalsBoard.jsx`.

---

### Task 1: Extract the shared `Clock` component

Pull the ticking clock currently inline in `DeparturesBoard` into its own file so `TerminalHeader` can reuse it. Add an opt-in `seconds` prop for the terminal-header `HH:MM:SS` readout. Class names stay `dep-clock`/`dep-colon` for now — Task 2 renames them to `fb-*`.

**Files:**
- Create: `src/Components/Journey/Clock.jsx`
- Modify: `src/Components/Journey/DeparturesBoard.jsx:1-39` (remove inline `Clock`, import the new one)

- [ ] **Step 1: Create `Clock.jsx`**

```jsx
import { useState, useEffect } from 'react';

/**
 * A ticking screen clock for the terminal boards. Renders `HH:MM` by default;
 * pass `seconds` for the `HH:MM:SS` terminal-header readout. The colon(s) blink
 * via CSS (.dep-colon — renamed to .fb-colon in the FlapBoard migration).
 */
function Clock({ seconds = false, className = 'dep-clock' }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return (
    <span className={className}>
      {hh}<span className="dep-colon">:</span>{mm}
      {seconds && <><span className="dep-colon">:</span>{ss}</>}
    </span>
  );
}

export default Clock;
```

- [ ] **Step 2: Replace the inline `Clock` in `DeparturesBoard.jsx`**

Change the imports at the top (lines 1-2) from:

```jsx
import { useState, useEffect } from 'react';
import { prefersReducedMotion } from '../../Utils/ui';
```

to:

```jsx
import Clock from './Clock';
import { prefersReducedMotion } from '../../Utils/ui';
```

Then delete the entire inline `Clock` function (the `// Ticking HH:MM clock…` comment through its closing `}`, lines 27-39). Leave the `<Clock />` usage in the board head untouched — it now resolves to the imported component.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exits 0, writes `dist/`. Ignore the >500 kB chunk warning.

- [ ] **Step 4: Preview check**

Open the live preview at `/journey`. The Departures board clock still ticks `HH:MM` with a blinking colon — visually unchanged from before.

- [ ] **Step 5: Commit**

```bash
git add src/Components/Journey/Clock.jsx src/Components/Journey/DeparturesBoard.jsx
git commit -m "$(cat <<'EOF'
refactor(journey): extract shared Clock component

Pull the ticking screen clock out of DeparturesBoard into its own
component with an opt-in seconds prop, so the upcoming TerminalHeader
can reuse it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Build the `FlapBoard` primitive, rename `.dep-*` → `.fb-*`, migrate Departures

Introduce the generic split-flap board and re-express Departures as a thin config over it. The CSS board rules rename from the `.dep-*` namespace to a shared `.fb-*` one (safe: `dep-`/`depFlap`/`depBlink` appear only in `styles.css` and `DeparturesBoard.jsx`). The page must look identical afterward.

**Files:**
- Create: `src/Components/Journey/FlapBoard.jsx`
- Modify: `src/styles.css` (rename `.dep-*`→`.fb-*`; widen the shared grid)
- Modify: `src/Components/Journey/Clock.jsx` (two class names → `fb-*`)
- Modify: `src/Components/Journey/DeparturesBoard.jsx` (rewrite as thin config)

- [ ] **Step 1: Rename the board CSS namespace**

Run this scoped rename (safe per the grep above — these tokens exist only in the journey block and `DeparturesBoard.jsx`, which we rewrite this task):

```bash
cd "/Users/riwa.hoteit/personal repos/portfolio-2.0"
sed -i '' -e 's/dep-/fb-/g' -e 's/depFlap/fbFlap/g' -e 's/depBlink/fbBlink/g' src/styles.css
```

Verify nothing `dep-` remains in the stylesheet:

Run: `grep -c 'dep-\|depFlap\|depBlink' src/styles.css`
Expected: `0`

- [ ] **Step 2: Widen the shared board grid for both boards**

The shared grid must fit Departures (`23 JUL`) AND Arrivals (`SEP 2025`, `LIVE · HOME`). In `src/styles.css`, find the renamed rule:

```css
.fb-cols, .fb-row {
  display: grid; grid-template-columns: 88px 1fr 104px 132px;
  gap: 16px; align-items: center;
}
```

Change the `grid-template-columns` value to:

```css
  display: grid; grid-template-columns: 92px 1fr 96px 152px;
```

- [ ] **Step 3: Update `Clock.jsx` class names to `fb-*`**

In `src/Components/Journey/Clock.jsx`, change the default prop `className = 'dep-clock'` to `className = 'fb-clock'`, and change both occurrences of `<span className="dep-colon">` to `<span className="fb-colon">`. The component body now reads:

```jsx
function Clock({ seconds = false, className = 'fb-clock' }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return (
    <span className={className}>
      {hh}<span className="fb-colon">:</span>{mm}
      {seconds && <><span className="fb-colon">:</span>{ss}</>}
    </span>
  );
}
```

- [ ] **Step 4: Create `FlapBoard.jsx`**

```jsx
import { Fragment } from 'react';
import Clock from './Clock';
import { prefersReducedMotion } from '../../Utils/ui';

// One Solari "flap" tile — flips down into place on load (staggered by `delay`).
function Flap({ children, delay = 0, className = '' }) {
  return (
    <span className={`fb-flap ${className}`} style={{ '--d': `${delay}s` }}>{children}</span>
  );
}

// One board row. A divider row ({ divider }) draws a thin year band; a data row
// renders its cells, wrapping flap cells in <Flap> and stacking any `sub` line
// beneath. Rows with `href` link (Departures); rows without are static (Arrivals).
function Row({ row, rowIndex, stagger }) {
  if (row.divider) {
    return (
      <div className="fb-divider" aria-hidden="true"><span>{row.divider}</span></div>
    );
  }
  const cells = row.cells.map((cell, col) => {
    const body =
      cell.flap === false ? (
        <span className={cell.className}>{cell.content}</span>
      ) : (
        <Flap delay={stagger(rowIndex, col)} className={cell.className}>{cell.content}</Flap>
      );
    if (cell.sub != null) {
      return (
        <span className="fb-dest" key={col}>
          {body}
          <span className="fb-region">{cell.sub}</span>
        </span>
      );
    }
    return <Fragment key={col}>{body}</Fragment>;
  });
  const className = `fb-row${row.live ? ' fb-row-live' : ''}`;
  return row.href ? (
    <a className={className} href={row.href} onClick={row.onClick}>{cells}</a>
  ) : (
    <div className={className}>{cells}</div>
  );
}

/**
 * A generic airport split-flap board: the dark "screen" device shell, a header
 * (title · live pip · ticking clock), column heads, and staggered flap rows.
 * Both DEPARTURES and ARRIVALS are thin configs over this one primitive.
 *
 *   title    — device header label (e.g. "CDG · PARIS")
 *   columns  — array of column-head strings
 *   rows     — array of { key, href?, onClick?, live?, cells: [{ content, className, flap?, sub? }] }
 *              or a divider row { key, divider }
 *   ariaLabel— accessible name for the board region
 */
function FlapBoard({ title, columns, rows, ariaLabel }) {
  if (!rows || rows.length === 0) return null;
  const reduce = prefersReducedMotion();
  // Compress the per-row delay for long boards so ~22 arrivals still finish fast.
  const rowStep = Math.min(0.16, 1.6 / rows.length);
  const stagger = (r, c) => (reduce ? 0 : 0.12 + r * rowStep + c * 0.07);

  return (
    <div className="fb-board" aria-label={ariaLabel}>
      <div className="fb-head">
        <span className="fb-title">{title}</span>
        <span className="fb-live"><span className="fb-live-dot" aria-hidden="true" /> Live</span>
        <Clock />
      </div>
      <div className="fb-cols" aria-hidden="true">
        {columns.map((c) => <span key={c}>{c}</span>)}
      </div>
      <div className="fb-rows">
        {rows.map((row, i) => (
          <Row key={row.key} row={row} rowIndex={i} stagger={stagger} />
        ))}
      </div>
    </div>
  );
}

export default FlapBoard;
```

- [ ] **Step 5: Rewrite `DeparturesBoard.jsx` as a thin config**

Replace the ENTIRE file with:

```jsx
import FlapBoard from './FlapBoard';

// "RH 0723" — a stable flight number built from the departure date.
const flightNo = (trip) => {
  const mmdd = (trip.startDate || '').slice(5).replace('-', '');
  return `RH ${mmdd || '000'}`;
};

const MON = { Jan: 'JAN', Feb: 'FEB', Mar: 'MAR', Apr: 'APR', May: 'MAY', Jun: 'JUN', Jul: 'JUL', Aug: 'AUG', Sep: 'SEP', Oct: 'OCT', Nov: 'NOV', Dec: 'DEC' };

// "Jul 23" → "23 JUL" for the board's departure column.
const departDate = (trip) => {
  const [mon, day] = (trip.depart || '').split(' ');
  if (mon && day) return `${day.padStart(2, '0')} ${MON[mon] || mon.toUpperCase()}`;
  return (trip.dateRange || '').toUpperCase();
};

// A real-board "REMARKS" status, derived from the trip's lifecycle status.
// The soonest still-upcoming trip is "Boarding"; later upcoming ones "On time";
// trips whose dates have passed read "Departed".
const remark = (trip, isNext) => {
  if (trip.status !== 'upcoming') return { text: 'Departed', kind: 'departed' };
  return isNext ? { text: 'Boarding', kind: 'boarding' } : { text: 'On time', kind: 'ontime' };
};

const COLUMNS = ['Departs', 'Destination', 'Flight', 'Remarks'];

/**
 * The DEPARTURES board: one flight row per featured itinerary, departing the
 * current base (Paris · CDG). Rows link to the live itinerary and trigger the
 * same palette wash as the poster spreads. A thin config over FlapBoard.
 */
function DeparturesBoard({ trips, origin, onOpen }) {
  if (!trips || trips.length === 0) return null;
  const nextId = (trips.find((t) => t.status === 'upcoming') || {}).id;
  const title = origin ? `${origin.code} · ${origin.city}` : 'Departures';

  const rows = trips.map((trip) => {
    const r = remark(trip, trip.id === nextId);
    return {
      key: trip.id,
      href: trip.itinerary,
      onClick: onOpen ? (e) => onOpen(e, trip) : undefined,
      cells: [
        { content: departDate(trip), className: 'fb-when' },
        { content: trip.city, className: 'fb-city', sub: trip.region || trip.country },
        { content: flightNo(trip), className: 'fb-flight' },
        {
          content: (
            <>
              {r.text}
              <span className="fb-arrow" aria-hidden="true">→</span>
            </>
          ),
          className: `fb-status fb-status-${r.kind}`,
        },
      ],
    };
  });

  return <FlapBoard title={title} columns={COLUMNS} rows={rows} ariaLabel="Departures board" />;
}

export default DeparturesBoard;
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: exits 0. Ignore the chunk-size warning.

- [ ] **Step 7: Preview check**

Open `/journey`. The Departures board is visually identical to before: same dark screen, `CDG · PARIS` title, ticking clock, flap rows for the upcoming/documented trips, `Boarding`/`On time`/`Departed` remarks, hover wash navigation intact.

- [ ] **Step 8: Commit**

```bash
git add src/styles.css src/Components/Journey/FlapBoard.jsx src/Components/Journey/Clock.jsx src/Components/Journey/DeparturesBoard.jsx
git commit -m "$(cat <<'EOF'
refactor(journey): add shared FlapBoard primitive, migrate Departures

Introduce a generic split-flap board (device shell, header, column
heads, staggered flap + divider rows) and re-express DeparturesBoard
as a thin config over it. Rename the board CSS from the .dep-* to a
shared .fb-* namespace and widen the grid to fit both boards. No
visual change to Departures.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Make the page an always-dark screen

Collapse the two-theme `jb-*` palette (light `body.journey-page` + a `html[data-theme="dark"] body.journey-page` override) into ONE always-dark device palette on `body.journey-page`. The site light/dark toggle no longer lightens this page — it is one continuous dark terminal. The device tokens (`--jb-screen-rgb`) and the board's own `--d-*` palette are unaffected.

**Files:**
- Modify: `src/styles.css:2747-2829` (the `body.journey-page` palette block + the dark override block)

- [ ] **Step 1: Replace the light `body.journey-page` palette with the dark one**

In `src/styles.css`, replace the whole block from `body.journey-page {` (≈line 2747) through `body.journey-page .footer-text { color: var(--jb-ink-soft); }` (≈line 2800) with:

```css
body.journey-page {
  /* Always-dark terminal screen — one continuous FIDS display regardless of the
     site light/dark toggle. (Formerly split into a light palette + a dark
     override; the page now renders its own device palette unconditionally.) */
  --jb-paper: #15171C;
  --jb-paper-2: #1B1E24;
  --jb-card: #1E232B;
  --jb-ink: #ECE6D8;
  --jb-ink-soft: #B4B0A2;
  --jb-muted: #837F70;
  --jb-line: #2D323B;
  --jb-line-2: #3A404A;
  --jb-line-strong: #5E6258;
  --jb-oxblood: #D58D6F;
  --jb-gold: #D9B25E;
  --jb-coral: #DA8472;
  --jb-teal: #4FB0A6;
  --jb-alpine: #5FB58E;
  --jb-sea: #5AA9C9;
  /* Near-white "ink" printed on the board + poster screens. */
  --jb-screen-rgb: 244, 236, 220;
  /* Terminal amber — the board/header signage accent. */
  --jb-amber: #E8B23A;
  /* Grow with content so the screen + grain fill the entire page (the global
     height:100% otherwise locks the body to one viewport). */
  height: auto;
  min-height: 100vh;
  background-color: var(--jb-paper);
  background-image:
    radial-gradient(1200px 620px at 50% -120px, rgba(213, 141, 111, 0.10), transparent 70%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  background-repeat: no-repeat, repeat;
  color: var(--jb-ink);
}
/* Paper the root canvas too, so overscroll/rubber-band never flashes the site bg. */
html:has(body.journey-page) { background-color: #15171C; }
body.journey-page .page-container { background-color: transparent; }
/* Let the shared site footer settle onto the screen instead of its own slab. */
body.journey-page .footer {
  background-color: transparent;
  border-top: 1px solid var(--jb-line);
}
body.journey-page .social-icon {
  background-color: transparent;
  border-color: var(--jb-line-2);
  color: var(--jb-ink-soft);
}
body.journey-page .social-icon:hover {
  background-color: var(--jb-oxblood);
  border-color: var(--jb-oxblood);
  color: var(--jb-paper);
}
body.journey-page .footer-text { color: var(--jb-ink-soft); }
```

(Note the added `--jb-amber` token — reused by the board signage and the new header.)

- [ ] **Step 2: Delete the now-redundant dark override block**

Delete the entire block from the `/* ---- Dark mode: the field notebook after dark ---- */` comment (≈line 2802) through `html[data-theme="dark"] body.journey-page .footer { border-top-color: var(--jb-line); }` (≈line 2829). The page is dark unconditionally now, so the per-theme override is dead.

- [ ] **Step 3: Point the board signage at the shared amber token**

Now that `--jb-amber` exists on the page, drop the board's duplicate literal. In `src/styles.css`, in the `.fb-board { … }` rule, change:

```css
  --d-line: #2E323C;
  --d-amber: #E8B23A;
  --d-ink: #1A1410;
```

to:

```css
  --d-line: #2E323C;
  --d-amber: var(--jb-amber);
  --d-ink: #1A1410;
```

- [ ] **Step 4: Make the shared site nav + mobile menu continuous with the screen**

The sticky site nav (`.navbar`) and the mobile menu read SITE-level tokens
(`--nav-bg`, `--accent-primary`, `--text-primary`, …) that still resolve to LIGHT
values under the site's light theme — leaving a light bar sitting on top of the
dark page (the site's *dark* theme is navy `#2F4858`, which also doesn't match the
terminal charcoal). Journey *content* uses `jb-*` tokens and is self-contained, so
remap only the shared site tokens to the terminal palette, scoped to
`body.journey-page`, so the bar reads as part of the screen in BOTH themes. Add
this rule immediately after the `body.journey-page .footer-text { … }` line:

```css
/* The shared sticky nav + mobile menu read site-level tokens; remap them to the
   terminal palette so the bar is part of the dark screen in both site themes.
   Journey content uses jb-* tokens, so this only retargets the shared chrome. */
body.journey-page {
  --nav-bg: rgba(21, 23, 28, 0.92);
  --bg-primary: var(--jb-paper);
  --bg-secondary: var(--jb-paper-2);
  --card-bg: var(--jb-card);
  --text-primary: var(--jb-ink);
  --text-secondary: var(--jb-ink-soft);
  --accent-primary: var(--jb-amber);
  --accent-secondary: var(--jb-gold);
  --border-color: var(--jb-line);
}
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: exits 0. Ignore the chunk-size warning.

- [ ] **Step 6: Preview check (both theme states + nav)**

Open `/journey` with the site in LIGHT theme: the page AND the sticky top nav are
the dark charcoal terminal (not paper); the brand reads amber. Open the mobile
hamburger menu — the overlay is charcoal too. Toggle the site to DARK: nothing
changes. Confirm via computed-style reads (defeats stale offscreen paint):

Run: `getComputedStyle(document.body).backgroundColor` → `rgb(21, 23, 28)` in BOTH states.
Run: `getComputedStyle(document.querySelector('.navbar')).backgroundColor` → a dark `rgba(21, 23, 28, …)` in BOTH states.

- [ ] **Step 7: Commit**

The palette collapse (Steps 1–3) already landed as the "always-dark terminal
screen" commit. Commit the nav continuity (Step 4) separately:

```bash
git add src/styles.css
git commit -m "$(cat <<'EOF'
feat(journey): make the page an always-dark terminal screen

Collapse the light + dark jb-* palettes into one always-dark device
palette on body.journey-page, so /journey reads as one continuous FIDS
display regardless of the site light/dark toggle. Add a shared
--jb-amber signage token and point the board at it.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Then the nav-continuity commit:

```bash
git add src/styles.css
git commit -m "$(cat <<'EOF'
feat(journey): carry the always-dark screen into the shared nav

Remap the site-level nav/menu tokens to the terminal palette on
body.journey-page so the sticky bar and mobile menu read as part of the
dark screen in both site themes (they previously stayed light under the
site light theme). Scoped to the journey page; other pages keep the
site palette.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Build the `TerminalHeader` and swap it in for the masthead

Replace the editorial masthead with the airport identity header: a mono ID strip (`RIWA HOTEIT INTL · RWA` + live `HH:MM:SS` clock and date), the Fraunces `Journeys.` title, a stats readout with the live "now" ping, and a scrolling LED ticker.

**Files:**
- Create: `src/Components/Journey/TerminalHeader.jsx`
- Modify: `src/styles.css` (add the `.th-*` block; extend entrance + reduced-motion selectors)
- Modify: `src/Components/Journey/JourneyBoard.jsx` (import + render `TerminalHeader`, compute boarding cities)

- [ ] **Step 1: Create `TerminalHeader.jsx`**

```jsx
import Clock from './Clock';
import { pad2 } from '../../Utils/ui';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * The terminal header — the airport identity strip that opens the page:
 * a mono ID strip (RIWA HOTEIT INTL · RWA + live HH:MM:SS clock and date),
 * the Fraunces "Journeys." title, a stats readout with the live "now" ping,
 * and a scrolling LED ticker of the lead line + boarding call.
 */
function TerminalHeader({ stats, currentCity, boarding = [] }) {
  const now = new Date();
  const dateStr = `${DAYS[now.getDay()]} ${pad2(now.getDate())} ${MONS[now.getMonth()]}`;

  const boardingCall = boarding.length
    ? `NOW BOARDING: ${boarding.map((c) => c.toUpperCase()).join(' ✦ ')}`
    : '';
  const tickerText = `EVERYWHERE ELSE THE ROAD HAS GONE${boardingCall ? ` ✦ ${boardingCall}` : ''} ✦ `;

  return (
    <header className="th">
      <div className="th-id">
        <span className="th-code">RIWA HOTEIT INTL <span className="th-iata">· RWA</span></span>
        <span className="th-now">
          <Clock seconds className="th-clock" />
          <span className="th-date">{dateStr}</span>
        </span>
      </div>

      <div className="th-eyebrow">The Travel Index</div>
      <h1 className="th-h1">Journeys<span className="th-dot">.</span></h1>

      <div className="th-stats">
        <span><b>{pad2(stats.cities)}</b> Cities</span><span className="th-sep" aria-hidden="true" />
        <span><b>{pad2(stats.countries)}</b> Countries</span><span className="th-sep" aria-hidden="true" />
        <span><b>{pad2(stats.continents)}</b> Continents</span><span className="th-sep" aria-hidden="true" />
        <span>Since <b>2018</b></span>
        {currentCity && (
          <span className="th-live-wrap"><span className="th-live" aria-hidden="true" /> Now in {currentCity}</span>
        )}
      </div>

      <div className="th-ticker" aria-hidden="true">
        <div className="th-track">
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>
    </header>
  );
}

export default TerminalHeader;
```

- [ ] **Step 2: Add the `.th-*` CSS**

In `src/styles.css`, immediately AFTER the masthead block (after the `@keyframes jbPing { … }` rule, ≈line 2881) insert:

```css
/* =================== TERMINAL HEADER =================== */
.th { padding: clamp(28px, 5vw, 52px) 0 clamp(20px, 3vw, 32px); }
.th-id {
  display: flex; align-items: center; justify-content: space-between; gap: 12px 20px;
  flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid var(--jb-line);
  font-family: var(--font-mono);
}
.th-code {
  font-size: 0.8rem; font-weight: 600; letter-spacing: 0.34em;
  text-transform: uppercase; color: var(--jb-amber);
}
.th-iata { color: var(--jb-ink-soft); }
.th-now { display: inline-flex; align-items: center; gap: 14px; }
.th-clock {
  font-weight: 600; font-size: 0.92rem; letter-spacing: 0.1em;
  color: rgb(var(--jb-screen-rgb)); font-variant-numeric: tabular-nums;
}
.th-date {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--jb-muted);
}
.th-eyebrow {
  margin: clamp(26px, 4vw, 40px) 0 18px;
  font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.42em;
  text-transform: uppercase; color: var(--jb-amber);
}
.th-h1 {
  font-size: clamp(4rem, 13vw, 10.5rem); line-height: 0.84; margin: 0;
  font-style: italic; font-weight: 360; font-variation-settings: 'opsz' 144;
  letter-spacing: -0.025em; color: var(--jb-ink);
}
.th-h1 .th-dot { color: var(--jb-amber); }
.th-stats {
  margin-top: clamp(28px, 4vw, 44px);
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px 26px;
  padding-top: 18px; border-top: 1px solid var(--jb-line-strong);
  font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--jb-ink-soft);
}
.th-stats .th-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--jb-line-2); }
.th-stats b { color: var(--jb-ink); font-weight: 600; }
.th-live-wrap { margin-left: auto; display: inline-flex; align-items: center; gap: 9px; color: var(--jb-ink); }
.th-live {
  --ping: 46, 111, 94;
  width: 7px; height: 7px; border-radius: 50%; background: var(--jb-alpine);
  box-shadow: 0 0 0 0 rgba(var(--ping), 0.45); animation: jbPing 2.4s ease-out infinite;
}
/* LED ticker — a horizontally scrolling marquee, masked to fade at the edges. */
.th-ticker {
  margin-top: clamp(22px, 3vw, 32px); overflow: hidden;
  border-top: 1px solid var(--jb-line); border-bottom: 1px solid var(--jb-line); padding: 10px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.th-track { display: inline-flex; white-space: nowrap; animation: thTicker 28s linear infinite; }
.th-track span {
  font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.26em;
  text-transform: uppercase; color: var(--jb-amber); padding-right: 1.5em;
}
@keyframes thTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

- [ ] **Step 3: Add `.th` to the entrance animation; add the ticker/ping to reduced-motion**

In `src/styles.css`, find the entrance selector (≈line 3147):

```css
.jb-masthead, .jb-slabel, .jb-feature, .jb-atlas, .jb-foot {
  animation: jbRise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
```

Change it to include `.th`:

```css
.th, .jb-masthead, .jb-slabel, .jb-feature, .jb-atlas, .jb-foot {
  animation: jbRise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
```

Then in the final reduced-motion block (≈line 3166), change:

```css
@media (prefers-reduced-motion: reduce) {
  .jb-live, .jb-fstatus-dot { animation: none; }
  .jb-masthead, .jb-slabel, .jb-feature, .jb-atlas, .jb-foot { animation: none; }
  .jb-feature:hover .jb-fplate svg { transform: none; }
}
```

to:

```css
@media (prefers-reduced-motion: reduce) {
  .jb-live, .th-live, .jb-fstatus-dot { animation: none; }
  .th-track { animation: none; }
  .th, .jb-masthead, .jb-slabel, .jb-feature, .jb-atlas, .jb-foot { animation: none; }
  .jb-feature:hover .jb-fplate svg { transform: none; }
}
```

- [ ] **Step 4: Render `TerminalHeader` in `JourneyBoard.jsx`**

In `src/Components/Journey/JourneyBoard.jsx`, add the import near the other component imports (after the `import DeparturesBoard` line):

```jsx
import TerminalHeader from './TerminalHeader';
```

Compute the boarding cities — add this right after the `origin` line (≈line 31):

```jsx
  // Upcoming featured trips power the header's "now boarding" ticker call.
  const boardingCities = featured
    .filter((t) => t.status === 'upcoming')
    .map((t) => t.city);
```

Then replace the entire `<header className="jb-masthead"> … </header>` block (≈lines 55-70) with:

```jsx
        <TerminalHeader stats={stats} currentCity={currentCity} boarding={boardingCities} />
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: exits 0. Ignore the chunk-size warning.

- [ ] **Step 6: Preview check**

Open `/journey`. The top of the page is now the terminal header: amber `RIWA HOTEIT INTL · RWA` (left) and a ticking `HH:MM:SS` + `MON 16 JUN` date (right) on a mono ID strip; the big Fraunces italic `Journeys.` title with an amber dot; the mono stats readout `02 CITIES … SINCE 2018` with a pulsing `NOW IN PARIS` dot pushed right; and a scrolling amber LED ticker reading `…EVERYWHERE ELSE THE ROAD HAS GONE ✦ NOW BOARDING: DOLOMITES ✦ CORFU ✦`. The Departures board and posters below are unchanged.

- [ ] **Step 7: Commit**

```bash
git add src/Components/Journey/TerminalHeader.jsx src/styles.css src/Components/Journey/JourneyBoard.jsx
git commit -m "$(cat <<'EOF'
feat(journey): add terminal header with live clock + LED ticker

Replace the editorial masthead with an airport identity header: a mono
ID strip (RIWA HOTEIT INTL · RWA + live HH:MM:SS clock and date), the
Fraunces "Journeys." title, a stats readout with the live now-ping, and
a scrolling LED ticker of the lead line + boarding call.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Build the `ArrivalsBoard` and swap it in for the atlas index

Add the Arrivals split-flap board fed by `getArrivalsLedger()` — one row per city, every row landed, broken into year-divider groups. Remarks mirror Departures: `ARRIVED` (stamped), `LIVE · HOME` with a ping (Paris/resident), `HOME` (Beirut). Swap it into `JourneyBoard` in place of `AtlasIndex` (the old component file is removed in Task 7).

**Files:**
- Create: `src/Components/Journey/ArrivalsBoard.jsx`
- Modify: `src/styles.css` (add `.fb-divider`, `.fb-row-live`, arrival remark variants + `.fb-livedot`; add `.fb-livedot` to reduced-motion)
- Modify: `src/Components/Journey/JourneyBoard.jsx` (swap `AtlasIndex` → `ArrivalsBoard`)

- [ ] **Step 1: Create `ArrivalsBoard.jsx`**

```jsx
import FlapBoard from './FlapBoard';

// Year for a ledger row: current resident → this year; dated stay → its year;
// the undated home base → its own "Base" group at the foot of the board.
function yearKey(item) {
  if (item.sortKey === Infinity) return new Date().getFullYear();
  if (item.sortKey > 0) return Math.floor(item.sortKey / 100);
  return 'Base';
}

// REMARKS for an arrival, mirroring the Departures status flap. The resident
// (Paris/now) row gets the live ping; the home base (Beirut) reads HOME; every
// other landed city reads ARRIVED.
const remark = (it) => {
  if (it.status === 'RESIDENT')
    return { content: (<><span className="fb-livedot" aria-hidden="true" /> Live · Home</>), kind: 'live' };
  if (it.status === 'HOME') return { content: 'Home', kind: 'home' };
  return { content: 'Arrived', kind: 'arrived' };
};

const COLUMNS = ['Arrived', 'From', 'Flight', 'Remarks'];

/**
 * The ARRIVALS board — the deduped arrivals ledger as a split-flap mirror of
 * Departures: one row per city, every row landed. Year-divider bands break the
 * ~22 rows into the index's year groups; the home base anchors the foot. Rows
 * are non-linking (no per-city itinerary), unlike Departures rows.
 */
function ArrivalsBoard({ items }) {
  if (!items || items.length === 0) return null;

  // Group newest-first by year, Base group last (mirrors the old AtlasIndex).
  const byYear = new Map();
  items.forEach((it) => {
    const key = yearKey(it);
    if (!byYear.has(key)) byYear.set(key, []);
    byYear.get(key).push(it);
  });
  const numeric = [...byYear.keys()].filter((k) => k !== 'Base').sort((a, b) => b - a);
  const ordered = byYear.has('Base') ? [...numeric, 'Base'] : numeric;

  const rows = [];
  ordered.forEach((year) => {
    rows.push({ key: `yr-${year}`, divider: `—— ${year} ——` });
    byYear.get(year).forEach((it) => {
      const r = remark(it);
      rows.push({
        key: it.id,
        live: it.status === 'RESIDENT',
        cells: [
          { content: it.label, className: 'fb-when' },
          { content: it.city, className: 'fb-city', sub: it.region },
          { content: it.iata, className: 'fb-flight' },
          { content: r.content, className: `fb-status fb-status-${r.kind}` },
        ],
      });
    });
  });

  return <FlapBoard title="RWA · RIWA HOTEIT INTL" columns={COLUMNS} rows={rows} ariaLabel="Arrivals board" />;
}

export default ArrivalsBoard;
```

- [ ] **Step 2: Add the divider + arrival-remark CSS**

In `src/styles.css`, immediately AFTER the `.fb-status-departed { … }` rule (the last Departures remark variant, ≈line 2988) insert:

```css
/* Arrivals — year-divider band + arrival remark variants (mirror Departures). */
.fb-divider {
  display: flex; justify-content: center; padding: 14px 8px 8px;
  font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.34em;
  text-transform: uppercase; color: #6C7160;
}
.fb-row-live { background: rgba(232, 178, 58, 0.06); }
.fb-status-arrived { color: #8FCFAE; }
.fb-status-home { color: var(--d-amber); }
.fb-status-live { color: var(--d-amber); display: inline-flex; align-items: center; gap: 7px; }
.fb-livedot {
  --ping: 232, 178, 58;
  width: 6px; height: 6px; border-radius: 50%; background: rgb(var(--ping));
  box-shadow: 0 0 0 0 rgba(var(--ping), 0.5); animation: jbPing 2.4s ease-out infinite;
}
```

- [ ] **Step 3: Add `.fb-livedot` to the board's reduced-motion block**

In `src/styles.css`, find the board reduced-motion block (≈line 2996, the one renamed to `.fb-flap`):

```css
@media (prefers-reduced-motion: reduce) {
  .fb-flap { animation: none; }
  .fb-colon, .fb-live-dot, .fb-status-boarding::before { animation: none; }
}
```

Change the second line to include `.fb-livedot`:

```css
@media (prefers-reduced-motion: reduce) {
  .fb-flap { animation: none; }
  .fb-colon, .fb-live-dot, .fb-livedot, .fb-status-boarding::before { animation: none; }
}
```

- [ ] **Step 4: Swap `AtlasIndex` → `ArrivalsBoard` in `JourneyBoard.jsx`**

In `src/Components/Journey/JourneyBoard.jsx`, change the import line:

```jsx
import AtlasIndex from './AtlasIndex';
```

to:

```jsx
import ArrivalsBoard from './ArrivalsBoard';
```

Then in the Arrivals section, change:

```jsx
          <AtlasIndex items={ledger} />
```

to:

```jsx
          <ArrivalsBoard items={ledger} />
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: exits 0. Ignore the chunk-size warning.

- [ ] **Step 6: Preview check**

Open `/journey` and scroll to Arrivals. It is now a split-flap board titled `RWA · RIWA HOTEIT INTL` with a ticking clock — visibly mirroring Departures. Columns read `ARRIVED · FROM · FLIGHT · REMARKS`. Thin `—— 2025 ——` divider bands separate the year groups. Nearly every row reads `ARRIVED`; the Paris row reads `LIVE · HOME` with a pulsing dot (and a faint amber row tint); the Beirut row reads `HOME`. The ~22 rows finish their flap reveal quickly (compressed stagger).

- [ ] **Step 7: Commit**

```bash
git add src/Components/Journey/ArrivalsBoard.jsx src/styles.css src/Components/Journey/JourneyBoard.jsx
git commit -m "$(cat <<'EOF'
feat(journey): add Arrivals split-flap board mirroring Departures

Map getArrivalsLedger() onto the shared FlapBoard: one row per city,
every row landed, grouped by year-divider bands. Remarks mirror
Departures — ARRIVED (stamped), LIVE · HOME with a ping (resident),
HOME (Beirut). Swap it in for the atlas index.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Recompose the page sections + terminal footer

Split the single "Departures" section into two — DEPARTURES (the board) and NOW BOARDING (the poster spreads, re-captioned as the gate detail) — move the "NN stops" tally into the Arrivals section header, and reframe the closing line as terminal chrome (`End of display`). The departure-wash + bfcache handler must stay byte-for-byte intact.

**Files:**
- Modify: `src/Components/Journey/JourneyBoard.jsx` (the returned JSX between `<TerminalHeader … />` and the closing `</div>` of `.jb-wrap`)

- [ ] **Step 1: Re-add the `pad2` import**

Task 4 removed `pad2` from `JourneyBoard.jsx`'s `Utils/ui` import (the masthead that used it was replaced by `TerminalHeader`). The new Arrivals header below calls `pad2(ledger.length)`, so re-add it. Change:

```jsx
import { prefersReducedMotion } from '../../Utils/ui';
```

to:

```jsx
import { pad2, prefersReducedMotion } from '../../Utils/ui';
```

- [ ] **Step 2: Replace the section markup**

In `src/Components/Journey/JourneyBoard.jsx`, replace everything from `{featured.length > 0 && (` through the closing `</div>` of the `.jb-foot` block with:

```jsx
        {featured.length > 0 && (
          <>
            <section aria-label="Departures — where I'm headed">
              <div className="jb-slabel">
                <h2>Departures</h2>
                <div className="jb-tag">Where I&apos;m headed<br />Boarding now · planned in full</div>
              </div>
              <DeparturesBoard trips={featured} origin={origin} onOpen={handleOpen} />
            </section>

            <section aria-label="Now boarding — the itineraries in detail">
              <div className="jb-slabel">
                <h2>Now Boarding</h2>
                <div className="jb-tag">Gate detail<br />Walked day by day</div>
              </div>
              <div className="jb-features">
                {featured.map((trip, i) => (
                  <FeatureItinerary
                    key={trip.id}
                    trip={trip}
                    index={i}
                    alt={i % 2 === 1}
                    status={trip.status}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        <section aria-label="Arrivals — everywhere I've landed">
          <div className="jb-slabel">
            <h2>Arrivals</h2>
            <div className="jb-tag">{pad2(ledger.length)} stops<br />Everywhere I&apos;ve landed · 2018 — now</div>
          </div>
          <ArrivalsBoard items={ledger} />
        </section>

        <div className="jb-foot">
          <span>End of display</span>
          <span>Baggage claim · all carousels · Riwa Hoteit — Field Notes</span>
        </div>
```

Leave the `{departing && ( … departure-wash … )}` block and the `handleOpen`/`useEffect` logic above the `return` exactly as they are.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exits 0. Ignore the chunk-size warning.

- [ ] **Step 4: Preview check**

Open `/journey`. Top to bottom it now reads as one terminal: header → `Departures` (board) → `Now Boarding` (the poster spreads) → `Arrivals` (board, header shows the `NN stops` tally) → an `End of display` / baggage-claim footer. Click a Departures row: the palette wash still fires and navigates to the itinerary. Press Back: the page restores with no leftover wash (bfcache handler intact).

- [ ] **Step 5: Commit**

```bash
git add src/Components/Journey/JourneyBoard.jsx
git commit -m "$(cat <<'EOF'
feat(journey): recompose as terminal — departures, now boarding, arrivals

Split the section into DEPARTURES (board) and NOW BOARDING (the poster
spreads as gate detail), move the stops tally into the Arrivals header,
and reframe the closing line as terminal chrome (End of display). The
departure-wash + bfcache handler are unchanged.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Remove `AtlasIndex` and the dead masthead/atlas CSS

Delete the now-unused atlas component and prune the CSS rules the masthead + atlas left behind, so the stylesheet matches the terminal composition. Finish with a full-page + reduced-motion verification.

**Files:**
- Remove: `src/Components/Journey/AtlasIndex.jsx`
- Modify: `src/styles.css` (mono-fold selector; delete masthead + atlas rules; entrance + responsive selectors)

- [ ] **Step 1: Delete the atlas component**

Run: `git rm src/Components/Journey/AtlasIndex.jsx`

- [ ] **Step 2: Prune the shared mono-fold selector**

In `src/styles.css`, the mono-fold selector (≈line 2836) currently lists masthead + atlas classes that no longer exist. Replace the whole selector list:

```css
.jb-eyebrow, .jb-rule, .jb-tag, .jb-findex, .jb-fmeta, .jb-chip, .jb-fcta,
.jb-k, .jb-ctry, .jb-code, .jb-foot, .jb-prow-now .jb-city::after,
.jb-badge, .jb-iata, .jb-fstatus,
.fb-title, .fb-live, .fb-clock, .fb-cols, .fb-region, .fb-flap {
  font-family: var(--font-mono);
}
```

with the trimmed version (drops `.jb-eyebrow, .jb-rule, .jb-k, .jb-ctry, .jb-code, .jb-prow-now .jb-city::after`):

```css
.jb-tag, .jb-findex, .jb-fmeta, .jb-chip, .jb-fcta, .jb-foot,
.jb-badge, .jb-iata, .jb-fstatus,
.fb-title, .fb-live, .fb-clock, .fb-cols, .fb-region, .fb-flap {
  font-family: var(--font-mono);
}
```

- [ ] **Step 3: Delete the masthead CSS block**

In `src/styles.css`, delete the entire masthead section — from the `/* =================== MASTHEAD =================== */` comment through the `@keyframes jbPing { … }` rule's closing brace (the block defining `.jb-masthead, .jb-eyebrow, .jb-h1, .jb-dot, .jb-lead, .jb-rule, .jb-sep, .jb-now, .jb-live`, ≈lines 2843-2881).

**Keep `@keyframes jbPing`** — it is still used by `.th-live`, `.jb-fstatus-dot`, and `.fb-livedot`. Move the `@keyframes jbPing { … }` rule out of the deleted block: cut it before deleting, then paste it back immediately after the deletion point (just above the `/* =================== TERMINAL HEADER =================== */` comment).

- [ ] **Step 4: Delete the atlas CSS block**

In `src/styles.css`, delete the entire `/* =================== EVERYWHERE ELSE INDEX =================== */` section — from that comment through the `.jb-prow-home .jb-code { … }` rule (the block defining `.jb-atlas, .jb-atlas-aside, .jb-k, .jb-k-sub, .jb-big, .jb-yearblock, .jb-yearhead, .jb-yr, .jb-ln, .jb-prow, .jb-prow:hover, .jb-city, .jb-ctry, .jb-code, .jb-prow-now .jb-city::after, .jb-prow-home .jb-code`, ≈lines 3113-3137).

- [ ] **Step 5: Trim the entrance + responsive selectors of the removed `.jb-atlas`**

In `src/styles.css`, the entrance block (≈line 3147) now reads:

```css
.th, .jb-masthead, .jb-slabel, .jb-feature, .jb-atlas, .jb-foot {
  animation: jbRise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.jb-slabel { animation-delay: 0.05s; }
.jb-feature { animation-delay: 0.1s; }
.jb-atlas { animation-delay: 0.12s; }
```

Replace those four lines with (drop `.jb-masthead`, `.jb-atlas`, and the dead `.jb-atlas` delay):

```css
.th, .jb-slabel, .jb-feature, .jb-foot {
  animation: jbRise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.jb-slabel { animation-delay: 0.05s; }
.jb-feature { animation-delay: 0.1s; }
```

Then in the `@media (max-width: 880px)` block (≈line 3156), delete the two atlas lines:

```css
  .jb-atlas { grid-template-columns: 1fr; }
  .jb-atlas-aside { position: static; display: flex; align-items: baseline; gap: 16px; margin-bottom: 18px; }
  .jb-atlas-aside .jb-k-sub { margin-top: 0; }
```

(Remove all three of the above lines; keep the `.jb-feature` / `.jb-fplate` rules in that block.)

Finally, in the last reduced-motion block (≈line 3166), drop the dead `.jb-masthead, .jb-atlas` from the entrance line so it reads:

```css
  .th, .jb-slabel, .jb-feature, .jb-foot { animation: none; }
```

- [ ] **Step 6: Confirm no dead references remain**

Run: `grep -n 'jb-masthead\|jb-atlas\|jb-prow\|jb-yearblock\|jb-yearhead\|\.jb-k\b\|jb-big\|jb-eyebrow\|jb-h1\|jb-lead\|jb-rule\|AtlasIndex' src/styles.css src/Components/Journey/*.jsx`
Expected: no matches (every masthead/atlas symbol is gone; `.th-*` and `.fb-*` replace them).

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: exits 0. Ignore the chunk-size warning.

- [ ] **Step 8: Full-page + reduced-motion verification**

- Open `/journey` and screenshot the full page in the site's LIGHT theme, then toggle to DARK and screenshot again — both are the same continuous dark terminal (header → Departures → Now Boarding → Arrivals → footer), no light seam.
- Confirm the `Journeys.` title computes to a Fraunces face:
  Run (preview eval): `getComputedStyle(document.querySelector('.th-h1')).fontFamily`
  Expected: a value starting with `Fraunces`.
- Enable `prefers-reduced-motion` (emulate) and reload: no flap animation, no ticker scroll, no pulsing dots; the boards render fully populated and static.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
refactor(journey): remove AtlasIndex + dead masthead/atlas CSS

Delete the unused atlas component and prune the masthead + atlas style
rules now replaced by the terminal header and Arrivals board. Keep the
shared jbPing keyframe (still used by the header + board live dots).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 10: Push the branch to update PR #6**

```bash
git push origin feat/travels-horizon
```

(Never push to `master`.)

---

## Plan self-review

- **Spec coverage:** Terminal header (Task 4) ✓ · Departures via shared primitive (Task 2) ✓ · Now Boarding posters re-captioned (Task 6) ✓ · Arrivals board with year dividers + ARRIVED/HOME/LIVE remarks (Task 5) ✓ · terminal footer (Task 6) ✓ · `Clock`/`FlapBoard`/`TerminalHeader`/`ArrivalsBoard` primitives (Tasks 1–5) ✓ · `.dep-*`→`.fb-*` rename (Task 2) ✓ · always-dark page (Task 3) ✓ · `AtlasIndex` removed (Task 7) ✓ · departure-wash + bfcache preserved (Tasks 2,6) ✓ · reduced-motion + responsive (Tasks 4,5,7) ✓.
- **Deliberate scope deviations from the spec:** (1) the spec's `FlapBoard` `live` prop is dropped — both boards are live, so it is hard-coded (YAGNI). (2) The spec listed the wash overlay/handler as "stays"; this plan preserves them verbatim and calls that out in Tasks 2 & 6.
- **Type/name consistency:** `FlapBoard` row shape `{ key, href?, onClick?, live?, divider?, cells:[{ content, className, flap?, sub? }] }` is produced identically by `DeparturesBoard` (Task 2) and `ArrivalsBoard` (Task 5) and consumed by `FlapBoard` (Task 2). `Clock` props `{ seconds, className }` match all call sites. CSS classes referenced in JSX (`fb-when/fb-city/fb-region/fb-flight/fb-status/fb-status-*/fb-arrow/fb-livedot/th-*`) all have rules added in Tasks 2–5.
- **No placeholders:** every code/edit step shows complete content; every verification step gives an exact command + expected result.

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-16-journey-terminal-takeover.md`. Two execution options:

1. **Subagent-Driven (recommended)** — a fresh subagent per task, reviewed between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session with build + live-preview checkpoints (fits the "see it as we build it" cadence).

Which approach?
