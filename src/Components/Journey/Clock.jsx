import { useState, useEffect } from 'react';

/**
 * A ticking screen clock for the terminal boards. Renders `HH:MM` by default;
 * pass `seconds` for the `HH:MM:SS` terminal-header readout. The colon(s) blink
 * via CSS (.fb-colon).
 */
function Clock({ seconds = false, className = 'fb-clock' }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return (
    <span className={className}>
      {hh}<span className="fb-colon">:</span>{mm}
      {seconds && <><span className="fb-colon">:</span>{ss}</>}
    </span>
  );
}

export default Clock;
