import FlapBoard from './FlapBoard';

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
// The soonest still-upcoming trip is "Boarding"; later upcoming ones "On time";
// trips whose dates have passed read "Departed".
const remark = (trip, isNext) => {
  if (trip.status !== 'upcoming') return { text: 'Departed', kind: 'departed' };
  return isNext ? { text: 'Boarding', kind: 'boarding' } : { text: 'On time', kind: 'ontime' };
};

const COLUMNS = ['Departs', 'Destination', 'Flight', 'Remarks'];

/**
 * The DEPARTURES board: one flight row per featured itinerary, departing the
 * current base (Paris · CDG). Rows link to the live itinerary and trigger the
 * same palette wash as the poster spreads. A thin config over FlapBoard.
 */
function DeparturesBoard({ trips, origin, onOpen }) {
  if (!trips || trips.length === 0) return null;
  const nextId = (trips.find((t) => t.status === 'upcoming') || {}).id;
  const title = origin ? `${origin.code} · ${origin.city}` : 'Departures';

  const rows = trips.map((trip) => {
    const r = remark(trip, trip.id === nextId);
    return {
      key: trip.id,
      href: trip.itinerary,
      onClick: onOpen ? (e) => onOpen(e, trip) : undefined,
      cells: [
        { content: departDate(trip), className: 'fb-when' },
        { content: trip.city, className: 'fb-city', sub: trip.region || trip.country },
        { content: flightNo(trip), className: 'fb-flight' },
        {
          content: (
            <>
              {r.text}
              <span className="fb-arrow" aria-hidden="true">→</span>
            </>
          ),
          className: `fb-status fb-status-${r.kind}`,
        },
      ],
    };
  });

  return <FlapBoard title={title} columns={COLUMNS} rows={rows} ariaLabel="Departures board" />;
}

export default DeparturesBoard;
