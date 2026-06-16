import { pad2 } from '../../Utils/ui';

// Year for a ledger row: current resident → this year; dated stay → its year;
// the undated home base → its own "Base" group at the foot of the index.
function yearKey(item) {
  if (item.sortKey === Infinity) return new Date().getFullYear();
  if (item.sortKey > 0) return Math.floor(item.sortKey / 100);
  return 'Base';
}

/**
 * "Everywhere else" — the deduped arrivals ledger as a quiet typographic
 * index, grouped newest-first by year with a sticky tally aside. One row
 * per city: name, country, IATA code. The home base anchors the bottom.
 */
function AtlasIndex({ items }) {
  const byYear = new Map();
  items.forEach((it) => {
    const key = yearKey(it);
    if (!byYear.has(key)) byYear.set(key, []);
    byYear.get(key).push(it);
  });

  const numeric = [...byYear.keys()].filter((k) => k !== 'Base').sort((a, b) => b - a);
  const ordered = byYear.has('Base') ? [...numeric, 'Base'] : numeric;

  return (
    <section className="jb-atlas">
      <aside className="jb-atlas-aside">
        <div className="jb-k">The long way<br />round</div>
        <p className="jb-big">{pad2(items.length)}<br />stops</p>
        <div className="jb-k jb-k-sub">Deduped to<br />one per city</div>
      </aside>
      <div>
        {ordered.map((year) => (
          <div className="jb-yearblock" key={year}>
            <div className="jb-yearhead">
              <span className="jb-yr">{year}</span>
              <span className="jb-ln" aria-hidden="true" />
            </div>
            {byYear.get(year).map((it) => {
              const isNow = it.status === 'RESIDENT';
              const isHome = it.status === 'HOME';
              const country = isHome ? `${it.country} · home` : it.country;
              return (
                <div
                  className={`jb-prow${isNow ? ' jb-prow-now' : ''}${isHome ? ' jb-prow-home' : ''}`}
                  key={it.id}
                >
                  <span className="jb-city">{it.city}</span>
                  <span className="jb-ctry">{country}</span>
                  <span className="jb-code">{it.iata}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export default AtlasIndex;
