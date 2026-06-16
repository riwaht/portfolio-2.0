import { useState, useCallback, useEffect } from 'react';
import FeatureItinerary from './FeatureItinerary';
import DeparturesBoard from './DeparturesBoard';
import AtlasIndex from './AtlasIndex';
import {
  journeyPoints,
  getJourneyStats,
  getFeaturedItineraries,
  getArrivalsLedger,
  iataFor,
} from '../../Utils/journeyData';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Two-digit terminal-style counts (e.g. "02 Continents").
const pad2 = (n) => String(n).padStart(2, '0');

/**
 * The /journey page as an editorial travel index, in three movements:
 *   1. Masthead — name, lead, and a mono stat rule with a live "currently" dot.
 *   2. Featured itineraries — the trips documented day-by-day, rendered as
 *      large alternating feature spreads that link out to the live itineraries.
 *   3. Everywhere else — a quiet year-grouped index of every other place.
 * Trips graduate from "featured" to the index automatically by date.
 */
function JourneyBoard() {
  const [departing, setDeparting] = useState(null);

  const stats = getJourneyStats();
  const featured = getFeaturedItineraries();
  const ledger = getArrivalsLedger();
  const current = journeyPoints.find((p) => p.type === 'current');
  const currentCity = current ? current.city : null;
  // The departures board flies out of wherever home currently is (Paris · CDG).
  const origin = current ? { city: current.city, code: iataFor(current.city) } : null;

  // Wash the screen in the trip's palette, then hand off to the live itinerary.
  const handleOpen = useCallback((e, trip) => {
    if (prefersReducedMotion()) return; // let the <a href> navigate normally
    e.preventDefault();
    setDeparting(trip);
    window.setTimeout(() => {
      window.location.href = trip.itinerary;
    }, 700);
  }, []);

  // Pressing Back from an itinerary restores this page from the bfcache with
  // React state frozen — including a finished departure wash still covering the
  // screen. Clear it whenever the page is shown (in particular on bfcache restore).
  useEffect(() => {
    const clearWash = () => setDeparting(null);
    window.addEventListener('pageshow', clearWash);
    return () => window.removeEventListener('pageshow', clearWash);
  }, []);

  return (
    <div className="jb-board">
      <div className="jb-wrap">
        <header className="jb-masthead">
          <div className="jb-eyebrow">The Travel Index</div>
          <h1 className="jb-h1">Journeys<span className="jb-dot">.</span></h1>
          <p className="jb-lead">
            Trips I&apos;ve documented day&nbsp;by&nbsp;day — and everywhere&nbsp;else the road has gone.
          </p>
          <div className="jb-rule">
            <span><b>{pad2(stats.cities)}</b> Cities</span><span className="jb-sep" aria-hidden="true" />
            <span><b>{pad2(stats.countries)}</b> Countries</span><span className="jb-sep" aria-hidden="true" />
            <span><b>{pad2(stats.continents)}</b> Continents</span><span className="jb-sep" aria-hidden="true" />
            <span>Since <b>2018</b></span>
            {currentCity && (
              <span className="jb-now"><span className="jb-live" aria-hidden="true" /> Currently · {currentCity}</span>
            )}
          </div>
        </header>

        {featured.length > 0 && (
          <section aria-label="Departures — featured itineraries">
            <div className="jb-slabel">
              <h2>Departures</h2>
              <div className="jb-tag">Featured itineraries<br />Planned in full · walked day by day</div>
            </div>
            <DeparturesBoard trips={featured} origin={origin} onOpen={handleOpen} />
            <div className="jb-features">
              {featured.map((trip, i) => (
                <FeatureItinerary
                  key={trip.id}
                  trip={trip}
                  index={i}
                  alt={i % 2 === 1}
                  status={trip.status}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          </section>
        )}

        <section aria-label="Arrivals — everywhere else">
          <div className="jb-slabel">
            <h2>Arrivals</h2>
            <div className="jb-tag">Everywhere else<br />Stamped · 2018 — now</div>
          </div>
          <AtlasIndex items={ledger} />
        </section>

        <div className="jb-foot">
          <span>Riwa Hoteit — Field Notes</span>
          <span>Departures graduate to the index automatically, by date</span>
        </div>
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
