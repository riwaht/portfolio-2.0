# Site Elevation — Shared Terminal Masthead Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. NOTE: this is iterative frontend-design work — the author is executing it **inline** with live-preview verification in BOTH themes after every task ("see it as we build it"), not via subagents.

**Goal:** Bring the Work and Home pages up to the Journeys page's visual gravity by sharing Journeys' signature *masthead instrument* — a live system line, a commanding Fraunces display headline, and a stats strip — without copying the airport-specific mechanics (split-flap boards, scrolling ticker, IATA/boarding) that should stay unique to Journeys.

**Architecture:** Add one reusable, theme-aware React component `PageMasthead.jsx` that renders a mono system line (with a live ticking `Clock`, reused from `Journey/Clock.jsx`), an eyebrow, a Fraunces display title + accent dot, and a stats strip with an optional live "now" pip. Style it with new `.pm-*` rules that use the **global** design tokens (so it renders correctly in both the dark "terminal screen" and light "printed paper" substrates). Mount it on `/work` (replacing the thin meta header) and `/` (a slim system line in the hero + an elevated About masthead). Journeys is left untouched.

**Tech Stack:** Astro 6 + React 18 (`client:only` islands), vanilla CSS in `src/styles.css`, global CSS custom-property tokens.

**Design principle (the line we do NOT cross):** Share the *language* (system line, live clock, big display headline, stats strip, mono eyebrows, grain/glow already global). Do NOT propagate the *airport mechanics* (`FlapBoard` split-flap, `.th-ticker` LED marquee, IATA codes, "Now Boarding"). Those keep Journeys special.

**Gate per task:** `npm run build` exits 0, ends `[build] Complete!`, builds **5 pages** (`/`, `/blog`, `/house`, `/journey`, `/projects`). The `(!) Some chunks are larger than 500 kB` warning is expected — ignore it. Plus a live-preview visual check in BOTH themes (dark + light) before committing.

---

## File Structure

- **Create** `src/Components/PageMasthead.jsx` — the shared masthead instrument. One responsibility: render a page's terminal masthead (system line + eyebrow + display title + stats). Reuses `Journey/Clock.jsx` for the live clock (DRY — do not duplicate the clock).
- **Modify** `src/styles.css` — add the `.pm-*` rule block (global-token-based), plus one entry in the existing reduced-motion block to freeze the live pip.
- **Modify** `src/Components/ProjectsAndBlog.jsx` — replace the `professional-experience-compact` header with `<PageMasthead>`; keep the resume/contact links beneath it.
- **Modify** `src/Components/About.jsx` — add a slim system line into the landing hero, and elevate the About-section header (`whoami` / `about me`) into a `<PageMasthead>` moment.

Token mapping (journey `--jb-*` → global) used throughout `.pm-*`:
`--jb-amber`→`--accent-primary`, `--jb-ink`→`--text-primary`, `--jb-ink-soft`→`--text-secondary`, `--jb-muted`→`--text-muted`, `--jb-line`→`--border-color`, `--jb-line-strong`→`--border-strong`, `--jb-alpine`→`--accent-alpine`.

---

## Task 1: Shared `PageMasthead` component + `.pm-*` styles

**Files:**
- Create: `src/Components/PageMasthead.jsx`
- Modify: `src/styles.css` (append `.pm-*` block near the other shared chrome; add reduced-motion entry)

- [ ] **Step 1: Create the component**

