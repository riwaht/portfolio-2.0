import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageMasthead from './PageMasthead';
import LondonMap from './London/LondonMap';
import BirthdayCake from './London/BirthdayCake';
import { trip, days, HOUSE, KIND, stats } from '../Utils/londonData';
import '../styles.css';

const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

const TRIP_DAYS = ['2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13'];
/* If today is one of the five days, its id, so the footprints walk today's route. */
function todayId() {
  const d = new Date(); const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const i = TRIP_DAYS.indexOf(iso); return i === -1 ? null : days[i].id;
}

function daysOut() {
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((Date.UTC(2026, 8, 9) - today) / 86400000);
}

const SOLE = 'M0,-6.2 C3,-6.2 4.2,-3.6 3.8,-1 C3.4,1.6 2,2.8 0,2.8 C-2,2.8 -3.4,1.6 -3.8,-1 C-4.2,-3.6 -3,-6.2 0,-6.2 Z';
const HEEL = 'M0,4.4 C1.6,4.4 2.3,5.3 2.3,6.3 C2.3,7.4 1.3,8.1 0,8.1 C-1.3,8.1 -2.3,7.4 -2.3,6.3 C-2.3,5.3 -1.6,4.4 0,4.4 Z';
/** A single footprint, used as the timeline node so the days walk like the map. */
function Foot({ flip }) {
  return (
    <svg viewBox="-6 -7 12 16" width="12" height="16" className="ld-foot" aria-hidden="true" style={flip ? { transform: 'scaleX(-1) rotate(8deg)' } : { transform: 'rotate(-8deg)' }}>
      <path d={SOLE} /><path d={HEEL} />
    </svg>
  );
}

/** An ink flourish, drawn between days. */
function Flourish() {
  /* A golden snitch between the days: the ball, two long wings, and a hairline rule either side. */
  return (
    <svg viewBox="0 0 240 24" className="ld-flourish" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4,12 L86,12 M154,12 L236,12" opacity="0.6" />
      <path d="M113,12 C104,4 92,2 84,4 C90,7 95,9 100,10 C93,10 88,11 84,13 C92,14 104,14 113,12 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M127,12 C136,4 148,2 156,4 C150,7 145,9 140,10 C147,10 152,11 156,13 C148,14 136,14 127,12 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M113,12 C104,4 92,2 84,4 M113,12 C100,10 90,11 84,13 M127,12 C136,4 148,2 156,4 M127,12 C140,10 150,11 156,13" />
      <circle cx="120" cy="12" r="6.2" fill="var(--ld-snitch)" stroke="currentColor" />
      <path d="M116,9.5 C118,8 122,8 124,9.5 M114.5,12 h11 M116,14.5 C118,16 122,16 124,14.5" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

/** The wax seal: the one oxblood mark, pressed onto the ticket stub. */
function Seal() {
  return (
    <svg className="ld-seal" viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2;
        return <circle key={i} cx={50 + Math.cos(a) * 41} cy={50 + Math.sin(a) * 41} r="4.2" className="ld-seal-wax" />; })}
      <circle cx="50" cy="50" r="41" className="ld-seal-wax" />
      <circle cx="50" cy="50" r="33" className="ld-seal-ring" />
      <text x="50" y="60" className="ld-seal-mono">R</text>
    </svg>
  );
}

/** A rubber stamp: station and date on a circle, struck at an angle. */
function Stamp() {
  return (
    <svg className="ld-stamp" viewBox="0 0 120 120" aria-hidden="true">
      <defs><path id="ld-stamp-arc" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
      <circle cx="60" cy="60" r="52" /><circle cx="60" cy="60" r="36" />
      <text className="ld-stamp-t"><textPath href="#ld-stamp-arc" startOffset="0">ST PANCRAS INTERNATIONAL · IX · MMXXVI · </textPath></text>
      <text x="60" y="66" className="ld-stamp-c">9 IX</text>
    </svg>
  );
}

