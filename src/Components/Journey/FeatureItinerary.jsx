import { pad2 } from '../../Utils/ui';

const ACCENT = { alpine: 'var(--jb-alpine)', sea: 'var(--jb-sea)' };
const GLYPH = { alpine: '▲', sea: '≈' }; // ▲ peak · ≈ sea

// Poster badge per date-accurate phase. Scheduled spreads count down to the
// departure; the day itself reads "Boarding today"; mid-trip "En route".
function badgeText(phase, days) {
  if (phase === 'boarding') return 'Boarding today';
  if (phase === 'departed') return 'En route';
  if (phase === 'documented') return 'Documented';
  return days <= 1 ? 'Departs tomorrow' : `Departs in ${days} days`;
}

// "46.5°N · 12.1°E" from the trip's geo, for the plate badge.
function coordLabel(geo) {
  if (!geo) return '';
  const ns = geo.lat >= 0 ? 'N' : 'S';
  const ew = geo.lon >= 0 ? 'E' : 'W';
  return `${Math.abs(geo.lat).toFixed(1)}°${ns} · ${Math.abs(geo.lon).toFixed(1)}°${ew}`;
}

/**
 * A printed travel-poster of the Dolomites at dusk: a dawn-to-rose sky, a pale
 * disc low over the range, and layered limestone peaks whose upper faces catch
 * the "enrosadira" alpenglow. `uid` keeps gradient ids unique per spread.
 */
function AlpinePoster({ uid }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26313F" />
          <stop offset="0.42" stopColor="#6B5A6B" />
          <stop offset="0.74" stopColor="#C58A72" />
          <stop offset="1" stopColor="#EBBC8C" />
        </linearGradient>
        <linearGradient id={`${uid}-lit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EA9E79" />
          <stop offset="1" stopColor="#B85C49" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${uid}-sky)`} />
      {/* low sun disc */}
      <circle cx="300" cy="96" r="28" fill="#F6E6C4" opacity="0.9" />
      {/* hazy back range */}
      <polygon points="0,182 70,150 140,176 210,142 290,176 360,148 400,172 400,300 0,300" fill="#8E7F88" opacity="0.45" />
      {/* mid stone range */}
      <polygon points="0,210 64,170 132,200 210,156 288,198 356,164 400,194 400,300 0,300" fill="#585366" opacity="0.85" />
      {/* front massif — shadow body */}
      <polygon points="0,300 0,238 96,168 150,210 250,120 330,196 400,168 400,300" fill="#352F3B" />
      {/* alpenglow-lit faces (left side of each peak) */}
      <polygon points="96,168 96,300 0,300 0,238" fill={`url(#${uid}-lit)`} opacity="0.92" />
      <polygon points="250,120 250,300 150,300 150,210" fill={`url(#${uid}-lit)`} />
      {/* snow caps */}
      <polygon points="250,120 268,138 232,138" fill="#F4ECDC" opacity="0.85" />
      <polygon points="96,168 110,184 82,184" fill="#F4ECDC" opacity="0.7" />
      {/* foreground forest */}
      <path d="M0,300 L0,272 Q100,260 200,270 T400,266 L400,300 Z" fill="#1C3A30" />
    </svg>
  );
}

/**
 * A printed travel-poster of the Ionian: a teal-to-gold sky, a low sun laying a
 * reflection down the water, banded waves, and a small headland — Corfu.
 */
