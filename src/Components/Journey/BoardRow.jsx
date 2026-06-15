/**
 * One Departures-board row — a Solari split-flap "flip" reveal on mount.
 * Mono data columns (time / nights / IATA / status) frame an italic
 * Fraunces destination, terminal-style.
 */
function BoardRow({ trip, status }) {
  return (
    <div className={`jb-frow jb-frow-${trip.theme}`}>
      <div className="jb-time">{trip.depart.toUpperCase()}</div>
      <div className="jb-frow-dest">
        <div className="jb-dest">{trip.city}</div>
        <div className="jb-region">{trip.region}</div>
      </div>
      <div className="jb-nights">{trip.nights} nights</div>
      <div className="jb-code">{trip.iata}</div>
      <div className="jb-status">
        <span className="jb-livedot" aria-hidden="true" />
        {status}
      </div>
    </div>
  );
}

export default BoardRow;