/** The ticket: Platform 9¾ as the centrepiece, both legs, admit two, stamped. */
function Ticket() {
  return (
    <div className="ld-ticket">
      <div className="ld-tk-stub">
        <span className="ld-tk-admit">Admit two</span>
        <Seal />
        <span className="ld-tk-no">№ 0910 · 26</span>
      </div>
      <div className="ld-tk-body">
        <div className="ld-tk-rule" aria-hidden="true" />
        <div className="ld-tk-head">Eurostar · Paris to London &amp; back again</div>
        <div className="ld-tk-plat">
          <span className="ld-tk-plat-l">Platform</span>
          <span className="ld-tk-plat-n">9<sup>¾</sup></span>
        </div>
        <div className="ld-tk-legs">
          {[trip.out, trip.back].map((leg, i) => (
            <div className="ld-tk-leg" key={leg.service}>
              <div className="ld-tk-end"><b>{leg.dep}</b><span>{leg.from}</span></div>
              <div className="ld-tk-mid" aria-hidden="true"><span className="ld-tk-line" /><span className="ld-tk-arrow">{i === 0 ? '→' : '←'}</span><span className="ld-tk-line" /></div>
              <div className="ld-tk-end ld-tk-end-r"><b>{leg.arr}</b><span>{leg.to}</span></div>
              <div className="ld-tk-meta">{leg.date}, {leg.service}</div>
            </div>
          ))}
        </div>
        <div className="ld-tk-foot">Four nights at {trip.hotel.name}, {trip.hotel.address}. The Leaky Cauldron was full.</div>
        <div className="ld-tk-rule" aria-hidden="true" />
        <Stamp />
      </div>
    </div>
  );
}

/** One day: a Roman numeral, its own small map, the hours walked in footprints. */
/* A photograph paper-clipped beside the hour it belongs to. Square print, cream border,
   a thumb of tape. The prints alternate sides and vary in size, lean and tape so the
   page reads like a scrapbook rather than a column. Deterministic per position. */
const POL_VARIANTS = [
  { side: 'r', size: 'm', tilt: -2.4, tape: 'c',  y: 0 },
  { side: 'l', size: 's', tilt: 2.1,  tape: 'tl', y: 6 },
  { side: 'r', size: 'l', tilt: 1.4,  tape: 'tr', y: -4 },
  { side: 'l', size: 'm', tilt: -1.6, tape: 'c',  y: 10 },
  { side: 'r', size: 's', tilt: 2.8,  tape: 'tl', y: 2 },
  { side: 'l', size: 'l', tilt: -2.9, tape: 'tr', y: -6 },
  { side: 'r', size: 'm', tilt: 1.1,  tape: 'c',  y: 8 },
];
function polVariant(n) { return POL_VARIANTS[n % POL_VARIANTS.length]; }
function Polaroid({ slug, name, v }) {
  return (
    <figure className={`ld-pol is-${v.size} tape-${v.tape}`} style={{ '--ld-tilt': `${v.tilt}deg`, '--ld-y': `${v.y}px` }}>
      <span className="ld-pol-tape" aria-hidden="true" />
      <img src={`/Images/london/polaroids/${slug}.jpg`} alt="" loading="lazy" decoding="async" width="480" height="480" />
      <figcaption className="ld-pol-cap">{name}</figcaption>
    </figure>
  );
}

/* A golden snitch loose in the page: drifts across the viewport, bobbing, wings fluttering.
   Pointer-events off, low opacity, hidden for reduced motion and on small screens. */
function Snitch() {
  return (
    <div className="ld-snitch" aria-hidden="true">
      <div className="ld-snitch-bob">
        <svg viewBox="0 0 64 24" width="56" height="21">
          <g className="ld-snitch-wing ld-snitch-wing-l" fill="var(--ld-snitch)" fillOpacity="0.55" stroke="var(--ld-ink)" strokeWidth="0.8" strokeLinejoin="round">
            <path d="M26,12 C18,3 8,1 1,4 C7,7 12,9 17,10 C11,10 6,11 1,13 C9,15 19,15 26,12 Z" />
          </g>
          <g className="ld-snitch-wing ld-snitch-wing-r" fill="var(--ld-snitch)" fillOpacity="0.55" stroke="var(--ld-ink)" strokeWidth="0.8" strokeLinejoin="round">
            <path d="M38,12 C46,3 56,1 63,4 C57,7 52,9 47,10 C53,10 58,11 63,13 C55,15 45,15 38,12 Z" />
          </g>
          <circle cx="32" cy="12" r="6.4" fill="var(--ld-snitch)" stroke="var(--ld-ink)" strokeWidth="0.9" />
          <path d="M28,9.4 C30,7.8 34,7.8 36,9.4 M26.4,12 h11.2 M28,14.6 C30,16.2 34,16.2 36,14.6" fill="none" stroke="var(--ld-ink)" strokeWidth="0.7" opacity="0.65" />
        </svg>
      </div>
    </div>
  );
}

