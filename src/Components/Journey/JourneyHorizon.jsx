import { useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function BannerArt({ theme }) {
  if (theme === 'sea') {
    return (
      <svg className="horizon-banner-svg" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="hzSea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#114E5C" />
            <stop offset="1" stopColor="#0C3B45" />
          </linearGradient>
        </defs>
        <rect width="320" height="120" fill="url(#hzSea)" />
        <circle cx="232" cy="40" r="24" fill="#D8A53D" opacity="0.95" />
        <path d="M0,78 q26,-13 52,0 t52,0 t52,0 t52,0 t52,0 t52,0" fill="none" stroke="#5FB6B6" strokeWidth="3" strokeLinecap="round" />
        <path d="M0,94 q26,-13 52,0 t52,0 t52,0 t52,0 t52,0 t52,0" fill="none" stroke="#FBF6EC" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M0,110 q26,-13 52,0 t52,0 t52,0 t52,0 t52,0 t52,0" fill="none" stroke="#5FB6B6" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }
  return (
    <svg className="horizon-banner-svg" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hzAlp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5B6A75" />
          <stop offset="1" stopColor="#3A444C" />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill="url(#hzAlp)" />
      <path d="M0,120 L0,88 L46,56 L78,78 L120,36 L150,64 L196,22 L240,70 L286,44 L320,72 L320,120 Z" fill="#2C353C" />
      <path d="M196,22 L214,44 L178,44 Z" fill="#C56F66" />
    </svg>
  );
}

function DeparturesBoard({ points }) {
  return (
    <div className="horizon-board">
      <div className="horizon-board-head">
        <span className="horizon-board-title">Departures</span>
        <span className="horizon-board-dot" />
      </div>
      {points.map((p) => (
        <div className="horizon-board-row" key={p.id}>
          <span className="horizon-board-date">{p.depart}</span>
          <span className="horizon-board-dest">{p.city}</span>
          <span className="horizon-board-code">{p.code}</span>
          <span className="horizon-board-nights">{p.nights} nights</span>
        </div>
      ))}
    </div>
  );
}

function Postcard({ point, onOpen }) {
  return (
    <a
      className={`horizon-postcard horizon-postcard-${point.theme}`}
      href={point.itinerary}
      onClick={(e) => onOpen(e, point)}
    >
      <div className="horizon-postcard-banner">
        <BannerArt theme={point.theme} />
        <span className="horizon-postcard-stamp" aria-hidden="true" />
        <span className="horizon-postcard-place">{point.region}</span>
      </div>
      <div className="horizon-postcard-body">
        <span className="horizon-postcard-kind">{point.kind} · {point.nights} nights</span>
        <h3 className="horizon-postcard-city">{point.city}</h3>
        <span className="horizon-postcard-dates">{point.dateRange}</span>
        <p className="horizon-postcard-summary">{point.description}</p>
        <span className="horizon-postcard-go">
          Open itinerary <span className="horizon-postcard-arrow">→</span>
        </span>
      </div>
    </a>
  );
}

function JourneyHorizon({ points, registerRef, mobile = false }) {
  const [departing, setDeparting] = useState(null);

  const handleOpen = (e, point) => {
    if (prefersReducedMotion()) return; // let the <a href> navigate normally
    e.preventDefault();
    setDeparting(point);
    window.setTimeout(() => {
      window.location.href = point.itinerary;
    }, 700);
  };

  return (
    <section id="horizon" className={`journey-horizon${mobile ? ' journey-horizon-mobile' : ''}`}>
      {mobile && (
        <h2 className="horizon-mobile-title">Journeys<span className="horizon-dot">.</span></h2>
      )}
      <div className="horizon-eyebrow">The Horizon · upcoming</div>
      <DeparturesBoard points={points} />
      <div className="horizon-postcards">
        {points.map((point) => (
          <div
            key={point.id}
            ref={mobile || !registerRef ? undefined : (el) => registerRef(point.id, el)}
            data-point-id={point.id}
            className="horizon-entry"
          >
            <Postcard point={point} onOpen={handleOpen} />
          </div>
        ))}
      </div>
      {departing && (
        <div className={`departure-wash departure-wash-${departing.theme}`}>
          <span className="departure-wash-label">{departing.city}</span>
        </div>
      )}
    </section>
  );
}

export default JourneyHorizon;
