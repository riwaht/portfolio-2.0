import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../Utils/ui';

const INKS = ['#A8512C', '#2B7791', '#2E7C58', '#6B4A6A', '#8A6A1F', '#3E5F6E'];
const SHAPES = ['circle', 'rect', 'octagon', 'oval'];

// Shrink a line of stamp text so long names (UNITED KINGDOM) still fit.
// 0.62em per mono glyph plus the 0.12em tracking set on .pp-arc.
const fit = (text, base, room) => Math.min(base, room / (text.length * 0.74));

// Per-stamp look, all derived from the country's hash so it never reshuffles:
// shape, ink, tilt and a small nudge off its grid cell.
function lookFor(stamp) {
  const h = stamp.seed;
  return {
    shape: stamp.home ? 'circle' : SHAPES[h % SHAPES.length],
    ink: stamp.home ? INKS[0] : INKS[(h >>> 3) % INKS.length],
    tilt: ((h >>> 6) % 29) - 14,
    dx: ((h >>> 11) % 17) - 8,
    dy: ((h >>> 16) % 17) - 8,
  };
}

function CircleStamp({ stamp, id }) {
  const top = stamp.country;
  const bottom = stamp.home ? 'Since day one' : `Entry · ${stamp.iata}`;
  return (
    <>
      <defs>
        <path id={`${id}-top`} d="M22 60a38 38 0 0 1 76 0" />
        <path id={`${id}-bot`} d="M24 62a36 36 0 0 0 72 0" />
      </defs>
      <circle cx="60" cy="60" r="54" fill="none" strokeWidth="3.2" />
      <circle cx="60" cy="60" r="46" fill="none" strokeWidth="1.2" />
      <text className="pp-arc" fontSize={fit(top, 11, 84)} textAnchor="middle">
        <textPath href={`#${id}-top`} startOffset="50%">{top.toUpperCase()}</textPath>
      </text>
      <text className="pp-arc" fontSize="8.5" dominantBaseline="hanging" textAnchor="middle">
        <textPath href={`#${id}-bot`} startOffset="50%">{bottom.toUpperCase()}</textPath>
      </text>
      <line x1="28" y1="50" x2="92" y2="50" strokeWidth="1" />
      <line x1="28" y1="72" x2="92" y2="72" strokeWidth="1" />
      <text x="60" y="66" className="pp-big" fontSize={stamp.home ? 17 : 15} textAnchor="middle">
        {stamp.date.toUpperCase()}
      </text>
    </>
  );
}

function BoxStamp({ stamp, shape }) {
  const country = stamp.country.toUpperCase();
  const outline =
    shape === 'rect' ? (
      <>
        <rect x="6" y="22" width="108" height="76" rx="7" fill="none" strokeWidth="3.2" />
        <rect x="12" y="28" width="96" height="64" rx="4" fill="none" strokeWidth="1.1" />
      </>
    ) : shape === 'octagon' ? (
      <>
        <polygon points="36,14 84,14 108,38 108,82 84,106 36,106 12,82 12,38" fill="none" strokeWidth="3.2" />
        <polygon points="39,21 81,21 101,41 101,79 81,99 39,99 19,79 19,41" fill="none" strokeWidth="1.1" />
      </>
    ) : (
      <>
        <ellipse cx="60" cy="60" rx="56" ry="40" fill="none" strokeWidth="3.2" />
        <ellipse cx="60" cy="60" rx="49" ry="33" fill="none" strokeWidth="1.1" />
      </>
    );
  const room = shape === 'oval' ? 70 : 80;
  return (
    <>
      {outline}
      <text x="60" y="47" className="pp-arc" fontSize={fit(country, 10.5, room)} textAnchor="middle">{country}</text>
      <text x="60" y="67" className="pp-big" fontSize="15" textAnchor="middle">{stamp.date.toUpperCase()}</text>
      <text x="60" y="82" className="pp-arc" fontSize="8" textAnchor="middle">{`✈ ${stamp.code} · ${stamp.iata}`}</text>
    </>
  );
}

