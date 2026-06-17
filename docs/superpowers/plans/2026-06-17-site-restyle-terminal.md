# Site-Wide Terminal Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle every non-journey page (Home/About, Projects/Blog, House chrome, shared Navbar/Footer/Toggle) so the whole site speaks the same visual language as the `/journey` terminal — and make `/journey` itself theme-responsive — under one concept: **one world, two substrates.**

**Architecture:** The site already drives all theming through CSS custom properties on `<html>` (`:root` = light, `[data-theme="dark"]` = dark, toggled by `DarkModeToggle.jsx`). Today `/journey` opts out of that system entirely: `body.journey-page` hardcodes a private always-dark `--jb-*` palette. This plan inverts that relationship. We re-tune the **global** tokens into two coherent substrates of the same family — **dark = the illuminated terminal screen** (charcoal + terminal amber, glowing accents) and **light = a printed paper timetable** (warm cream paper + warm ink, the same alpine/sea/amber/oxblood/gold accents rendered as ink). Then we point `/journey`'s `--jb-*` tokens at those globals so the journey page follows the toggle (warm paper board in light, charcoal terminal in dark). All other pages inherit the new palette automatically; each page task then fixes the hardcoded colors and stray fonts that don't flow through tokens, and adopts the shared motif kit (mono microlabels, the ▲/≈ glyph family, the live-pip, oxblood hovers, screen-card surfaces).

**Tech Stack:** Astro 6 + React 18 (Journey is a `client:only="react"` island), vanilla CSS in a single `src/styles.css` (~3191 lines). No test framework — the gate is `npm run build` + live-preview visual check in **both** themes.

---

## How To Verify (read once, applies to every task)

There is **no test suite**. Every task's verification is the same three-part gate:

1. **Build green:**
   - Run: `npm run build`
   - Expected: exit 0, ends with `[build] Complete!`, builds **5 pages**.
   - **IGNORE** the line `(!) Some chunks are larger than 500 kB after minification.` — it prints on every build and is not an error.
2. **Live-preview visual, BOTH themes:** The dev preview runs on port 4321 (Preview MCP server "dev"). For each task, open the affected route, and use the dark-mode toggle to check the change in **dark** *and* **light**. Confirm the specific expectation listed in the task.
   - `preview_eval` is the reliable source of truth when screenshots glitch. Known screenshot quirks: if a screenshot comes back as thin slivers, the viewport collapsed to 1px wide — `preview_resize` to 1280×900 and retry. Screenshots deep in a long page (scrollY ≳ 1000) can come back as blank dark frames; to capture a low section, temporarily `display:none` the sections above it so the target floats near the top, screenshot, then reload to restore.
3. **Commit** (feature branch only — see Task 0): `git add <listed files> && git commit -m "<message>"`.

**Standing git rule (do not violate):** Work happens on a feature branch. **Never push to `master`/default branch.** Open a PR at the end; the human merges. Only commit/push as the plan's execution proceeds — the user choosing to execute this plan is the go-ahead for the per-task commits below.

---

## Design Reference

### Concept: one world, two substrates

The site is a single airport/terminal world rendered on two physical substrates:

- **Dark mode = the illuminated FIDS screen.** Charcoal device glass, terminal amber signage, accents that glow (mint "on-time", oxblood hovers, alpine/sea greens & teals at screen brightness). This is exactly today's `/journey` look, promoted to the whole site.
- **Light mode = the printed paper timetable.** Warm cream paper, warm near-black ink, the *same* accent family but mixed as ink (amber → ochre, oxblood → terracotta, alpine → ink-green, sea → ink-teal). Mechanical split-flap details (the flap seam, the flip animation) read as a physical manila board rather than a glowing screen.

Both substrates share: **Fraunces** (display) + **Spline Sans Mono** (microlabels/data); the **▲ alpine / ≈ sea** glyph motif; the **live-pip** ring-pulse; **oxblood** as the universal hover accent; **screen-card** surfaces (bordered, soft-shadowed panels). Two deliberate departures from today's palette: (1) **drop the bright web-blue `#2D6AF6`** — terminal amber becomes the primary accent; (2) **light-mode text shifts from cool slate `#2F4858` to warm ink `#29251E`.**

### Global token system (Task 1 installs these verbatim)

**Light — `:root`:**
```css
:root {
  /* Typography (unchanged) */
  --font-sans: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-mono: 'Spline Sans Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  /* Surfaces — warm printed paper */
  --bg-primary: #F3EBDA;
  --bg-primary-rgb: 243, 235, 218;
  --bg-secondary: #ECE1CB;
  --bg-accent: #E2D4B8;
  --card-bg: #FBF5E9;

  /* Ink */
  --text-primary: #29251E;
  --text-secondary: #6E6655;
  --text-muted: #938B77;

  /* Accents — same family as the terminal, mixed as ink */
  --accent-primary: #B5791A;   /* amber/ochre — replaces the old blue */
  --accent-secondary: #9E7A2B; /* gold */
  --accent-oxblood: #A8512C;   /* terracotta — universal hover */
  --accent-alpine: #2E7C58;    /* ink green */
  --accent-sea: #2B7791;       /* ink teal */

  /* Lines / chrome / depth */
  --nav-bg: rgba(243, 235, 218, 0.95);
  --border-color: rgba(41, 37, 30, 0.14);
  --border-strong: rgba(41, 37, 30, 0.28);
  --shadow-soft: rgba(41, 37, 30, 0.10);
  --shadow-strong: rgba(41, 37, 30, 0.20);

  /* Atmosphere (Task 3 consumes these) */
  --grain-opacity: 0.04;
  --glow-tint: rgba(168, 81, 44, 0.06);
}
```

