// Barcode bar widths seeded from the stop, so each pass prints its own stripes
// and the same stop always prints the same ones.
function barsFor(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const bars = [];
  let x = 0;
  while (x < 96) {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5; // xorshift step
    const w = 1 + ((h >>> 0) % 3);
    const gap = 1 + ((h >>> 4) % 2);
    bars.push({ x, w });
    x += w + gap;
  }
  return bars;
}

function Barcode({ seed }) {
  return (
    <svg className="bp-barcode" viewBox="0 0 96 30" preserveAspectRatio="none" aria-hidden="true">
      {barsFor(seed).map((b) => (
        <rect key={b.x} x={b.x} y="0" width={Math.min(b.w, 96 - b.x)} height="30" />
      ))}
    </svg>
  );
}

function Port({ label, code, city }) {
  return (
    <div className="bp-port">
      <span className="bp-lbl">{label}</span>
      <span className="bp-code">{code || '—'}</span>
      <span className="bp-city">{city}</span>
    </div>
  );
}

/**
 * The boarding pass an Arrivals row unfolds into: route, date, gate, seat and
 * class on the main ticket, the stop's own note underneath, and a tear-off stub
 * with a barcode. Gate and seat are generated per stop in getArrivalsLedger.
 */
function BoardingPass({ item, id, closing = false, onClosed }) {
  const date = item.label === 'NOW' ? 'Now' : item.label;
  // The wrapper's own height animation is the last to finish, so its end marks
  // the pass as fully folded away.
  const handleAnimationEnd = (e) => {
    if (closing && e.target === e.currentTarget && onClosed) onClosed();
  };
  return (
    <div
      className={`bp-wrap${closing ? ' bp-closing' : ''}`}
      id={id}
      aria-hidden={closing || undefined}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="bp-clip">
        <div className="bp-pad">
          <div className="bp" role="group" aria-label={`Boarding pass to ${item.city}`}>
            <div className="bp-main">
              <div className="bp-top">
                <span>RWA · Riwa Hoteit Intl</span>
                <span>Boarding pass</span>
              </div>
              <div className="bp-route">
                <Port label="From" code={item.from?.iata} city={item.from ? item.from.city : 'Origin'} />
                <span className="bp-path" aria-hidden="true"><span className="bp-plane">✈</span></span>
                <Port label="To" code={item.iata} city={item.city} />
              </div>
              <dl className="bp-grid">
                <div><dt>Passenger</dt><dd>Riwa Hoteit</dd></div>
                <div><dt>Date</dt><dd>{date}</dd></div>
                <div><dt>Gate</dt><dd>{item.gate}</dd></div>
                <div><dt>Seat</dt><dd>{item.seat}</dd></div>
                <div><dt>Class</dt><dd>{item.travelClass}</dd></div>
              </dl>
              {item.description && <p className="bp-desc">{item.description}</p>}
              {item.itinerary && (
                <a className="bp-link" href={item.itinerary}>
                  Read the itinerary <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
            <div className="bp-stub" aria-hidden="true">
              <div><span className="bp-lbl">To</span><span className="bp-stub-val">{item.iata || item.city}</span></div>
              <div><span className="bp-lbl">Date</span><span className="bp-stub-val">{date}</span></div>
              <div><span className="bp-lbl">Seat</span><span className="bp-stub-val">{item.seat}</span></div>
              <Barcode seed={`${item.id}${item.label}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardingPass;
