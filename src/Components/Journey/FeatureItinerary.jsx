// Two-digit feature index (01, 02, …).
const pad2 = (n) => String(n).padStart(2, '0');

const ACCENT = { alpine: 'var(--jb-alpine)', sea: 'var(--jb-sea)' };
const GLYPH = { alpine: '▲', sea: '≈' }; // ▲ peak · ≈ sea

// "46.5°N · 12.1°E" from the trip's geo, for the plate badge.
function coordLabel(geo) {
  if (!geo) return '';
  const ns = geo.lat >= 0 ? 'N' : 'S';
  const ew = geo.lon >= 0 ? 'E' : 'W';
  return `${Math.abs(geo.lat).toFixed(1)}°${ns} · ${Math.abs(geo.lon).toFixed(1)}°${ew}`;
}

// Topographic contour lines rising to a summit — the Alps.
function AlpinePlate() {
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="var(--jb-accent)" strokeWidth="1.1">
        <path d="M-20,250 C60,235 120,150 200,140 C280,150 340,232 420,248" opacity="0.30" />
        <path d="M-20,268 C60,255 130,178 200,168 C270,178 340,252 420,266" opacity="0.40" />
        <path d="M-20,286 C60,276 135,206 200,196 C265,206 340,272 420,284" opacity="0.52" />
        <path d="M-20,304 C60,298 140,236 200,226 C260,236 340,294 420,302" opacity="0.66" />
        <path d="M120,150 C150,90 175,60 200,40 C225,60 250,92 280,150" opacity="0.7" />
        <path d="M150,150 C170,108 186,86 200,72 C214,86 230,110 250,150" opacity="0.8" />
      </g>
      <circle cx="200" cy="40" r="2.4" fill="var(--jb-accent)" />
    </svg>
  );
}

// Concentric wave lines under a low sun — the Ionian.
function SeaPlate() {
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="300" cy="96" r="34" fill="none" stroke="var(--jb-accent)" strokeWidth="1.2" opacity="0.5" />
      <g fill="none" stroke="var(--jb-accent)" strokeWidth="1.2">
        <path d="M-20,170 C60,156 120,184 200,172 C280,160 340,186 420,174" opacity="0.32" />
        <path d="M-20,198 C70,184 130,212 200,200 C270,188 350,214 420,202" opacity="0.42" />
        <path d="M-20,226 C60,214 130,242 200,230 C270,218 350,244 420,232" opacity="0.54" />
        <path d="M-20,254 C70,244 130,270 200,258 C270,246 350,272 420,260" opacity="0.66" />
        <path d="M-20,282 C60,274 130,298 200,286 C270,274 350,300 420,288" opacity="0.78" />
      </g>
    </svg>
  );
}

/**
 * One documented itinerary as a large editorial spread: body (index, city,
 * meta, tagline, stop chips, CTA) beside a line-art "plate". Alternating
 * layouts (`alt`) flip the columns. The whole card is a link to the live
 * itinerary; onOpen washes the screen in the trip's palette before navigating.
 */
function FeatureItinerary({ trip, index, alt, onOpen }) {
  const theme = trip.theme === 'sea' ? 'sea' : 'alpine';
  const regionLabel = (trip.region || trip.country).replace(' · ', ' / ');
  const stops = trip.stops || [];

  return (
    <a
      className={`jb-feature${alt ? ' jb-feature-alt' : ''}`}
      href={trip.itinerary}
      style={{ '--jb-accent': ACCENT[theme] }}
      onClick={onOpen ? (e) => onOpen(e, trip) : undefined}
    >
      <div className="jb-fbody">
        <div className="jb-findex">{pad2(index + 1)} — {regionLabel}</div>
        <h3 className="jb-fcity">{trip.city}</h3>
        <div className="jb-fmeta">
          <span>{trip.kind}</span><span className="jb-d" aria-hidden="true" />
          <span>{trip.nights} nights</span><span className="jb-d" aria-hidden="true" />
          <span>{trip.dateRange}</span>
        </div>
        <p className="jb-ftagline">{trip.description}</p>
        {stops.length > 0 && (
          <div className="jb-fstops">
            {stops.map((s) => (
              <span className="jb-chip" key={s}>{s}</span>
            ))}
          </div>
        )}
        <span className="jb-fcta">
          Read the itinerary
          <span className="jb-line" aria-hidden="true" />
          <span className="jb-arrow" aria-hidden="true">{'→'}</span>
        </span>
      </div>
      <div className="jb-fplate">
        <span className="jb-iata">{trip.iata}</span>
        <span className="jb-badge"><span aria-hidden="true">{GLYPH[theme]}</span> {coordLabel(trip.geo)}</span>
        {theme === 'sea' ? <SeaPlate /> : <AlpinePlate />}
      </div>
    </a>
  );
}

export default FeatureItinerary;
