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
// Departures emits neither dividers nor `live` rows, so the `.fb-divider` and
// `.fb-row-live` styles land with the Arrivals board (Task 5), not here.
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
