import { useState, useCallback, useEffect } from 'react';
import FeatureItinerary from './FeatureItinerary';
import DeparturesBoard from './DeparturesBoard';
import TerminalHeader from './TerminalHeader';
import ArrivalsBoard from './ArrivalsBoard';
import {
  journeyPoints,
  getJourneyStats,
  getFeaturedItineraries,
  getArrivalsLedger,
  iataFor,
} from '../../Utils/journeyData';
import { pad2, prefersReducedMotion } from '../../Utils/ui';

/**
 * The /journey page as an airport flight-information display — one continuous
 * dark terminal screen (RIWA HOTEIT INTL), independent of the site theme:
 *   1. Terminal header — name, live "now" pip, ticking clock, boarding ticker.
 *   2. Departures — the featured itineraries as a split-flap board that links
 *      out to each live itinerary.
 *   3. Now Boarding — those same featured trips walked day-by-day as spreads.
 *   4. Arrivals — a split-flap mirror of every other place I've landed.
 * Trips graduate from Departures to the Arrivals ledger automatically by date.
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
  // Header calls stay date-honest: only trips actually boarding today drive the
  // "now boarding" call; the rest of the upcoming slate teases as "next up".
  const boardingNow = featured.filter((t) => t.phase === 'boarding').map((t) => t.city);
  const upcomingNext = featured.filter((t) => t.phase === 'scheduled').map((t) => t.city);

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
        <TerminalHeader stats={stats} currentCity={currentCity} boarding={boardingNow} upcoming={upcomingNext} />

        <section aria-label="Departures — where I'm headed">
          <div className="jb-slabel">
            <h2>Departures</h2>
            <div className="jb-tag">Where I&apos;m headed<br />Next departures · planned in full</div>
          </div>
          <DeparturesBoard trips={featured} origin={origin} onOpen={handleOpen} />
        </section>

        {featured.length > 0 && (
          <section aria-label="Now boarding — the itineraries in detail">
            <div className="jb-slabel">
              <h2>Now Boarding</h2>
              <div className="jb-tag">Gate detail<br />Walked day by day</div>
            </div>
            <div className="jb-features">
              {featured.map((trip, i) => (
                <FeatureItinerary
                  key={trip.id}
                  trip={trip}
                  index={i}
                  alt={i % 2 === 1}
                  phase={trip.phase}
                  days={trip.days}
                  onOpen={handleOpen}
                />
              ))}
            </div>
          </section>
        )}

        <section aria-label="Arrivals — everywhere I've landed">
          <div className="jb-slabel">
            <h2>Arrivals</h2>
            <div className="jb-tag">{pad2(ledger.length)} stops<br />Everywhere I&apos;ve landed · 2018 — now</div>
          </div>
          <ArrivalsBoard items={ledger} />
        </section>

        <div className="jb-foot">
          <span>End of display</span>
          <span>Baggage claim · all carousels · Riwa Hoteit — Field Notes</span>
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