**Dark — `[data-theme="dark"]`:**
```css
[data-theme="dark"] {
  /* Surfaces — illuminated terminal glass (today's jb-* dark values) */
  --bg-primary: #15171C;
  --bg-primary-rgb: 21, 23, 28;
  --bg-secondary: #1B1E24;
  --bg-accent: #1E232B;
  --card-bg: #1E232B;

  /* Ink — near-white screen text */
  --text-primary: #ECE6D8;
  --text-secondary: #B4B0A2;
  --text-muted: #837F70;

  /* Accents — screen brightness */
  --accent-primary: #E8B23A;   /* terminal amber */
  --accent-secondary: #D9B25E; /* gold */
  --accent-oxblood: #D58D6F;
  --accent-alpine: #5FB58E;
  --accent-sea: #5AA9C9;

  /* Lines / chrome / depth */
  --nav-bg: rgba(21, 23, 28, 0.92);
  --border-color: #2D323B;
  --border-strong: #3A404A;
  --shadow-soft: rgba(0, 0, 0, 0.30);
  --shadow-strong: rgba(0, 0, 0, 0.50);

  /* Atmosphere */
  --grain-opacity: 0.05;
  --glow-tint: rgba(213, 141, 111, 0.10);
}
```

### Journey `--jb-*` → global mapping (Task 2 installs)

`body.journey-page` stops defining a private palette and instead sources `--jb-*` from the globals, so the page follows the toggle. Two oddballs (`--jb-line-strong`, `--jb-screen-rgb`) and the FlapBoard **device** tokens (`--fb-*`, Task 9) have no global twin, so they get explicit light values on `body.journey-page` and dark overrides on `[data-theme="dark"] body.journey-page`. (`DarkModeToggle` sets `data-theme` on `<html>`, the ancestor of `<body>`, so that descendant selector is valid.)

### Shared motif kit (Task 4 installs; later tasks consume)

- **`.eyebrow`** — Spline Sans Mono, uppercase, wide tracking, `--text-muted`; the small "label above a heading" used all over `/journey`. Generic so any page can use it.
- **`.screen-card`** — `background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; box-shadow: 0 4px 20px var(--shadow-soft);` — the shared panel surface.
- **Oxblood hover** — links/icons/cards lift to `--accent-oxblood` on hover (replaces the various blue/olive hovers).
- **`@keyframes jbPing`** already exists globally (styles.css ~2831) — reuse for any live-pip.
- **Font alignment** — every stray monospace literal (`'Courier New'`, `'SF Mono', …`) becomes `var(--font-mono)`.

### Do NOT touch

- **The 3D scene** (`Model.jsx`, `Lighting.jsx`, `LightingWalkthrough.jsx`): pure React-Three-Fiber, no CSS. Three.js light color literals (`0x800020`, `0xffffbb`, `0x080820`) are scene lighting, not UI — **leave them.**
- **`.blog-card--mistral`** gradient (`#FFD800 / #FF8205 / #FA500F / #E10500`): an intentional brand reference for a Mistral post — **leave it.**
- **Journey JS/logic** (`journeyData.js` lifecycle, `JourneyBoard.jsx` wash, date-phase math): this is a *visual* restyle. Do not change behavior.

---

## File Structure

- `src/styles.css` — the single stylesheet; ~all work lands here. Touched by every task. Section anchors: global tokens (lines 1–31), shared base (33–260), home/about (~500–840), projects/blog (~840–1620), house chrome (~2400–2520), journey (~2745–3191).
- `src/Components/DarkModeToggle.jsx` — toggle button (Task 5; markup/label only if needed).
- `src/Components/About.jsx`, `ProjectsAndBlog.jsx`, `Navbar.jsx`, `Footer.jsx`, `House.jsx`, `WalkthroughUI.jsx` — touched only if a hardcoded inline style or class needs to change (most work is CSS-only). Each page task says explicitly whether a JSX edit is needed.

No new files. No new build steps.

---

### Task 0: Branch + commit the pending glyph work

The working tree has **4 uncommitted files** from the just-finished "glyph carries into Arrivals" feature (`ArrivalsBoard.jsx`, `FeatureItinerary.jsx`, `journeyData.js`, `styles.css`). The restyle must branch from a clean tree so these aren't entangled with palette changes.

**Files:**
- Commit (already-modified): `src/Components/Journey/ArrivalsBoard.jsx`, `src/Components/Journey/FeatureItinerary.jsx`, `src/Utils/journeyData.js`, `src/styles.css`

- [ ] **Step 1: Confirm what's pending**

Run: `git status` and `git diff --stat`
Expected: the 4 files above, modified, unstaged. (The `.fb-glyph` CSS lives at styles.css ~2988–2992; `THEME_GLYPH` export in journeyData.js; theme plumbed through `getArrivalsLedger`.)

- [ ] **Step 2: Commit the glyph feature on the current branch**

```bash
git add src/Components/Journey/ArrivalsBoard.jsx src/Components/Journey/FeatureItinerary.jsx src/Utils/journeyData.js src/styles.css
git commit -m "feat(journey): carry trip theme glyph into Arrivals rows"
```

- [ ] **Step 3: Create the restyle branch off the clean tree**

```bash
git checkout -b feat/site-restyle-terminal
```

(If the team prefers this to build on `master` after the journey PR merges, rebase later — but never push to `master` directly.)

- [ ] **Step 4: Baseline build**

Run: `npm run build`
Expected: exit 0, `[build] Complete!`, 5 pages. This is the known-good baseline before any palette change.

---

### Task 1: Re-tune the global token system

Replace the two global token blocks with the two-substrate system. This is the keystone — every other page changes appearance the moment this lands, because they already consume these tokens.

**Files:**
- Modify: `src/styles.css:1-31` (the `:root` and `[data-theme="dark"]` blocks)

- [ ] **Step 1: Replace `:root` (lines 1–17)**

Replace the entire current `:root { … }` block with the **Light — `:root`** block from the Design Reference above (adds `--bg-primary-rgb`, `--text-muted`, `--accent-oxblood`, `--accent-alpine`, `--accent-sea`, `--border-strong`, `--shadow-soft`, `--shadow-strong`, `--grain-opacity`, `--glow-tint`; re-tunes surfaces/ink/accents to warm paper).

- [ ] **Step 2: Replace `[data-theme="dark"]` (lines 19–31)**

Replace the entire current `[data-theme="dark"] { … }` block with the **Dark — `[data-theme="dark"]`** block from the Design Reference (charcoal terminal family + the same new token names).