function SeaPoster({ uid }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C5468" />
          <stop offset="0.55" stopColor="#54879A" />
          <stop offset="0.82" stopColor="#E7C079" />
          <stop offset="1" stopColor="#F4D58C" />
        </linearGradient>
        <linearGradient id={`${uid}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E8C97" />
          <stop offset="1" stopColor="#114049" />
        </linearGradient>
      </defs>
      {/* sky */}
      <rect width="400" height="158" fill={`url(#${uid}-sky)`} />
      {/* sun + glow */}
      <circle cx="206" cy="132" r="40" fill="#F8DE94" opacity="0.35" />
      <circle cx="206" cy="134" r="26" fill="#F9E3A0" />
      {/* headland on the left horizon */}
      <path d="M0,158 L0,128 Q40,108 84,134 L96,158 Z" fill="#123A40" opacity="0.9" />
      {/* sea */}
      <rect y="156" width="400" height="144" fill={`url(#${uid}-sea)`} />
      {/* sun reflection column */}
      <polygon points="186,158 226,158 246,300 166,300" fill="#F6DC93" opacity="0.22" />
      {/* wave crests, near→far lightening */}
      <g fill="none" stroke="#CFE7E4" strokeLinecap="round">
        <path d="M-10,176 q30,-8 60,0 t60,0 t60,0 t60,0 t60,0 t60,0" strokeWidth="2" opacity="0.5" />
        <path d="M-10,202 q34,-9 68,0 t68,0 t68,0 t68,0 t68,0" strokeWidth="2.4" opacity="0.45" />
        <path d="M-10,236 q38,-11 76,0 t76,0 t76,0 t76,0 t76,0" strokeWidth="3" opacity="0.4" />
        <path d="M-10,276 q42,-12 84,0 t84,0 t84,0 t84,0 t84,0" strokeWidth="3.4" opacity="0.34" />
      </g>
    </svg>
  );
}

/**
 * One documented itinerary as a large editorial spread: body (index, city,
 * meta, tagline, stop chips, CTA) beside a printed travel-poster "plate".
 * Alternating layouts (`alt`) flip the columns. A date-accurate badge counts the
 * spread down to departure, flips to "Boarding" on the day, then settles to
 * "Documented" — so featured itineraries stay on the page for good. The whole card
 * links to the live itinerary; onOpen washes the screen in the trip's palette first.
 */
function FeatureItinerary({ trip, index, alt, phase = 'documented', days = 0, onOpen }) {
  const theme = trip.theme === 'sea' ? 'sea' : 'alpine';
  const upcoming = phase !== 'documented';
  const hasItinerary = !!trip.itinerary;
  const regionLabel = (trip.region || trip.country).replace(' · ', ' / ');
  const stops = trip.stops || [];
  const uid = `fp${index}`;

  return (
    <a
      className={`jb-feature${alt ? ' jb-feature-alt' : ''}${hasItinerary ? '' : ' jb-feature-static'}`}
      href={hasItinerary ? trip.itinerary : undefined}
      style={{ '--jb-accent': ACCENT[theme] }}
      onClick={hasItinerary && onOpen ? (e) => onOpen(e, trip) : undefined}
    >
      <div className="jb-fbody">
        <div className="jb-findex">{pad2(index + 1)} — {regionLabel}</div>
        <h3 className="jb-fcity">{trip.city}</h3>
        <div className="jb-fmeta">
          <span>{trip.kind}</span><span className="jb-d" aria-hidden="true" />
          {trip.nights ? (<><span>{trip.nights} nights</span><span className="jb-d" aria-hidden="true" /></>) : null}
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
        {hasItinerary ? (
          <span className="jb-fcta">
            {upcoming ? 'See the plan' : 'Read the itinerary'}
            <span className="jb-line" aria-hidden="true" />
            <span className="jb-arrow" aria-hidden="true">{'→'}</span>
          </span>
        ) : (
          <span className="jb-fcta jb-fcta-static">Going home</span>
        )}
      </div>
      <div className="jb-fplate">
        {theme === 'sea' ? <SeaPoster uid={uid} /> : <AlpinePoster uid={uid} />}
        <span className={`jb-fstatus jb-fstatus-${phase}`}>
          {upcoming && <span className="jb-fstatus-dot" aria-hidden="true" />}
          {badgeText(phase, days)}
        </span>
        <span className="jb-iata">{trip.iata}</span>
        <span className="jb-badge"><span aria-hidden="true">{GLYPH[theme]}</span> {coordLabel(trip.geo)}</span>
      </div>
    </a>
  );
}

export default FeatureItinerary;