`src/Components/PageMasthead.jsx`:
```jsx
import Clock from './Journey/Clock';
import { pad2 } from '../Utils/ui';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * A theme-aware terminal masthead shared by the non-journey pages: a mono system
 * line (RIWA HOTEIT · SECTION + live clock/date), an eyebrow, a Fraunces display
 * title with an accent dot, and a stats strip with an optional live "now" pip.
 * Mirrors the journey TerminalHeader's language using GLOBAL tokens so it follows
 * both substrates. Deliberately omits the airport-only ticker / split-flap.
 *
 * @param {string} section  right-hand system id, e.g. "WORKLOG" (uppercased)
 * @param {string} eyebrow  small mono kicker above the title
 * @param {string} title    Fraunces display word (a trailing "." dot is added)
 * @param {Array<{value:string,label:string}>} stats  stat cells
 * @param {string} [live]   optional live-pip label, e.g. "Now at Mistral"
 * @param {boolean} [compact] slim variant (system line only, no title/stats)
 */
function PageMasthead({ section, eyebrow, title, stats = [], live, compact = false }) {
  const now = new Date();
  const dateStr = `${DAYS[now.getDay()]} ${pad2(now.getDate())} ${MONS[now.getMonth()]}`;
  return (
    <header className={`pm${compact ? ' pm-compact' : ''}`}>
      <div className="pm-id">
        <span className="pm-code">RIWA HOTEIT <span className="pm-sys">· {section}</span></span>
        <span className="pm-now">
          <Clock seconds className="pm-clock" />
          <span className="pm-date">{dateStr}</span>
        </span>
      </div>

      {!compact && (
        <>
          {eyebrow && <div className="pm-eyebrow">{eyebrow}</div>}
          {title && <h1 className="pm-h1">{title}<span className="pm-dot">.</span></h1>}
          {(stats.length > 0 || live) && (
            <div className="pm-stats">
              {stats.map((s, i) => (
                <span key={s.label}>
                  {s.value && <b>{s.value}</b>} {s.label}
                  {i < stats.length - 1 && <span className="pm-sep" aria-hidden="true" />}
                </span>
              ))}
              {live && (
                <span className="pm-live-wrap"><span className="pm-live" aria-hidden="true" /> {live}</span>
              )}
            </div>
          )}
        </>
      )}
    </header>
  );
}

export default PageMasthead;
```

- [ ] **Step 2: Add `.pm-*` styles to `src/styles.css`**

Append (adapted from `.th-*` at lines ~2948-3005, but using global tokens). Starting values — tune live:
```css
/* =================== SHARED PAGE MASTHEAD (.pm-*) ===================
   Journeys' masthead language for the non-journey pages, on global tokens so it
   follows both substrates. No ticker / split-flap — those stay unique to /journey. */
.pm { width: min(1180px, 92vw); margin: 0 auto; padding: clamp(24px, 4vw, 44px) 0 clamp(16px, 2.5vw, 28px); position: relative; z-index: 1; }
.pm-id {
  display: flex; align-items: center; justify-content: space-between; gap: 12px 20px;
  flex-wrap: wrap; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);
  font-family: var(--font-mono);
}
.pm-code { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.34em; text-transform: uppercase; color: var(--accent-primary); }
.pm-sys { color: var(--text-secondary); }
.pm-now { display: inline-flex; align-items: center; gap: 14px; }
.pm-clock { font-family: var(--font-mono); font-weight: 600; font-size: 0.92rem; letter-spacing: 0.1em; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.pm-date { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); }
.pm-eyebrow { margin: clamp(24px, 3.5vw, 38px) 0 16px; font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.42em; text-transform: uppercase; color: var(--accent-primary); }
.pm-h1 {
  font-size: clamp(3.4rem, 11vw, 9rem); line-height: 0.84; margin: 0;
  font-style: italic; font-weight: 360; font-variation-settings: 'opsz' 144;
  letter-spacing: -0.025em; color: var(--text-primary);
}
.pm-h1 .pm-dot { color: var(--accent-primary); }
.pm-stats {
  margin-top: clamp(24px, 3.5vw, 40px);
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px 26px;
  padding-top: 18px; border-top: 1px solid var(--border-strong);
  font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-secondary);
}
.pm-stats span { display: inline-flex; align-items: center; gap: 10px 26px; }
.pm-stats .pm-sep { width: 3px; height: 3px; border-radius: 50%; background: var(--border-strong); }
.pm-stats b { color: var(--text-primary); font-weight: 600; }
.pm-live-wrap { margin-left: auto; display: inline-flex; align-items: center; gap: 9px; color: var(--text-primary); }
.pm-live {
  --ping: 46, 124, 88;
  width: 7px; height: 7px; border-radius: 50%; background: var(--accent-alpine);
  box-shadow: 0 0 0 0 rgba(var(--ping), 0.45); animation: jbPing 2.4s ease-out infinite;
}
.pm-compact { padding-top: 0; padding-bottom: 0; }
.pm-compact .pm-id { border-bottom: none; padding-bottom: 0; }
```

