/**
 * The Arrivals ledger — every place already arrived in, deduped to one row
 * per city and ordered newest-first (NOW at the top, home base anchoring the
 * foot). Each row carries a rotated rubber-stamp pill toned by status.
 */

const STAMP_TONE = { gold: 'jb-stamp jb-stamp-res', oxblood: 'jb-stamp jb-stamp-home' };
const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase();

function ArrivalsLedger({ items }) {
  return (
    <div className="jb-ledger">
      {items.map((it) => (
        <div className="jb-lrow" key={it.id} data-point-id={it.id}>
          <span className="jb-date">{it.label === 'NOW' ? '— NOW —' : it.label}</span>
          <span className="jb-place">
            {it.city}
            <span className="jb-reg">{it.region}</span>
          </span>
          <span className="jb-lcode">{it.iata}</span>
          <span className={STAMP_TONE[it.tone] || 'jb-stamp'}>{titleCase(it.status)}</span>
        </div>
      ))}
    </div>
  );
}

export default ArrivalsLedger;