function Stamp({ stamp, active, onFocus, stampedIn }) {
  const look = lookFor(stamp);
  const id = `pp-${stamp.code}`;
  const label = stamp.home
    ? `${stamp.country}, home, ${stamp.visits} stops`
    : `${stamp.country}, first entry ${stamp.city} ${stamp.date}, ${stamp.visits} ${stamp.visits === 1 ? 'stop' : 'stops'}`;
  return (
    <button
      type="button"
      className={`pp-stamp${stampedIn ? ' pp-in' : ''}${active ? ' pp-active' : ''}`}
      style={{
        '--tilt': `${look.tilt}deg`,
        '--dx': `${look.dx}px`,
        '--dy': `${look.dy}px`,
        '--delay': `${stamp.index * 0.16}s`,
        color: look.ink,
      }}
      aria-label={label}
      onMouseEnter={onFocus}
      onFocus={onFocus}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true" stroke="currentColor" fill="currentColor">
        <g filter="url(#pp-ink)">
          {look.shape === 'circle' ? <CircleStamp stamp={stamp} id={id} /> : <BoxStamp stamp={stamp} shape={look.shape} />}
        </g>
      </svg>
    </button>
  );
}

function caption(stamp) {
  if (!stamp) return 'Hover a stamp for its entry';
  if (stamp.home) return `${stamp.country} · home · ${stamp.visits} stops`;
  const stops = `${stamp.visits} ${stamp.visits === 1 ? 'stop' : 'stops'}`;
  return `${stamp.country} · first entry ${stamp.city}, ${stamp.date} · ${stops}`;
}

/**
 * The passport spread: one ink stamp per country, in order of first entry,
 * split across two facing VISAS pages. Stamps press in one after another the
 * first time the spread scrolls into view; hovering or focusing one reads its
 * entry out in the page footer.
 */
function Passport({ stamps }) {
  const ref = useRef(null);
  const [stampedIn, setStampedIn] = useState(false);
  const [activeCode, setActiveCode] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setStampedIn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStampedIn(true);
          io.disconnect();
        }
      },
      // Fire once the spread's top edge is a quarter of the way up the screen,
      // rather than a share of its height, so a tall stacked spread on a short
      // phone still triggers.
      { rootMargin: '0px 0px -25% 0px' }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  if (!stamps || stamps.length === 0) return null;
  const half = Math.ceil(stamps.length / 2);
  const pages = [stamps.slice(0, half), stamps.slice(half)];
  const active = stamps.find((s) => s.code === activeCode);

  return (
    <div className="pp-book" ref={ref} onMouseLeave={() => setActiveCode(null)}>
      <svg width="0" height="0" className="pp-defs" aria-hidden="true" focusable="false">
        <filter id="pp-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" result="wobbly" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="speck" />
          <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="mask" />
          <feComposite in="wobbly" in2="mask" operator="in" />
        </filter>
      </svg>
      {pages.map((page, p) => (
        <div className={`pp-page pp-page-${p === 0 ? 'left' : 'right'}`} key={p}>
          <div className="pp-head">
            <span>Visas</span>
            <span>{p === 0 ? 'Riwa Hoteit' : 'RWA · Intl'}</span>
          </div>
          <div className="pp-grid">
            {page.map((s) => (
              <Stamp
                key={s.code}
                stamp={s}
                stampedIn={stampedIn}
                active={s.code === activeCode}
                onFocus={() => setActiveCode(s.code)}
              />
            ))}
          </div>
          <div className="pp-foot">
            {p === 0 ? (
              <span className="pp-caption" aria-live="polite">{caption(active)}</span>
            ) : (
              <span>{`${stamps.length} countries`}</span>
            )}
            <span className="pp-pageno">{p === 0 ? '14' : '15'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Passport;
