import Clock from './Clock';
import { pad2 } from '../../Utils/ui';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * The terminal header — the airport identity strip that opens the page:
 * a mono ID strip (RIWA HOTEIT INTL · RWA + live HH:MM:SS clock and date),
 * the Fraunces "Journeys." title, a stats readout with the live "now" ping,
 * and a scrolling LED ticker of the lead line + boarding call.
 */
function TerminalHeader({ stats, currentCity, boarding = [], upcoming = [] }) {
  const now = new Date();
  const dateStr = `${DAYS[now.getDay()]} ${pad2(now.getDate())} ${MONS[now.getMonth()]}`;

  // Date-honest call: announce a real boarding only when one is happening today;
  // otherwise tease the next scheduled departures.
  const boardingCall = boarding.length
    ? `NOW BOARDING: ${boarding.map((c) => c.toUpperCase()).join(' ✦ ')}`
    : upcoming.length
      ? `NEXT UP: ${upcoming.map((c) => c.toUpperCase()).join(' ✦ ')}`
      : '';
  const tickerText = `EVERYWHERE ELSE THE ROAD HAS GONE${boardingCall ? ` ✦ ${boardingCall}` : ''} ✦ `;

  return (
    <header className="th">
      <div className="th-id">
        <span className="th-code">RIWA HOTEIT INTL <span className="th-iata">· RWA</span></span>
        <span className="th-now">
          <Clock seconds className="th-clock" />
          <span className="th-date">{dateStr}</span>
        </span>
      </div>

      <div className="th-eyebrow">The Travel Index</div>
      <h1 className="th-h1">Journeys<span className="th-dot">.</span></h1>

      <div className="th-stats">
        <span><b>{pad2(stats.cities)}</b> Cities</span><span className="th-sep" aria-hidden="true" />
        <span><b>{pad2(stats.countries)}</b> Countries</span><span className="th-sep" aria-hidden="true" />
        <span><b>{pad2(stats.continents)}</b> Continents</span><span className="th-sep" aria-hidden="true" />
        <span>Since <b>2018</b></span>
        {currentCity && (
          <span className="th-live-wrap"><span className="th-live" aria-hidden="true" /> Now in {currentCity}</span>
        )}
      </div>

      <div className="th-ticker" aria-hidden="true">
        <div className="th-track">
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>
    </header>
  );
}

export default TerminalHeader;
