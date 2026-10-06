# Passport-stamp favicon and Arrivals boarding pass

Two independent changes. The favicon ships first, then the boarding pass.

## 1. Favicon

Replace the blue house (`public/house-icon.svg`, `#2D6AF6`) with the passport-stamp mark (option C from the brainstorm).

- New file `public/favicon.svg`, 32×32 viewBox: a parchment disc (`#F3EBDA`) with a perforated oxblood ring (`#A8512C`, `stroke-dasharray`), an inner thin ring, and an oxblood house with an arched parchment door.
- Ring strokes slightly heavier than the mockup (outer ≈2.4, inner ≈1.4) so a single SVG still reads at 16px. There is no separate 16px variant.
- `src/layouts/BaseLayout.astro` points `<link rel="icon">` at `/favicon.svg`. Delete `public/house-icon.svg` once nothing references it.
- No PNG or apple-touch-icon. There is no rasteriser in the toolchain, and the site only needs the browser-tab icon.

## 2. Boarding pass on the Arrivals board

Clicking an Arrivals row unfolds a boarding pass inline under that row. It surfaces each stop's `description`, which the board currently never shows.

### Data (`src/Utils/journeyData.js`)

`getArrivalsLedger` adds these fields to each item:

- `description`: from the journey point.
- `from`: `{ city, iata }` of the previous entry in `journeyPoints`, including hidden return stubs, so Delphi reads Warsaw → Delphi. Null for the first point (the Beirut home base).
- `travelClass`: `Home` for `home`, `Work` for `work`, `Resident` for `current`, and `Leisure` for everything else.
- `gate` and `seat`: derived from a small string hash of the point `id`, so they stay stable across renders and visits. Gate is a letter A–F plus 1–30 (e.g. `B14`). Seat is a row 1–40 plus a letter from A–F (e.g. `17A`).

### Components

- New `src/Components/Journey/BoardingPass.jsx` is a pure presentational component taking one ledger item. The main section has the passenger line (RIWA HOTEIT), FROM ✈ TO with IATA codes and city names, and a Date / Gate / Seat / Class grid. Below that is the description and, when `itinerary` is set, a "Read the itinerary →" link. A tear-off stub on the right repeats To, Date and Seat over a CSS barcode. The barcode is a `repeating-linear-gradient` whose stripe widths are seeded from the date label, so each pass looks distinct.
- `FlapBoard.jsx` gains an optional per-row `expanded` node, rendered directly after the row. Rows with an `onToggle` render as `<button type="button" aria-expanded>` instead of a static `div`. Departures rows keep their existing `<a>` behaviour.
- `ArrivalsBoard.jsx` holds `openId` state, with one pass open at a time. Each row gets `onToggle` and, when open, `expanded: <BoardingPass item={it} />`. Rows with an itinerary no longer navigate on click. The link lives inside the pass.

### Interaction

- Click or tap a row to open its pass. Click the same row again, open another row, or press Esc to close it.
- Keyboard users Tab to the row buttons and press Enter or Space to open one. On close, focus stays on the row.
- Hovering a row highlights it, and the Remarks cell shows a ▸ that rotates to ▾ when open.
- The board tag line in `JourneyBoard.jsx` adds "Tap a flight for its boarding pass".
- The pass unfolds with a short height and flap transition, which is skipped when `prefersReducedMotion()` is true.

### Styling

Parchment pass (`#F3EBDA`) on the dark terminal, ink `#1A1410`, labels in Spline Sans Mono uppercase, and the description in Spectral. It goes alongside the existing journey board styles. Below ~560px the stub stacks under the main section.

### Out of scope

The other selected journey ideas: passport stamps, baggage stats, year filter, sound toggle and "where next?". Each gets its own spec later.

### Verification

- In node, `getArrivalsLedger` returns `from` WAW for Delphi, null `from` for the home base, and the same gate and seat across two calls.
- In the browser, open and close a pass by mouse and keyboard, check that a row with an itinerary only navigates via the link, and check the mobile layout at 375px.
