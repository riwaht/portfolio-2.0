import { useState } from 'react';
import BoardRow from './BoardRow';
import BoardingPass from './BoardingPass';
import ArrivalsLedger from './ArrivalsLedger';
import {
  getJourneyStats,
  getBoardState,
  getArrivalsLedger,
  getUpClose,
} from '../../Utils/journeyData';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Two-digit terminal-style counts (e.g. "02 continents").
const pad2 = (n) => String(n).padStart(2, '0');

/**
 * The whole /journey page as a living Arrivals & Departures board.
 * Departures (upcoming trips) sit up top as flip-board rows + boarding-pass
 * tickets; Arrivals (everywhere already visited, deduped) read newest-first
 * below; two editorial "Up Close" cards close it out. Trips graduate from
 * Departures to Arrivals automatically by date — see journeyData selectors.
 */
function JourneyBoard() {
  const [departing, setDeparting] = useState(null);

  const stats = getJourneyStats();
  const { departures } = getBoardState();
  const ledger = getArrivalsLedger();
  const upClose = getUpClose();

  // Wash the screen in the trip's palette, then hand off to the live itinerary.
  const handleOpen = (e, trip) => {
    if (prefersReducedMotion()) return; // let the <a href> navigate normally
    e.preventDefault();
    setDeparting(trip);
    window.setTimeout(() => {
      window.location.href = trip.itinerary;
    }, 700);
  };

  return (
    <div className="jb-board">
      <div className="jb-wrap">
        <header className="jb-hero">
          <div>
            <div className="jb-eyebrow">Arrivals &amp; Departures</div>
            <h1 className="jb-h1">Journeys.</h1>
          </div>
          <div className="jb-stats">
            <div><b>{pad2(stats.cities)}</b> cities</div>
            <div><b>{pad2(stats.countries)}</b> countries</div>
            <div><b>{pad2(stats.continents)}</b> continents</div>
          </div>
        </header>

        <section aria-label="Departures">
          <div className="jb-board-label">
            <h2><span className="jb-sig" aria-hidden="true" />Departures</h2>
            <div className="jb-meta">Upcoming · 2026</div>
          </div>
          <div className="jb-rows">
            {departures.map((trip, i) => (
              <BoardRow key={trip.id} trip={trip} status={i === 0 ? 'Boarding' : 'Scheduled'} />
            ))}
          </div>
          <div className="jb-passes">
            {departures.map((trip) => (
              <BoardingPass key={trip.id} trip={trip} onOpen={handleOpen} />
            ))}
          </div>
        </section>

        <section aria-label="Arrivals">
          <div className="jb-board-label">
            <h2>Arrivals</h2>
            <div className="jb-meta">Stamped · 2018 — now</div>
          </div>
          <ArrivalsLedger items={ledger} />
          <div className="jb-note">
            ↑ Each departure gets stamped into Arrivals once it&apos;s flown — automatically, by date.
          </div>
        </section>

        <section aria-label="Up close">
          <div className="jb-board-label">
            <h2>From the pages</h2>
            <div className="jb-meta">Up close</div>
          </div>
          <div className="jb-upclose">
            {upClose.map((c) => (
              <article className="jb-acard" key={c.id}>
                <div className={`jb-cstamp${c.role ? '' : ' jb-cstamp-sea'}`} aria-hidden="true">
                  {c.stamp.split(' · ').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
                <div className="jb-acard-meta">{c.label} · {c.iata}</div>
                <h3 className="jb-acard-city">{c.city}</h3>
                <div className="jb-acard-country">{c.country}</div>
                <p>{c.description}</p>
                {c.role && <span className="jb-acard-role">{c.role}</span>}
              </article>
            ))}
          </div>
        </section>
      </div>

      {departing && (
        <div className={`departure-wash departure-wash-${departing.theme}`}>
          <span className="departure-wash-label">{departing.city}</span>
        </div>
      )}
    </div>
  );
}

export default JourneyBoard;
