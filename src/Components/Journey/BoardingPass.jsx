/**
 * A featured trip rendered as a tear-off boarding pass: perforation notches,
 * dashed depart/return/nights grid, and an ink-on-ink MRZ strip along the foot.
 * The whole pass is the link to the live itinerary; clicking triggers the
 * departure-wash via onOpen.
 */

// "Jul 23" -> "23 JUL" to match a printed pass field.
function fmtDayMonth(s) {
  const [mon, day] = s.split(' ');
  return `${day} ${mon.toUpperCase()}`;
}

function BoardingPass({ trip, onOpen }) {
  return (
    <a
      className={`jb-pass jb-pass-${trip.theme}`}
      href={trip.itinerary}
      onClick={(e) => onOpen(e, trip)}
    >
      <div className="jb-pass-top">
        <div className="jb-pass-row">
          <span className="jb-klass">Boarding pass · {trip.kind}</span>
          <span className="jb-code">{trip.iata}</span>
        </div>
        <h3 className="jb-pass-city">{trip.city}</h3>
        <div className="jb-region">{trip.region}</div>
        <div className="jb-pass-grid">
          <div>
            <div className="jb-k">Depart</div>
            <div className="jb-v">{fmtDayMonth(trip.depart)}</div>
          </div>
          <div>
            <div className="jb-k">Return</div>
            <div className="jb-v">{fmtDayMonth(trip.ret)}</div>
          </div>
          <div>
            <div className="jb-k">Nights</div>
            <div className="jb-v">{String(trip.nights).padStart(2, '0')}</div>
          </div>
        </div>
      </div>
      <div className="jb-pass-body">
        <p>{trip.description}</p>
        <span className="jb-pass-cta">
          Open itinerary <span className="jb-arrow" aria-hidden="true">→</span>
        </span>
      </div>
      <div className="jb-mrz" aria-hidden="true">{trip.mrz}</div>
    </a>
  );
}

export default BoardingPass;