function Day({ d, i }) {
  const h = HOUSE[d.house];
  let photoIndex = 0;
  return (
    <section className="ld-day" style={{ '--ld-ink': h.ink }} id={`day-${d.id}`}>
      {i > 0 && <Flourish />}
      <div className="ld-day-grid">
        <div className="ld-day-side">
          <div className="ld-day-n" aria-hidden="true">{ROMAN[i]}</div>
          {d.id === 'thu' && <span className="ld-house-band" title="Hufflepuff" aria-label="Hufflepuff" />}
          <div className="ld-day-kicker">{d.dow} {d.date}</div>
          <h2 className="ld-day-title">{d.title}</h2>
          <p className="ld-day-blurb">{d.blurb}</p>
          <LondonMap only={d.id} />
          {d.id === 'thu' && <BirthdayCake />}
        </div>
        <div className="ld-day-main">
        <ol className="ld-sched" aria-label={`${d.dow} schedule`}>
          {d.stops.map((s, j) => {
            const k = KIND[s.kind] || KIND.sight;
            const v = s.photo ? polVariant(photoIndex++ + i) : null;
            return (
              <li className={`ld-stop${s.major ? ' is-major' : ''}${v ? ` has-photo pol-${v.side}` : ''}`} key={`${d.id}-${j}`}>
                <span className="ld-stop-t">{s.t}</span>
                <span className="ld-stop-rail" aria-hidden="true"><Foot flip={j % 2 === 1} /></span>
                <span className="ld-stop-body">
                  <span className="ld-stop-text">
                    <span className="ld-stop-n"><span className="ld-stop-g" aria-hidden="true">{k.glyph}</span>{s.name}
                      {s.off && <em className="ld-stop-off">{s.off}</em>}</span>
                    {s.note && <span className="ld-stop-note">{s.note}</span>}
                  </span>
                  {v && <Polaroid slug={s.photo} name={s.name} v={v} />}
                </span>
              </li>
            );
          })}
        </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * /itineraries/london: five days in September, as wizarding stationery.
 * The Marauder's Map is the one bold object; its footprints carry through the
 * ticket stub, the day timelines and each day's own small map, so the page reads
 * as a single drawn document rather than a template with a map in it.
 */
function London() {
  const [mapDay, setMapDay] = useState(null);
  const [revealed, setRevealed] = useState(false);   // the map is blank until the oath is spoken
  const [out, setOut] = useState(null);
  const [today, setToday] = useState(null);
  useEffect(() => { setOut(daysOut()); setToday(todayId()); }, []);
  useEffect(() => {
    if (document.querySelector('link[data-ld-font]')) return undefined;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.dataset.ldFont = '1';
    link.href = 'https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap';
    document.head.appendChild(link);
    return undefined;
  }, []);
  // Lumos: a small burst of stars from the wand tip on every click. Skipped for reduced motion.
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const onClick = (e) => {
      const n = 6;
      for (let i = 0; i < n; i++) {
        const el = document.createElement('span');
        el.className = 'ld-spark';
        el.textContent = i % 2 ? '✦' : '✧';
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.6;
        const r = 18 + Math.random() * 22;
        el.style.left = `${e.clientX}px`; el.style.top = `${e.clientY}px`;
        el.style.setProperty('--dx', `${Math.cos(a) * r}px`); el.style.setProperty('--dy', `${Math.sin(a) * r - 10}px`);
        el.style.setProperty('--rot', `${Math.round(Math.random() * 180)}deg`);
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove(), { once: true });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  const live = out === null ? null : out > 1 ? `${out} days out` : out === 1 ? 'Tomorrow' : out === 0 ? 'Today' : 'Documented';

  return (
    <div className="page-container ld">
      <Navbar />
      <Snitch />
      <PageMasthead section="ITINERARY · LHR" eyebrow="nine to thirteen september, twenty twenty-six" title="London" stats={stats} live={live} />

      <div className="ld-wrap">
        <button type="button" className={`ld-oath${revealed ? ' is-spoken' : ''}`} onClick={() => setRevealed(true)}
          aria-pressed={revealed} disabled={revealed}
          aria-label={revealed ? 'The oath has been spoken; the map is revealed' : 'Speak the oath to reveal the map'}>
          <span className="ld-oath-wand" aria-hidden="true">✦</span> I solemnly swear that I am up to no good.
        </button>
        <LondonMap active={mapDay} onActive={setMapDay} walk={today} revealed={revealed} />
        <Ticket />

        <div className="ld-days">{days.map((d, i) => <Day key={d.id} d={d} i={i} />)}</div>


        <p className="ld-managed">Mischief managed.</p>
        <p className="ld-colophon">Drawn up by Charbel.</p>
      </div>
      <Footer />
    </div>
  );
}

export default London;
