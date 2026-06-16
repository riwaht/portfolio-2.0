import { useState, useEffect } from 'react';
import { prefersReducedMotion } from '../../Utils/ui';

// "RH 0723" — a stable flight number built from the departure date.
const flightNo = (trip) => {
  const mmdd = (trip.startDate || '').slice(5).replace('-', '');
  return `RH ${mmdd || '000'}`;
};

const MON = { Jan: 'JAN', Feb: 'FEB', Mar: 'MAR', Apr: 'APR', May: 'MAY', Jun: 'JUN', Jul: 'JUL', Aug: 'AUG', Sep: 'SEP', Oct: 'OCT', Nov: 'NOV', Dec: 'DEC' };

// "Jul 23" → "23 JUL" for the board's departure column.
const departDate = (trip) => {
  const [mon, day] = (trip.depart || '').split(' ');
  if (mon && day) return `${day.padStart(2, '0')} ${MON[mon] || mon.toUpperCase()}`;
  return (trip.dateRange || '').toUpperCase();
};

// A real-board "REMARKS" status, derived from the trip's lifecycle status.
// The soonest still-upcoming trip is "Boarding"; later upcoming ones are "On time";
// trips whose dates have passed read "Departed".
const remark = (trip, isNext) => {
  if (trip.status !== 'upcoming') return { text: 'Departed', kind: 'departed' };
  return isNext ? { text: 'Boarding', kind: 'boarding' } : { text: 'On time', kind: 'ontime' };
};

// Ticking HH:MM clock so the board reads as a live screen.
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return (
    <span className="dep-clock">{hh}<span className="dep-colon">:</span>{mm}</span>
  );
}

// One Solari "flap" tile — flips down into place on load (staggered by `delay`).
function Flap({ children, delay = 0, className = '' }) {
  return (
    <span className={`dep-flap ${className}`} style={{ '--d': `${delay}s` }}>{children}</span>
  );
}

/**
 * An airport split-flap DEPARTURES board for the featured itineraries: one
 * flight row per trip, departing the current base (Paris · CDG). Rows link to
 * the live itinerary and trigger the same palette wash as the poster spreads.
 * It's the crisp schedule; the posters below are the gate detail.
 */
function DeparturesBoard({ trips, origin, onOpen }) {
  if (!trips || trips.length === 0) return null;
  const reduce = prefersReducedMotion();
  const stagger = (row, col) => (reduce ? 0 : 0.12 + row * 0.16 + col * 0.07);
  const nextId = (trips.find((t) => t.status === 'upcoming') || {}).id;

  return (
    <div className="dep-board" aria-label="Departures board">
      <div className="dep-head">
        <span className="dep-title">{origin ? `${origin.code} · ${origin.city}` : 'Departures'}</span>
        <span className="dep-live"><span className="dep-live-dot" aria-hidden="true" /> Live</span>
        <Clock />
      </div>
      <div className="dep-cols" aria-hidden="true">
        <span>Departs</span>
        <span>Destination</span>
        <span>Flight</span>
        <span>Remarks</span>
      </div>
      <div className="dep-rows">
        {trips.map((trip, i) => {
          const r = remark(trip, trip.id === nextId);
          return (
            <a
              key={trip.id}
              className="dep-row"
              href={trip.itinerary}
              onClick={onOpen ? (e) => onOpen(e, trip) : undefined}
            >
              <Flap delay={stagger(i, 0)} className="dep-when">{departDate(trip)}</Flap>
              <span className="dep-dest">
                <Flap delay={stagger(i, 1)} className="dep-city">{trip.city}</Flap>
                <span className="dep-region">{trip.region || trip.country}</span>
              </span>
              <Flap delay={stagger(i, 2)} className="dep-flight">{flightNo(trip)}</Flap>
              <Flap delay={stagger(i, 3)} className={`dep-status dep-status-${r.kind}`}>
                {r.text}
                <span className="dep-arrow" aria-hidden="true">→</span>
              </Flap>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default DeparturesBoard;