Add to the existing reduced-motion block (the one containing `.th-live`, ~line 3289) so the pip freezes:
```css
  .th-live, .jb-fstatus-dot, .pm-live { animation: none; }
```

- [ ] **Step 3: Build to verify nothing breaks**

Run: `npm run build`
Expected: exit 0, `[build] Complete!`, 5 pages. (Component is not yet mounted, so no visual change — this confirms the CSS parses and the new file compiles when imported in Task 2.)

- [ ] **Step 4: Commit**

```bash
git add src/Components/PageMasthead.jsx src/styles.css
git commit -m "feat(masthead): shared theme-aware PageMasthead (live system line + display title + stats)"
```

---

## Task 2: Mount the masthead on the Work page

**Files:**
- Modify: `src/Components/ProjectsAndBlog.jsx` (import + replace `professional-experience-compact` header, ~lines 1-4 and 255-263)

- [ ] **Step 1: Import the component**

At the top of `src/Components/ProjectsAndBlog.jsx`, add after the `Footer` import:
```jsx
import PageMasthead from './PageMasthead';
```

- [ ] **Step 2: Replace the thin header with the masthead**

Replace the `professional-experience-compact` block (currently lines ~255-263) with:
```jsx
            {/* Worklog masthead */}
            <PageMasthead
                section="WORKLOG"
                eyebrow="What I've shipped"
                title="Work"
                stats={[
                    { value: pad2(projects.length), label: 'Projects' },
                    { value: pad2(blogPosts.length), label: 'Writeups' },
                ]}
                live="Now at Mistral"
            />
            <div className="professional-experience-compact">
                <p>software engineer at mistral • former swe intern at snowflake • coding instructor</p>
                <div className="experience-links">
                    <a href="/PC Documents/Riwa Hoteit, CV.pdf" target="_blank" rel="noopener noreferrer">resume</a>
                    <span>•</span>
                    <a href="mailto:riwa.hoteit@gmail.com">contact</a>
                </div>
            </div>
```

Add the `pad2` import at the top (after the React import):
```jsx
import { pad2 } from '../Utils/ui';
```

- [ ] **Step 3: Verify in the live preview, BOTH themes**

Dev server: `preview_start` name `dev`. Navigate to `/projects/`. For each theme (`localStorage.theme = 'dark'` then `'light'`, reload):
- The masthead renders: system line `RIWA HOTEIT · WORKLOG` + ticking clock + date; eyebrow "WHAT I'VE SHIPPED"; big Fraunces "Work."; stats `07 PROJECTS · 04 WRITEUPS · ● NOW AT MISTRAL`.
- Colors follow the theme (amber accent + ink on cream in light; amber + off-white on charcoal in dark).
- The two columns still render below.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exit 0, 5 pages, `[build] Complete!`

- [ ] **Step 5: Commit**

```bash
git add src/Components/ProjectsAndBlog.jsx
git commit -m "feat(work): commanding masthead (Work. + live system line + project/writeup stats)"
```

---

## Task 3: Elevate the Home page

**Files:**
- Modify: `src/Components/About.jsx` (import + hero system line ~line 286, About-section header ~lines 435-441)

- [ ] **Step 1: Import the component**

After the `Footer` import in `src/Components/About.jsx`:
```jsx
import PageMasthead from './PageMasthead';
```

- [ ] **Step 2: Add a slim live system line into the hero**

Immediately inside `<div className="landing-hero">` (before `<div className="hero-background" ...>`), add the compact masthead so a live clock sits at the top of the hero:
```jsx
                <PageMasthead section="PARIS" compact />
```
(Compact variant = system line only: `RIWA HOTEIT · PARIS` + live clock + date. No title/stats — the typing hero stays the star.)

- [ ] **Step 3: Elevate the About-section header**

