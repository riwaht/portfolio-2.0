import { useState, useEffect } from 'react';
import FlapBoard from './FlapBoard';
import BoardingPass from './BoardingPass';
import { prefersReducedMotion } from '../../Utils/ui';

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
    return { content: (<><span className="fb-live-ping" aria-hidden="true" /> Live · Home</>), kind: 'live' };
  if (it.status === 'HOME') return { content: 'Home', kind: 'home' };
  return { content: 'Arrived', kind: 'arrived' };
};

const COLUMNS = ['Arrived', 'From', 'Flight', 'Remarks'];

/**
 * The ARRIVALS board — the arrivals ledger as a split-flap mirror of Departures:
 * one row per visit, every row landed. Year-divider bands break the rows into
 * year groups; the home base anchors the foot. Every row is a button that
 * unfolds its boarding pass underneath (one open at a time, Esc closes); a trip
 * with a written-up itinerary links out from inside its pass.
 */
function ArrivalsBoard({ items }) {
  const [openId, setOpenId] = useState(null);
  // Passes still folding away after being closed; each unmounts when its
  // closing animation ends (or straight away under reduced motion).
  const [closingIds, setClosingIds] = useState([]);

  const startClosing = (id) => {
    if (!prefersReducedMotion()) setClosingIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  };
  const finishClosing = (id) => setClosingIds((ids) => ids.filter((x) => x !== id));
  const toggle = (id) => {
    if (openId === id) {
      startClosing(id);
      setOpenId(null);
      return;
    }
    if (openId) startClosing(openId);
    finishClosing(id);
    setOpenId(id);
  };

  useEffect(() => {
    if (!openId) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      startClosing(openId);
      setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openId]);

  if (!items || items.length === 0) return null;

  // Group newest-first by year, Base group last (mirrors the old atlas index).
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
      const open = openId === it.id;
      const closing = !open && closingIds.includes(it.id);
      const panelId = `bp-${it.id}`;
      rows.push({
        key: it.id,
        live: it.status === 'RESIDENT',
        onToggle: () => toggle(it.id),
        open,
        expanded: open || closing ? (
          <BoardingPass item={it} id={panelId} closing={closing} onClosed={() => finishClosing(it.id)} />
        ) : null,
        panelId,
        cells: [
          { content: it.label, className: 'fb-when' },
          { content: it.city, className: 'fb-city', sub: it.region },
          { content: it.iata, className: 'fb-flight' },
          {
            content: (
              <>
                {r.content}
                <span className="fb-chev" aria-hidden="true">▸</span>
              </>
            ),
            className: `fb-status fb-status-${r.kind}`,
          },
        ],
      });
    });
  });

  return <FlapBoard title="RWA · RIWA HOTEIT INTL" columns={COLUMNS} rows={rows} ariaLabel="Arrivals board" />;
}

export default ArrivalsBoard;
