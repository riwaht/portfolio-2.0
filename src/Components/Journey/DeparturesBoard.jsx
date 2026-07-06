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

// A real-board "REMARKS" status, derived from the trip's date-accurate phase.
// "Boarding" lights up only on the departure day itself; before that a trip reads
// "On time", once underway "Departed", and it stays "Departed" after the write-up.
const REMARK = {
  scheduled: { text: 'On time', kind: 'ontime' },
  boarding: { text: 'Boarding', kind: 'boarding' },
  departed: { text: 'Departed', kind: 'departed' },
  documented: { text: 'Departed', kind: 'departed' },
};
const remark = (trip) => REMARK[trip.phase] || REMARK.documented;

const COLUMNS = ['Departs', 'Destination', 'Flight', 'Remarks'];

/**
 * The DEPARTURES board: one flight row per featured itinerary, departing the
 * current base (Paris · CDG). Rows link to the live itinerary and trigger the
 * same palette wash as the poster spreads. With nothing upcoming the board stays
 * put — the centerpiece of the terminal — and simply reads "No departures
 * scheduled". A thin config over FlapBoard.
 */
function DeparturesBoard({ trips, origin, onOpen }) {
  const title = origin ? `${origin.code} · ${origin.city}` : 'Departures';
  if (!trips || trips.length === 0) {
    return (
      <FlapBoard
        title={title}
        columns={COLUMNS}
        rows={[{ key: 'none', divider: 'No departures scheduled' }]}
        ariaLabel="Departures board"
      />
    );
  }

  const rows = trips.map((trip) => {
    const r = remark(trip);
    const linked = !!trip.itinerary;
    return {
      key: trip.id,
      href: trip.itinerary || undefined,
      onClick: linked && onOpen ? (e) => onOpen(e, trip) : undefined,
      cells: [
        { content: departDate(trip), className: 'fb-when' },
        { content: trip.city, className: 'fb-city', sub: trip.region || trip.country },
        { content: flightNo(trip), className: 'fb-flight' },
        {
          content: linked ? (
            <>
              {r.text}
              <span className="fb-arrow" aria-hidden="true">→</span>
            </>
          ) : r.text,
          className: `fb-status fb-status-${r.kind}`,
          // Live countdown under "On time" while a trip is still ahead; the
          // departure day, mid-trip and write-up rows speak for themselves.
          sub: trip.phase === 'scheduled' ? `in ${trip.days}d` : undefined,
        },
      ],
    };
  });

  return <FlapBoard title={title} columns={COLUMNS} rows={rows} ariaLabel="Departures board" />;
}

export default DeparturesBoard;
