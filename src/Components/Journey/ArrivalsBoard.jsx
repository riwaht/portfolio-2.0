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
    return { content: (<><span className="fb-live-ping" aria-hidden="true" /> Live · Home</>), kind: 'live' };
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