- [ ] **Step 3: Build**

Run: `npm run build` → exit 0, `[build] Complete!`, 5 pages.

- [ ] **Step 4: Visual sanity (expect rough edges — later tasks fix them)**

- Dark: open `/` (Home) — background should be near-black charcoal, text near-white, any accent that was blue is now amber. It will look unfinished (hardcoded olive/slate shadows still present) — that's expected; this task only proves the tokens flow.
- Light: toggle light — background is warm cream, text warm near-black, accents ochre. Again, rough but flowing.

- [ ] **Step 5: Commit**

```bash
git add src/styles.css
git commit -m "feat(theme): re-tune global tokens to two-substrate terminal palette"
```

---

### Task 2: Make `/journey` follow the theme (source `--jb-*` from globals)

Today `body.journey-page` defines a private always-dark palette and remaps the shared chrome to it. Replace that with a mapping from the global tokens, plus a dark-override block for the oddball/device tokens. After this task the journey **page** (background, header, section labels, footer) flips with the toggle; the FlapBoard device is still hardcoded dark (fixed in Task 9) — an intentional, coherent intermediate ("a screen mounted on paper").

**Files:**
- Modify: `src/styles.css:2747-2816` (the `body.journey-page` token block + the shared-chrome remap block)
- Modify: `src/styles.css:2784` (`html:has(body.journey-page)` hardcoded `#15171C`)

- [ ] **Step 1: Replace the `body.journey-page` palette block (lines 2747–2780)**

Replace the current always-dark token definitions (the comment + all `--jb-*` literals through `--jb-amber`, but **keep** the `height/min-height/background-color/background-image/background-repeat/color` declarations) with:

```css
body.journey-page {
  /* The journey page now follows the site theme: its --jb-* palette is sourced
     from the global tokens, so the page is a warm printed timetable in light mode
     and the illuminated charcoal terminal in dark. (Previously these were
     hardcoded to an always-dark device palette.) */
  --jb-paper: var(--bg-primary);
  --jb-paper-rgb: var(--bg-primary-rgb);
  --jb-paper-2: var(--bg-secondary);
  --jb-card: var(--card-bg);
  --jb-ink: var(--text-primary);
  --jb-ink-soft: var(--text-secondary);
  --jb-muted: var(--text-muted);
  --jb-line: var(--border-color);
  --jb-line-2: var(--border-strong);
  --jb-oxblood: var(--accent-oxblood);
  --jb-gold: var(--accent-secondary);
  --jb-alpine: var(--accent-alpine);
  --jb-sea: var(--accent-sea);
  --jb-amber: var(--accent-primary);

  /* Oddballs without a global twin — light values here, dark override below. */
  --jb-line-strong: rgba(41, 37, 30, 0.30);
  --jb-screen-rgb: 41, 37, 30;

  /* FlapBoard device surfaces — "printed manila timetable" (light).
     Dark device values are in the [data-theme="dark"] override below.
     Consumed in Task 9. */
  --fb-face: #EADEC4;
  --fb-flap: #DFD0B2;
  --fb-seam: rgba(41, 37, 30, 0.18);
  --fb-edge: rgba(41, 37, 30, 0.22);
  --fb-sheen: rgba(255, 255, 255, 0.40);
  --fb-ontime: #2E7C58;
  --fb-departed: #8A7F66;
  --fb-flight: #5A5345;
  --fb-region: #8A8068;
  --fb-cols: #8A8068;
  --fb-livedot: #2E7C58;
  --fb-livedot-glow: rgba(46, 124, 88, 0.0);

  /* Grow with content so the screen + grain fill the page. */
  height: auto;
  min-height: 100vh;
  background-color: var(--jb-paper);
  background-image:
    radial-gradient(1200px 620px at 50% -120px, var(--glow-tint), transparent 70%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  background-repeat: no-repeat, repeat;
  color: var(--jb-ink);
}
```

(Note: the radial glow now uses `var(--glow-tint)` so it tints correctly in both themes. The grain `opacity='0.05'` stays inline for now; Task 3 generalizes grain globally but the journey page already has its own, so leave its inline grain as-is.)

- [ ] **Step 2: Add the dark-override block immediately after**

```css
/* Dark substrate: the journey page becomes the illuminated terminal device. */
[data-theme="dark"] body.journey-page {
  --jb-line-strong: #5E6258;
  --jb-screen-rgb: 244, 236, 220;

  --fb-face: #181B22;
  --fb-flap: #242833;
  --fb-seam: rgba(0, 0, 0, 0.50);
  --fb-edge: #2E323C;
  --fb-sheen: rgba(255, 255, 255, 0.06);
  --fb-ontime: #8FCFAE;
  --fb-departed: #9C9684;
  --fb-flight: #C9C2B0;
  --fb-region: #8C8675;
  --fb-cols: #6C7160;
  --fb-livedot: #62B98F;
  --fb-livedot-glow: rgba(98, 185, 143, 0.60);
}
```

- [ ] **Step 3: Fix the root-canvas paint (line 2784)**

Replace:
```css
html:has(body.journey-page) { background-color: #15171C; }
```
with:
```css
/* Paper the root canvas so overscroll never flashes the wrong colour; tracks the
   active theme. (--bg-primary is defined at :root/[data-theme] which is <html>,
   so it cascades here even though --jb-paper is body-scoped.) */
html:has(body.journey-page) { background-color: var(--bg-primary); }
```

- [ ] **Step 4: Resolve the now-redundant shared-chrome remap (lines 2806–2816)**

The block that remaps `--nav-bg`, `--bg-primary`, `--text-primary`, etc. to `--jb-*` values is now circular (jb-* already come from those globals) and unnecessary — the journey page already inherits the global chrome tokens. **Delete the entire `body.journey-page { --nav-bg: …; --bg-primary: …; … }` block (lines 2806–2816)** and its comment (2803–2805). The shared nav/footer will read the global tokens directly, which is what we want.

- [ ] **Step 5: Build** → exit 0, `[build] Complete!`, 5 pages.