Replace the `about-intro` block (currently lines ~436-441):
```jsx
                <div className="about-intro">
                    <div className="eyebrow">whoami</div>
                    <div className="section-title">
                        about me
                    </div>
                </div>
```
with a full masthead moment:
```jsx
                <PageMasthead
                    section="PROFILE"
                    eyebrow="whoami"
                    title="About"
                    stats={[
                        { value: '', label: 'Lebanese–Canadian' },
                        { value: '', label: 'Based in Paris' },
                    ]}
                    live="SWE @ Mistral"
                />
```

- [ ] **Step 4: Verify in the live preview, BOTH themes**

Navigate to `/`. For each theme:
- Hero shows the slim system line (`RIWA HOTEIT · PARIS` + ticking clock) above the code-rain, and the typing animation ("hi, i'm Riwa.") still runs and is unobstructed.
- Scrolling to the About section shows the elevated masthead: eyebrow "whoami", big Fraunces "About.", system line `RIWA HOTEIT · PROFILE` + clock, stats `LEBANESE–CANADIAN · BASED IN PARIS · ● SWE @ MISTRAL`.
- The photo + text two-column block still renders below.
- Both themes correct.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: exit 0, 5 pages, `[build] Complete!`

- [ ] **Step 6: Commit**

```bash
git add src/Components/About.jsx
git commit -m "feat(home): live system line in hero + elevated About masthead"
```

---

## Task 4: Responsive, reduced-motion, and cross-page polish

**Files:**
- Modify: `src/styles.css` (responsive `.pm-*` tweaks under existing mobile breakpoints; verify reduced-motion)

- [ ] **Step 1: Mobile check + tighten**

In the live preview at 390px width (`preview_resize`), load `/projects/` and `/` in both themes. Confirm: the `.pm-id` wraps cleanly (system line above clock), `.pm-h1` does not overflow, `.pm-stats` wrap without clipping, and the hero system line does not crowd the nav. If anything clips, add inside the existing `@media (max-width: 640px)` block:
```css
  .pm-h1 { font-size: clamp(3rem, 16vw, 5rem); }
  .pm-id { gap: 6px 14px; }
  .pm-stats { gap: 8px 16px; }
  .pm-live-wrap { margin-left: 0; }
```

- [ ] **Step 2: Reduced-motion check**

In the preview, emulate `prefers-reduced-motion: reduce`. Confirm `.pm-live` pip is static (no ping) and the `Clock` still ticks (a clock is information, not decoration — acceptable). The reduced-motion rule added in Task 1 Step 2 covers `.pm-live`.

- [ ] **Step 3: Final cross-page build + visual sweep**

Run: `npm run build`
Expected: exit 0, 5 pages, `[build] Complete!`
Then in the preview, sweep `/`, `/projects/`, `/journey/`, `/house/` in both themes and confirm: Journeys is unchanged, the other pages now carry the shared masthead, and nothing regressed.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css
git commit -m "polish(masthead): responsive + reduced-motion across pages"
```

---

## Self-Review

**1. Spec coverage:**
- Live element on other pages → `Clock` in `PageMasthead` (Tasks 1-3). ✓
- Commanding display headline → `.pm-h1` "Work." / "About." (Tasks 2-3). ✓
- Stats strip → `.pm-stats` with live pip (Tasks 2-3). ✓
- Bold ambition → full mastheads on Work + Home, live clocks + stats. ✓
- Journeys stays special → no ticker/split-flap shared; `PageMasthead` deliberately omits them; `/journey` files untouched. ✓
- Both substrates → `.pm-*` uses only global tokens. ✓ (verified live each task)

**2. Placeholder scan:** No TBD/TODO. Stat values are real (`projects.length`=7, `blogPosts.length`=4) or intentionally empty `value:''` (label-only cells render without a bold number — handled by `{s.value && <b>...}`). ✓

**3. Type consistency:** `PageMasthead` prop names (`section`, `eyebrow`, `title`, `stats`, `live`, `compact`) are identical across Tasks 1-3. `stats` is always `Array<{value,label}>`. `Clock` is imported from `./Journey/Clock` (Task 1) — the real path. `pad2` from `../Utils/ui` exists. ✓

---

## Execution

This is iterative frontend design — executing **inline** in-session with live-preview verification in both themes after every task (per the user's "see it as we build it" preference), committing per task. Not merging; the human merges the PR.