- [ ] **Step 6: Visual — `/journey`, both themes**

- Dark: charcoal terminal exactly as before (header amber, ink near-white, ping pulses). The FlapBoard is still its hardcoded dark device — correct for now.
- Light: page background is warm cream, the TerminalHeader (`RIWA HOTEIT INTL`, clock, ticker) renders in warm ink + ochre amber, section labels (`Departures`/`Now Boarding`/`Arrivals`) flip to ink, the footer sits on paper. The FlapBoard is still a dark device sitting on the paper — looks like a mounted screen; acceptable interim. Confirm via `preview_eval` that `getComputedStyle(document.body).backgroundColor` is the cream value in light and charcoal in dark.

- [ ] **Step 7: Commit**

```bash
git add src/styles.css
git commit -m "feat(journey): source --jb-* from global tokens so the page follows the theme"
```

---

### Task 3: Globalize the grain + glow atmosphere (both themes, all pages)

`/journey` has a grain + radial-glow background that gives it depth; the rest of the site is flat. Add the same atmosphere to the global `body` so every page shares it, scaled per-theme via `--grain-opacity` / `--glow-tint` (Task 1 already defined these). The journey page keeps its own stronger treatment (don't double it).

**Files:**
- Modify: `src/styles.css:33-42` (the base `body, html` rule)

- [ ] **Step 1: Add a global atmosphere layer**

After the existing `body, html { … }` rule (lines 33–42), add:

```css
/* Shared atmosphere: a faint top glow + fractal-noise grain on every page, scaled
   per-theme by --glow-tint / --grain-opacity. The journey page paints its own
   (heavier) version, so exclude it here to avoid stacking two grains. */
body:not(.journey-page) {
  background-image:
    radial-gradient(1100px 520px at 50% -140px, var(--glow-tint), transparent 70%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='gn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23gn)' opacity='0.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat, repeat;
  background-attachment: fixed, scroll;
}
```

Note: the SVG's internal `opacity='0.5'` is fixed; the *perceived* grain strength is governed by layering it faintly. To make `--grain-opacity` actually drive strength, instead apply grain via a fixed pseudo-element so we can set its `opacity` from the token:

- [ ] **Step 2: Replace the Step 1 approach with a token-driven grain overlay**

Use the glow on `body` (token-tinted) and a `::before` overlay for grain whose opacity is the token:

```css
body:not(.journey-page) {
  background-image: radial-gradient(1100px 520px at 50% -140px, var(--glow-tint), transparent 70%);
  background-repeat: no-repeat;
  background-attachment: fixed;
}
body:not(.journey-page)::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: var(--grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='gn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23gn)'/%3E%3C/svg%3E");
}
```

(`z-index: 0` + `position: fixed` keeps grain behind content. If any page wrapper creates a stacking context that hides it, raise that wrapper to `position: relative; z-index: 1` in the page's own task — but verify first; most content already paints above a z-0 fixed layer.)

- [ ] **Step 3: Build** → exit 0, 5 pages.

- [ ] **Step 4: Visual — Home, both themes**

- Dark: a barely-there grain texture + faint warm top-glow over the charcoal. Subtle, not noisy.
- Light: same grain at `--grain-opacity: 0.04` over cream — a paper tooth.
- Confirm content (text, cards, nav) sits **above** the grain (not washed out or covered).

- [ ] **Step 5: Commit**

```bash
git add src/styles.css
git commit -m "feat(theme): shared grain + glow atmosphere on all non-journey pages"
```

---

### Task 4: Shared motif kit (utilities + font alignment)

Install the reusable pieces the page tasks will lean on, and align stray monospace fonts to the site mono.

**Files:**
- Modify: `src/styles.css` — add a new "shared motif" block (place it right after the global token blocks, ~line 32, before `body, html`); edit font literals at lines 516, 1126, 1134.

- [ ] **Step 1: Add the motif utilities**

Insert after `[data-theme="dark"] { … }` (after line 31):

```css
/* ===================== SHARED MOTIF KIT ===================== */
/* Terminal microlabel — Spline Sans Mono, wide tracking, muted. The small
   "label above a heading" lifted from the journey board for use site-wide. */
.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.eyebrow-amber { color: var(--accent-primary); }

/* Shared panel surface — bordered, soft-shadowed card on the active substrate. */
.screen-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 4px 20px var(--shadow-soft);
}

/* Universal hover accent: links/icons/cards warm to oxblood/terracotta. */
.hover-oxblood { transition: color 0.25s ease, border-color 0.25s ease; }
.hover-oxblood:hover { color: var(--accent-oxblood); }
```

- [ ] **Step 2: Align the home background "code" font (line 516)**

In `.bg-code` (line 516), change:
```css
font-family: 'Courier New', monospace;
```
to:
```css
font-family: var(--font-mono);
```

- [ ] **Step 3: Align the blog-modal code fonts (lines 1126, 1134)**

At lines 1126 and 1134 (the modal `pre` / `code` blocks), change each:
```css
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```
to:
```css
font-family: var(--font-mono);
```

- [ ] **Step 4: Build** → exit 0, 5 pages. (No visual change yet — utilities are unused until later tasks; the font swaps only affect the home bg-code layer and the blog modal.)

- [ ] **Step 5: Visual — quick check**

- Home (either theme): the faint background "code" rain now renders in Spline Sans Mono (slightly different glyph shapes) — still subtle.
- Projects: open a blog post modal; any `pre`/`code` is in Spline Sans Mono.

- [ ] **Step 6: Commit**

```bash
git add src/styles.css
git commit -m "feat(theme): shared motif utilities + align stray mono fonts to var(--font-mono)"
```

---

### Task 5: Shared chrome — Navbar, Footer, DarkModeToggle

These appear on every page and already consume tokens, so most adapted in Task 1. This task fixes the remaining hardcoded values and adopts oxblood hovers.

**Files:**
- Modify: `src/styles.css` — `.navbar`, `.nav-link-button`, `.nav-link-button.active`, `.wip-badge`, `.footer`, `.social-icon`, `.footer-text`, `.theme-toggle`, `.theme-icon` rules (search by selector).
- Inspect (likely no change): `src/Components/Navbar.jsx`, `Footer.jsx`, `DarkModeToggle.jsx`.

- [ ] **Step 1: Audit chrome selectors for hardcoded colors**

Run: `grep -nE '\.navbar|\.nav-link-button|\.wip-badge|\.footer|\.social-icon|\.footer-text|\.theme-toggle|\.theme-icon' src/styles.css`
For each rule found, replace any hex/rgba literal with the matching token: backgrounds → `--nav-bg`/`--card-bg`/`--bg-secondary`; text → `--text-primary`/`--text-secondary`; borders → `--border-color`/`--border-strong`; hover/active accent → `--accent-primary` (amber) or `--accent-oxblood` (hover).

- [ ] **Step 2: Active nav + hover**

- `.nav-link-button.active` should use `color: var(--accent-primary);` (amber) — confirm it isn't still a blue literal.
- `.nav-link-button:hover` → `color: var(--accent-oxblood);` (add/replace).
- `.social-icon:hover` → `color: var(--accent-oxblood); border-color: var(--accent-oxblood);`

- [ ] **Step 3: `.wip-badge` → terminal chip**

Restyle the "WIP" badge as a small terminal status chip:
```css
.wip-badge {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-primary);
  border: 1px solid var(--border-strong);
  border-radius: 4px;
  padding: 1px 5px;
}
```
(Adjust padding/size to match the existing markup if it wraps an icon; keep it legible.)

- [ ] **Step 4: `.theme-toggle` label/icon**

The toggle shows the text `dark`/`light`. Ensure `.theme-toggle` text uses `var(--font-mono)`, `var(--text-secondary)`, and hovers to `var(--accent-oxblood)`; `.theme-icon` inherits `currentColor`. No JSX change unless the label text needs editing (it doesn't).

- [ ] **Step 5: Build** → exit 0, 5 pages.

- [ ] **Step 6: Visual — any page, both themes**

- Nav bar background is translucent paper (light) / translucent charcoal (dark); active link is amber; hovering a nav link or social icon warms to terracotta/oxblood.
- Footer sits on the substrate with a hairline top border; social icons are bordered and warm on hover.
- The WIP badge reads as a small mono chip, not a colored pill.

- [ ] **Step 7: Commit**

```bash
git add src/styles.css
git commit -m "feat(chrome): tokenize navbar/footer/toggle + oxblood hovers + terminal WIP chip"
```

---

### Task 6: Home / About

The landing hero + about section. Mostly inherits Task 1, but has the bright-blue accents, a code-rain background, and headings to bring into the terminal language.

**Files:**
- Modify: `src/styles.css` — `.landing-hero`, `.hero-background`, `.bg-code*`, `.hero-title`, `.riwa-name`, `.typing-cursor`, `.roles-dropdown`, `.scroll-indicator`, `.about-content`, `.about-two-column`, `.about-photo`, `.profile-photo`, `.section-title` (search by selector; ~lines 500–840).
- Inspect (edit only if an inline color/font is hardcoded in markup): `src/Components/About.jsx`.

- [ ] **Step 1: Sweep hero/about selectors for literals**

Run: `grep -nE '\.landing-hero|\.hero-|\.bg-code|\.riwa-name|\.typing-cursor|\.roles-dropdown|\.scroll-indicator|\.about-|\.profile-photo|\.section-title' src/styles.css`
Replace literal colors with tokens (text→`--text-primary/secondary/muted`, accent→`--accent-primary`, surfaces→`--card-bg`/`--bg-secondary`, borders→`--border-color`).

- [ ] **Step 2: Accent hotspots → amber, not blue**

- `.typing-cursor` (the blinking caret): `background: var(--accent-primary);` (was blue).
- `.scroll-indicator`: arrow/line `color`/`border-color: var(--accent-primary);` or `--text-muted` if it should be quiet.
- Any `.roles-dropdown` highlight / hover: `--accent-primary` for selected, `--accent-oxblood` for hover.
- `.riwa-name` underline/accent if present: `--accent-primary`.

- [ ] **Step 3: Adopt the eyebrow on the about section label**

If About has a small kicker/label above the section title, give it `class="eyebrow"` (JSX, About.jsx) or apply the `.eyebrow` declarations to `.section-title`'s preceding label. Keep `.section-title` itself in Fraunces (it already inherits `--font-sans`); confirm it uses `var(--text-primary)`.

- [ ] **Step 4: `.bg-code` color**

The code-rain layer should be a very low-contrast `var(--text-muted)` at low opacity so it reads as texture in both themes (not bright blue). Set its `color: var(--text-muted);` and keep opacity low (≤ 0.12).

- [ ] **Step 5: Build** → exit 0, 5 pages.

- [ ] **Step 6: Visual — Home, both themes**

- Dark: charcoal hero, near-white headline (Fraunces), amber caret + accents, faint mono code-rain, grain/glow present. Reads like the terminal's "home gate."
- Light: warm paper, warm-ink headline, ochre caret/accents, paper grain. No bright blue anywhere. Scroll to the About block: photo framed cleanly, body text warm-ink, the section label is a mono eyebrow.

- [ ] **Step 7: Commit**

```bash
git add src/styles.css src/Components/About.jsx
git commit -m "feat(home): terminal-language hero + about (amber accents, mono eyebrow, no blue)"
```

(If About.jsx wasn't edited, drop it from the `git add`.)

---

### Task 7: Projects / Blog

The `/projects` page (blog 301→projects) with project cards, blog cards, tech tags, and the blog modal. This holds most of the orphaned olive shadows and the leaked blue — but those are cleanup (Task 10); here we bring the **palette + surfaces** into line.

**Files:**
- Modify: `src/styles.css` — `.professional-experience-compact`, `.work-columns-container`, `.projects-column`, `.blog-column`, `.project-card-compact`, `.tech-tag-compact`, `.blog-post-card-compact`, `.post-tag-compact`, `.blog-modal-overlay`, `.blog-modal` (search by selector; ~lines 840–1620).
- Inspect: `src/Components/ProjectsAndBlog.jsx` (edit only for inline styles / to add `.eyebrow`).

- [ ] **Step 1: Sweep projects/blog selectors for literals**

Run: `grep -nE '\.professional-experience|\.work-columns|\.projects-column|\.blog-column|\.project-card|\.tech-tag|\.blog-post-card|\.post-tag|\.blog-modal' src/styles.css`
Replace literal text/border/background colors with tokens. Cards → `.screen-card` values (or add `class="screen-card"` in JSX and strip the per-card bg/border/shadow). **Leave `.blog-card--mistral`'s brand gradient.**

- [ ] **Step 2: Cards adopt the shared surface**

For `.project-card-compact` and `.blog-post-card-compact`: `background: var(--card-bg); border: 1px solid var(--border-color); box-shadow: 0 4px 20px var(--shadow-soft);` and on hover lift the shadow to `var(--shadow-strong)` and the border/title to `var(--accent-oxblood)`. (This also retires the olive shadows at these selectors — Task 10 mops up any remaining strays.)

- [ ] **Step 3: Tags → mono chips**

`.tech-tag-compact` and `.post-tag-compact`: `font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-secondary); border: 1px solid var(--border-color); background: var(--bg-secondary); border-radius: 4px;` — small terminal chips. Keep padding close to current so layout doesn't jump.

- [ ] **Step 4: Section labels → eyebrow**

The "Projects" / "Writing" column headers: apply `.eyebrow` (or `.eyebrow` declarations) so they match the journey board's section labels. Keep the big page heading in Fraunces.

- [ ] **Step 5: Blog modal**

`.blog-modal-overlay`: `background: rgba(var(--bg-primary-rgb), 0.7);` (token-tinted scrim, both themes). `.blog-modal`: `.screen-card` surface (`--card-bg`, `--border-color`, `--shadow-strong`). Body copy `--text-primary`; metadata `--text-secondary`; code blocks already mono (Task 4).

- [ ] **Step 6: Build** → exit 0, 5 pages.

- [ ] **Step 7: Visual — Projects, both themes**

- Dark: cards are charcoal panels with hairline borders; tags are mono chips; titles warm to oxblood on hover; no olive glow, no blue. Open a post → modal is a clean dark panel with a token scrim.
- Light: cards are cream panels on paper; same hover behavior; modal scrim is a warm translucent paper. The Mistral card keeps its branded gradient (intentional).

- [ ] **Step 8: Commit**

```bash
git add src/styles.css src/Components/ProjectsAndBlog.jsx
git commit -m "feat(projects): terminal cards + mono tag chips + tokenized modal"
```

(Drop ProjectsAndBlog.jsx from `git add` if untouched.)

---

### Task 8: House — UI chrome only (leave the 3D scene)

The `/house` 3D walkthrough. The R3F scene is untouched; only the 2D UI chrome around it (navbar, popups, nav buttons, loader, exit modal, scroll hint) gets the terminal language.

**Files:**
- Modify: `src/styles.css` — `.container`, `.house-navbar`, `.popup`, `.popup.hidden`, `.navigation-buttons`, `.pc-back-btn`, `.scroll-hint`, `.house-experience-exit-modal*`, `.loading-container`, `.loading-start-button`, `.loader` (search by selector; ~lines 2400–2520 and elsewhere).
- Inspect: `src/Components/House.jsx` (line ~167 sets `body.house-page` imperatively — leave), `src/Components/WalkthroughUI.jsx`.

- [ ] **Step 1: Sweep house-chrome selectors for literals**

Run: `grep -nE '\.house-navbar|\.popup|\.navigation-buttons|\.pc-back-btn|\.scroll-hint|\.house-experience-exit-modal|\.loading-container|\.loading-start-button|\.loader' src/styles.css`
Replace literals with tokens. The two `box-shadow: … rgba(47,72,88,0.15)` at ~2423 and ~2509 become `… var(--shadow-strong)` (these are house-chrome shadows leaking the old slate — fix here).

- [ ] **Step 2: Controls + overlays**

- `.pc-back-btn`, `.navigation-buttons` buttons, `.loading-start-button`: `.screen-card`-style surface (`--card-bg`, `--border-color`), text `--text-primary`, hover border/text `--accent-oxblood`; primary "start" can use `--accent-primary` text or border to read as the lead action.
- `.popup`, `.house-experience-exit-modal`: `.screen-card` panels; any backdrop → `rgba(var(--bg-primary-rgb), 0.7)`.
- `.scroll-hint`: `color: var(--text-muted); font-family: var(--font-mono);` (a quiet mono hint).
- `.loader`: if it's a colored spinner, use `--accent-primary` for the active arc and `--border-color` for the track.

- [ ] **Step 3: Build** → exit 0, 5 pages.

- [ ] **Step 4: Visual — House, both themes**

- The 3D scene itself is unchanged (its lights are JS literals — correct). The **chrome** (back button, nav buttons, popups, loader, exit modal, scroll hint) now matches: paper/charcoal panels, mono hints, amber/oxblood accents. Confirm the loading screen and the exit-confirm modal both read on-brand.
- `body.house-page` still hides overflow (no scroll) — confirm the page didn't gain a scrollbar.

- [ ] **Step 5: Commit**

```bash
git add src/styles.css src/Components/WalkthroughUI.jsx
git commit -m "feat(house): terminal-language UI chrome (3D scene untouched)"
```

(Drop WalkthroughUI.jsx if untouched.)

---

### Task 9: Journey FlapBoard → theme-responsive "printed timetable"

Make the split-flap board (Departures + Arrivals) and its header device-colors consume the `--fb-*` tokens from Task 2, so the board becomes a warm manila timetable in light mode and the charcoal screen in dark. This completes the "paper board" the user asked for.

**Files:**
- Modify: `src/styles.css:2911-3033` (the DEPARTURES BOARD comment + `.fb-*` rules). Header `.th-*` (2837–2895) already tokenized — no change.

- [ ] **Step 1: Update the device intent comment (lines 2911–2913)**

Replace:
```css
/* A dark airport "screen" object — kept theme-independent so it reads the same
   on the light paper and the dark charcoal; the page chrome around it switches. */
```
with:
```css
/* The split-flap board is a physical device that switches substrate with the
   theme: a warm printed manila timetable on paper (light), an illuminated screen
   on charcoal (dark). Surfaces come from the --fb-* tokens (see body.journey-page). */
```

- [ ] **Step 2: `.fb-board` (lines 2914–2927) → tokens**

Replace the device-color declarations:
```css
.fb-board {
  --d-line: var(--fb-edge);
  --d-amber: var(--jb-amber);
  --d-ink: #1A1410; /* near-black ink for the amber "boarding" chip — works on both */
  margin: 2px 0 clamp(34px, 6vw, 60px);
  border-radius: 9px; overflow: hidden; color: rgb(var(--jb-screen-rgb));
  background: linear-gradient(180deg, var(--fb-sheen), transparent 130px), var(--fb-face);
  border: 1px solid var(--d-line);
  box-shadow: 0 28px 54px -34px var(--shadow-strong), inset 0 1px 0 rgba(var(--jb-screen-rgb), 0.06);
  padding: clamp(15px, 2.3vw, 22px) clamp(15px, 2.6vw, 26px) clamp(11px, 1.8vw, 16px);
}
```

- [ ] **Step 3: Board sub-elements → tokens**

- `.fb-live` (2936–2940): `color: var(--jb-ink-soft);` (was `#8C9A8E`).
- `.fb-live-dot` (2941–2944): `background: var(--fb-livedot); box-shadow: 0 0 8px 1px var(--fb-livedot-glow);`
- `.fb-clock` (2945–2948): already `rgb(var(--jb-screen-rgb))` — no change.
- `.fb-cols` (2956–2959): `color: var(--fb-cols);` (was `#6C7160`).
- `.fb-row + .fb-row` (2965): `border-top: 1px solid rgba(var(--jb-screen-rgb), 0.07);` — no change (flips with screen-rgb).
- `.fb-row:hover` (2966): `background: rgba(var(--jb-screen-rgb), 0.05);` — no change.
- `.fb-flap` (2969–2975): `background: var(--fb-flap);` (was `#242833`).
- `.fb-flap::after` (2976–2979): `background: var(--fb-seam);` (was `rgba(0,0,0,0.5)`).
- `.fb-region` (2993–2996): `color: var(--fb-region);` (was `#8C8675`).
- `.fb-flight` (2997): `color: var(--fb-flight);` (was `#C9C2B0`).

- [ ] **Step 4: Status variants → tokens**

- `.fb-status-boarding` (3001): `color: var(--d-ink); background: var(--d-amber);` — no change (chip stays amber + near-black; legible on both).
- `.fb-status-ontime` (3006): `color: var(--fb-ontime);` (was `#8FCFAE`).
- `.fb-status-departed` (3007): `color: var(--fb-departed);` (was `#9C9684`).
- `.fb-status-arrived` (3015): `color: var(--fb-ontime);` (was `#8FCFAE`).
- `.fb-status-home` (3016) / `.fb-status-live` (3017): `var(--d-amber)` — no change.
- `.fb-divider` (3009–3013): `color: var(--fb-cols);` (was `#6C7160`).
- `.fb-row-live` (3014): `background: var(--glow-tint);` (was `rgba(232,178,58,0.06)` — token keeps a faint warm highlight on both substrates).
- `.fb-live-ping` (3018–3022) and `.fb-glyph` (2990–2992): already token/`--ping` driven — no change (glyph uses `--jb-alpine`/`--jb-sea`, which now flip).

- [ ] **Step 5: Build** → exit 0, 5 pages.

- [ ] **Step 6: Visual — `/journey`, both themes (the payoff)**

- Dark: pixel-identical to today's terminal — verify nothing regressed (board charcoal `#181B22`, flaps `#242833`, mint on-time, amber boarding chip, green live dot with glow). Use `preview_eval` on `.fb-board` computed `background-color` to confirm it resolves to the dark face.
- Light: the board is now a **warm manila timetable** — cream face, slightly darker flap tiles with a faint warm seam, dark-ink rows, ink-green "arrived/on-time", ochre "boarding" chip, terracotta hovers, the ▲/≈ glyphs in ink-green/ink-teal. The flip animation + seam read as a physical board. Confirm the Departures board, the Now-Boarding spreads, and the Arrivals ledger all read cleanly on paper (scroll-capture trick for Arrivals if needed).

- [ ] **Step 7: Commit**

```bash
git add src/styles.css
git commit -m "feat(journey): FlapBoard becomes a theme-responsive printed timetable"
```

---

### Task 10: Cleanup — orphans, dead rules, leaked literals

Remove/retint the stragglers that don't flow through tokens. **Line numbers below are from the pre-restyle file and will have shifted — match by selector + value.**

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Orphan `.header` rule (was lines 58–70)**

Check whether anything renders `class="header"`:
Run: `grep -rnE 'className=["'\'']header["'\'']|class=["'\'']header["'\'']' src/`
- If **no** match: delete the `.header { … }` and `.header h1 { … }` rules entirely (it carries an off-brand `#00c49a` teal).
- If matched: retint `color: #00c49a;` → `color: var(--accent-primary);` and `font-family` → `var(--font-sans)`.

- [ ] **Step 2: Dead `body.page-view` / `html.page-view` (was lines 255–256)**

`grep -rn "page-view" src/` — confirm the class is never set in JSX. If unused, delete the rule block.

- [ ] **Step 3: Orphan olive shadows (×10)**

Find: `grep -n "175, *201, *126" src/styles.css` (was lines 843, 871, 907, 933, 940, 995, 1476, 1504, 1511, 1602). Replace each `rgba(175, 201, 126, 0.1)` → `var(--shadow-soft)` and each `rgba(175, 201, 126, 0.15)` → `var(--shadow-strong)`, preserving the surrounding `box-shadow` offsets/blur. (Most are on cards already restyled in Tasks 6–7; this catches any not covered.)

- [ ] **Step 4: Leaked slate + blue shadow literals**

- `rgba(47, 72, 88, 0.05)` (was line 283) → `var(--shadow-soft)`.
- `rgba(45, 106, 246, 0.2)` (was line 1166, the old blue) → `var(--shadow-soft)` (or `0 2px 8px var(--shadow-soft)` keeping offsets).
- (The two `rgba(47,72,88,0.15)` at ~2423/2509 were handled in Task 8 — verify they're gone: `grep -n "47, *72, *88" src/styles.css` should return only nothing, since the `:root`/nav definitions at old lines 16/28 were replaced in Task 1.)

- [ ] **Step 5: `.project-image` placeholder bg (was line 1518)**

`background-color: #f0f0f0;` → `background-color: var(--bg-secondary);` so empty/loading project thumbnails sit on the substrate, not a flat grey.

- [ ] **Step 6: Final literal sweep**

Run: `grep -nE '#[0-9a-fA-F]{6}|rgba?\(' src/styles.css | grep -viE 'var\(|--|#FFD800|#FF8205|#FA500F|#E10500|0x'`
Review each remaining literal. Legitimate keepers: the Mistral brand gradient, the SVG-grain data-URIs, `--d-ink #1A1410` (chip ink), the `transparent`/`#000`/`#fff` used inside gradients/masks. Anything else that's a UI color → convert to the nearest token. Note any deliberate keepers in a one-line comment.

- [ ] **Step 7: Build** → exit 0, 5 pages.

- [ ] **Step 8: Visual — spot-check every route, both themes**

Quickly toggle through `/`, `/projects`, `/house`, `/journey` in both themes; confirm no stray teal/blue/olive remains and nothing lost its surface.

- [ ] **Step 9: Commit**

```bash
git add src/styles.css
git commit -m "chore(theme): remove orphan rules + convert leaked color literals to tokens"
```

---

### Task 11: Cross-page verification + PR

Final pass across the whole site.

- [ ] **Step 1: Full build**

Run: `npm run build` → exit 0, `[build] Complete!`, **5 pages**. (Ignore the chunk-size warning.)

- [ ] **Step 2: Both-theme walkthrough**

For each route — `/` (Home/About), `/projects`, `/house`, `/journey` — toggle dark↔light and confirm:
- No bright web-blue `#2D6AF6` anywhere; amber is the lead accent.
- Light text is warm ink (not cool slate); dark text is the screen near-white.
- Cards/panels share the `.screen-card` surface; hovers warm to oxblood.
- Mono microlabels (eyebrows, tags, chips, hints) are Spline Sans Mono.
- Grain + glow present and subtle on every page.

- [ ] **Step 3: Mobile**

Resize preview to ~390×844; check Home hero, Projects card stacking, the Navbar mobile menu, and `/journey` (`.fb-row` collapses to 3 columns at ≤720px). No overflow, labels legible.

- [ ] **Step 4: Reduced motion**

In the preview, emulate `prefers-reduced-motion: reduce` (`preview_eval` to set it, or DevTools rendering emulation). Confirm the flap flip, blinking colon/dots, ticker, and ping animations are stilled (the `@media (prefers-reduced-motion: reduce)` blocks at ~3030 and ~3185 already cover the journey ones; verify the new grain `::before` and any hero animation also respect it — add to those media blocks if needed).

- [ ] **Step 5: Theme persistence**

Toggle dark, reload — theme persists (localStorage `'theme'`). Toggle through routes — theme holds. No flash of the wrong substrate on `/journey`.

- [ ] **Step 6: Open the PR (do not merge; never push to master)**

```bash
git push -u origin feat/site-restyle-terminal
gh pr create --title "Site-wide terminal restyle — one world, two substrates" --body "$(cat <<'EOF'
## Summary
- Re-tuned global tokens into two coherent substrates: dark = illuminated terminal screen, light = warm printed-paper timetable.
- Made /journey theme-responsive (warm paper board in light, charcoal terminal in dark) by sourcing --jb-* from the globals.
- Brought Home/About, Projects/Blog, and House chrome into the same language (amber lead accent, mono microlabels, screen-card surfaces, oxblood hovers, shared grain/glow); dropped the bright web-blue.
- Cleanup: removed orphan/dead rules and converted leaked color literals to tokens.

## Test plan
- [ ] `npm run build` green (5 pages)
- [ ] Both themes verified on /, /projects, /house, /journey
- [ ] Mobile + reduced-motion verified
- [ ] Theme persists across reload + navigation
EOF
)"
```

- [ ] **Step 7: Finish the branch**

Use **superpowers:finishing-a-development-branch** to wrap up (it will re-verify and present merge/keep options). Per the standing rule, the human merges — do not merge or force-push.

---

## Self-Review Notes (author)

- **Spec coverage:** every locked decision is mapped — re-tune both themes (Task 1), warm paper + warm ink light (Task 1), journey light paper board (Tasks 2 + 9), shared-language-but-page-appropriate motif (Task 4 + page tasks), House chrome restyled / 3D left alone (Task 8). Drop-blue + warm-ink moves are explicit in Tasks 1/5/6/7.
- **Type/name consistency:** token names are identical across Task 1 (definition) and Tasks 2–10 (consumption): `--bg-primary[-rgb]`, `--bg-secondary`, `--bg-accent`, `--card-bg`, `--text-primary/secondary/muted`, `--accent-primary/secondary/oxblood/alpine/sea`, `--nav-bg`, `--border-color/strong`, `--shadow-soft/strong`, `--grain-opacity`, `--glow-tint`; journey device tokens `--fb-face/flap/seam/edge/sheen/ontime/departed/flight/region/cols/livedot/livedot-glow` defined in Task 2, consumed in Task 9.
- **Ordering:** tokens → journey page refactor → shared atmosphere → motif kit → chrome → pages → board → cleanup → verify. Each task leaves a buildable, viewable site; intermediate states (e.g. dark board on light paper after Task 2) are coherent on purpose.
- **No placeholders:** every CSS step gives concrete values or an exact selector+token mapping; line numbers are paired with selector/value so they survive earlier edits.
