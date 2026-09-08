import { useState, useId, useMemo } from 'react';
import { days, HOUSE, mappedStops } from '../../Utils/londonData';
import { PLACED, TREES } from '../../Utils/landmarkPlacements';
import { Castle, Tree, Roundel, Owl } from './Landmarks';
import { LON0, LON1, LAT0, LAT1, W, H, MILE, THAMES, PARKS, ROADS, BRIDGES, ROUNDELS, PLACES, LON_TICKS, LAT_TICKS, WIZARDING } from '../../Utils/londonGeo';

const px = (lon) => ((lon - LON0) / (LON1 - LON0)) * W;
const py = (lat) => ((LAT1 - lat) / (LAT1 - LAT0)) * H;
const P = (lon, lat) => [px(lon), py(lat)];
const PP = (pts) => pts.map(([o, a]) => P(o, a));

/* ---- geometry: Catmull-Rom → béziers, sampled for footprints and hatching ---- */
function segs(pts, k = 10) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    out.push([p1, [p1[0] + (p2[0] - p0[0]) / k, p1[1] + (p2[1] - p0[1]) / k], [p2[0] - (p3[0] - p1[0]) / k, p2[1] - (p3[1] - p1[1]) / k], p2]);
  }
  return out;
}
const bez = ([a, b, c, d], t) => { const m = 1 - t; return [
  m*m*m*a[0] + 3*m*m*t*b[0] + 3*m*t*t*c[0] + t*t*t*d[0], m*m*m*a[1] + 3*m*m*t*b[1] + 3*m*t*t*c[1] + t*t*t*d[1]]; };
function pathD(pts, k) {
  const s = segs(pts, k); if (!s.length) return '';
  return `M ${s[0][0][0].toFixed(1)} ${s[0][0][1].toFixed(1)} ` + s.map(([, c1, c2, p]) =>
    `C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
}
const closedD = (pts) => pathD([...pts, pts[0], pts[1]], 6) + ' Z';
function along(pts, step) {
  const out = []; let acc = 0, next = step * 0.5, prev = null;
  for (const sg of segs(pts)) for (let i = 0; i <= 28; i++) {
    const p = bez(sg, i / 28);
    if (prev) { const dx = p[0] - prev[0], dy = p[1] - prev[1], d = Math.hypot(dx, dy);
      while (d > 0 && acc + d >= next) { const f = (next - acc) / d; out.push({ x: prev[0] + dx * f, y: prev[1] + dy * f, a: Math.atan2(dy, dx) }); next += step; }
      acc += d; }
    prev = p;
  }
  return out;
}

const SOLE = 'M0,-6.2 C3,-6.2 4.2,-3.6 3.8,-1 C3.4,1.6 2,2.8 0,2.8 C-2,2.8 -3.4,1.6 -3.8,-1 C-4.2,-3.6 -3,-6.2 0,-6.2 Z';
const HEEL = 'M0,4.4 C1.6,4.4 2.3,5.3 2.3,6.3 C2.3,7.4 1.3,8.1 0,8.1 C-1.3,8.1 -2.3,7.4 -2.3,6.3 C-2.3,5.3 -1.6,4.4 0,4.4 Z';
const Print = () => <><path d={SOLE} /><path d={HEEL} /></>;

function Footprints({ pts, ink, step = 17, scale = 0.9 }) {
  const steps = useMemo(() => along(pts, step), [pts, step]);
  return (
    <g fill={ink}>
      {steps.map((s, i) => { const side = i % 2 ? 1 : -1; const nx = -Math.sin(s.a) * 4.2 * side, ny = Math.cos(s.a) * 4.2 * side; const deg = (s.a * 180) / Math.PI + 90;
        return <g key={i} transform={`translate(${(s.x + nx).toFixed(1)} ${(s.y + ny).toFixed(1)}) rotate(${deg.toFixed(1)}) scale(${scale})`} opacity={0.84 - (i % 3) * 0.06}><Print /></g>; })}
    </g>
  );
}
function Hatching({ pts }) {
  const t = useMemo(() => along(pts, 13), [pts]);
  return (
    <g stroke="var(--ld-ink-soft)" strokeWidth="0.8" strokeLinecap="round">
      {t.map((s, i) => { const nx = -Math.sin(s.a), ny = Math.cos(s.a), j = (i % 2) * 1.4;
        return [-1, 1].map((side) => <line key={`${i}${side}`} x1={s.x + nx * side * 11} y1={s.y + ny * side * 11} x2={s.x + nx * side * (15.5 + j)} y2={s.y + ny * side * (15.5 + j)} />); })}
    </g>
  );
}

/**
 * A pair of feet that walks the route with a name in a ribbon over it, the
 * Marauder's Map's own device. The feet turn with the path; the ribbon does not.
 */
function Walker({ pathId, name, begin, ink, dur }) {
  return (
    <g className="ld-walker" style={{ animationDelay: `${begin}s` }}>
      <g>
        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" rotate="auto"><mpath href={`#${pathId}`} /></animateMotion>
        <g transform="rotate(90)" fill={ink}>
          <g transform="translate(-4.4 2)"><Print /></g>
          <g transform="translate(4.4 -5)"><Print /></g>
        </g>
      </g>
      <g>
        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite"><mpath href={`#${pathId}`} /></animateMotion>
        <g transform="translate(0 -21)">
          <path d="M-27,-8 L27,-8 L23,0 L27,8 L-27,8 L-23,0 Z" fill="var(--ld-parch-1)" stroke="var(--ld-ink)" strokeWidth="1" />
          <text y="3.4" className="ld-m-banner">{name}</text>
        </g>
      </g>
    </g>
  );
}

const CORNER = 'M0,26 C0,10 10,0 26,0 M4,26 C6,14 14,6 26,4 M0,40 c0,-4 3,-7 7,-7 M40,0 c-4,0 -7,3 -7,7';
function Frame({ filter }) {
  return (
    <g fill="none" stroke="var(--ld-ink)" strokeLinecap="round" filter={filter}>
      <rect x="10" y="10" width={W - 20} height={H - 20} strokeWidth="1.6" opacity="0.8" />
      <rect x="17" y="17" width={W - 34} height={H - 34} strokeWidth="0.7" opacity="0.55" />
      {[[22, 22, 0], [W - 22, 22, 90], [W - 22, H - 22, 180], [22, H - 22, 270]].map(([x, y, r]) => (
        <path key={r} d={CORNER} strokeWidth="1.1" opacity="0.8" transform={`translate(${x} ${y}) rotate(${r})`} />))}
    </g>
  );
}
function Ribbon({ x, y, w, text, sub }) {
  const h = 42, n = 11;
  const d = `M${x - w/2},${y - h/2} L${x + w/2},${y - h/2} L${x + w/2 - n},${y} L${x + w/2},${y + h/2} L${x - w/2},${y + h/2} L${x - w/2 + n},${y} Z`;
  return (
    <g>
      <path d={d} fill="var(--ld-parch-1)" stroke="var(--ld-ink)" strokeWidth="1.2" opacity="0.96" />
      <path d={`M${x - w/2 + 6},${y - h/2 + 5} L${x + w/2 - 6},${y - h/2 + 5} M${x - w/2 + 6},${y + h/2 - 5} L${x + w/2 - 6},${y + h/2 - 5}`} stroke="var(--ld-ink)" strokeWidth="0.6" opacity="0.5" fill="none" />
      <text x={x} y={y - 3} className="ld-m-ribbon">{text}</text>
      <text x={x} y={y + 12} className="ld-m-ribbon-s">{sub}</text>
    </g>
  );
}

/* foxing: a seeded scatter of age spots, thicker toward the edges of the sheet */
const FOX = (() => { let s = 7; const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647; const out = [];
  for (let i = 0; i < 140; i++) { const ex = rnd(), ey = rnd(); const edge = Math.max(Math.abs(ex - 0.5), Math.abs(ey - 0.5)) * 2;
    if (rnd() > 0.25 + edge * 0.7) continue; out.push([ex * W, ey * H, 0.5 + rnd() * 1.6, 0.08 + rnd() * 0.2]); } return out; })();

const LAB = { r: [11, 4, 'start'], l: [-11, 4, 'end'], t: [0, -12, 'middle'], b: [0, 17, 'middle'] };
const lean = (i) => ((i % 5) - 2) * 0.9;   // a hand's unevenness on the lettering

/**
 * The Marauder's Map of London, at true aspect. Roads, bridges and roundels give
 * the parchment structure; landmarks stand on their coordinates; the places the
 * films were actually shot are marked; each day's route is walked in footprints,
 * and two named pairs of feet keep walking it.
 *
 * @param {string|null} active  isolated day id, or null for all
 * @param {Function} onActive   setter for the isolated day
 * @param {string|null} walk    day whose route the walkers follow by default (today, on the trip)
 * @param {string} [only]       mini mode: render just this day, no chrome
 * @param {boolean} [revealed]  false = blank parchment until the oath is spoken (main map only)
 */
function LondonMap({ active = null, onActive, walk = null, only, revealed = true }) {
  const inked = !!only || revealed;               // mini maps are never gated
  const uid = useId().replace(/:/g, '');
  const [hover, setHover] = useState(null);
  const mini = !!only, iso = only || active;
  const GS = mini ? 0.95 : 0.72;
  const visible = (id) => !iso || iso === id;
  const shownDays = mini ? days.filter((d) => d.id === only) : days;
  const stops = mappedStops().filter((s) => !mini || s.dayId === only);
  const thames = PP(THAMES), thamesD = pathD(thames);
  const [ex, ey] = P(-0.1337, 51.5282);
  const offPts = [[ex, ey], [(ex + 232) / 2 - 6, (ey + 22) / 2 + 8], [232, 22]];
  const route = (d) => d.stops.filter((s) => s.geo && s.major).map((s) => P(s.geo.lon, s.geo.lat));
  const walkDay = days.find((d) => d.id === (iso || walk)) || days[0];
  const walkPts = route(walkDay);
  const walkId = `${uid}-walk`;
  const hand = `url(#${uid}-hand)`;
  const tip = (x, y, title, sub, ink) => setHover({ x, y, title, sub, ink });

  return (
    <figure className={`ld-map${mini ? ' ld-map-mini' : ''}`}>
      <div className="ld-map-plate">
        <svg key={inked ? 'inked' : 'blank'} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={mini ? 'Map of this day’s route' : inked ? 'Marauder’s Map of central London with each day walked as a footprint trail' : 'A blank sheet of aged parchment'}>
          <defs>
            <linearGradient id={`${uid}-parch`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--ld-parch-1)" /><stop offset="0.55" stopColor="var(--ld-parch-2)" /><stop offset="1" stopColor="var(--ld-parch-3)" />
            </linearGradient>
            <radialGradient id={`${uid}-vig`} cx="0.5" cy="0.5" r="0.72"><stop offset="0.62" stopColor="rgba(0,0,0,0)" /><stop offset="1" stopColor="var(--ld-vignette)" /></radialGradient>
            {[0, 1, 2, 3, 4].map((i) => (
              <radialGradient key={i} id={`${uid}-st${i}`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="var(--ld-stain)" stopOpacity="0.22" /><stop offset="0.6" stopColor="var(--ld-stain)" stopOpacity="0.07" /><stop offset="1" stopColor="var(--ld-stain)" stopOpacity="0" /></radialGradient>))}
            {/* paper fibre */}
            <filter id={`${uid}-grain`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="2" result="n" />
              <feColorMatrix in="n" type="saturate" values="0" result="g" />
              <feComponentTransfer in="g"><feFuncA type="linear" slope="0.55" intercept="-0.12" /></feComponentTransfer>
            </filter>
            {/* crease shading: a shadow side and a highlight side */}
            <linearGradient id={`${uid}-vfold`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="var(--ld-fold-dk)" stopOpacity="0" /><stop offset="0.62" stopColor="var(--ld-fold-dk)" stopOpacity="0.55" /><stop offset="0.66" stopColor="var(--ld-fold-dk)" stopOpacity="0.9" /><stop offset="0.7" stopColor="var(--ld-fold-lt)" stopOpacity="0.9" /><stop offset="1" stopColor="var(--ld-fold-lt)" stopOpacity="0" /></linearGradient>
            <linearGradient id={`${uid}-hfold`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--ld-fold-dk)" stopOpacity="0" /><stop offset="0.62" stopColor="var(--ld-fold-dk)" stopOpacity="0.55" /><stop offset="0.66" stopColor="var(--ld-fold-dk)" stopOpacity="0.9" /><stop offset="0.7" stopColor="var(--ld-fold-lt)" stopOpacity="0.9" /><stop offset="1" stopColor="var(--ld-fold-lt)" stopOpacity="0" /></linearGradient>
            {/* a quill's wobble, for anything drawn rather than lettered */}
            <filter id={`${uid}-hand`} x="-4%" y="-4%" width="108%" height="108%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="5" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <clipPath id={`${uid}-inner`}><rect x="17" y="17" width={W - 34} height={H - 34} /></clipPath>
            {inked && shownDays.map((d, i) => (
              <mask key={d.id} id={`${uid}-rv-${d.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                <path d={pathD(route(d))} fill="none" stroke="#fff" strokeWidth="24" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="ld-reveal" style={{ animationDelay: `${mini ? 0.2 : 0.4 + i * 0.6}s` }} />
                {d.id === 'thu' && <path d={pathD(offPts)} fill="none" stroke="#fff" strokeWidth="24" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="ld-reveal" style={{ animationDelay: `${mini ? 0.2 : 0.4 + i * 0.6}s` }} />}
              </mask>))}
            {inked && walkPts.length > 1 && <path id={walkId} d={pathD(walkPts)} fill="none" />}
          </defs>

          <rect width={W} height={H} fill={`url(#${uid}-parch)`} />
          {[[150, 80, 70], [830, 400, 95], [600, 110, 55], [280, 440, 75], [920, 190, 45]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${uid}-st${i})`} />)}
          {/* the sheet itself: fibre, six folded panels, creases, wear, foxing */}
          <rect width={W} height={H} filter={`url(#${uid}-grain)`} opacity="0.5" className="ld-grain" />
          {!mini && (<g className="ld-paper">
            {[[0, 0], [1, 1], [2, 0]].map(([c, r]) => <rect key={`${c}${r}`} x={(c * W) / 3} y={(r * H) / 2} width={W / 3} height={H / 2} fill="var(--ld-facet)" />)}
            {[W / 3, (2 * W) / 3].map((x) => <rect key={x} x={x - 20} y="0" width="30" height={H} fill={`url(#${uid}-vfold)`} opacity="0.68" />)}
            <rect x="0" y={H / 2 - 20} width={W} height="30" fill={`url(#${uid}-hfold)`} opacity="0.68" />
            {[W / 3, (2 * W) / 3].map((x) => (
              <g key={`w${x}`} transform={`translate(${x} ${H / 2})`}>
                <ellipse rx="11" ry="6.5" fill="var(--ld-parch-1)" opacity="0.6" transform="rotate(-18)" />
                <path d="M-6,-2 l3,1 M2,3 l4,-1 M-1,-5 l2,2" stroke="var(--ld-fold-dk)" strokeWidth="0.9" opacity="0.6" />
              </g>))}
            {FOX.map(([x, y, r, o], i) => <circle key={i} cx={x} cy={y} r={r} fill="var(--ld-fox)" opacity={o} />)}
          </g>)}

          {inked && (<g clipPath={`url(#${uid}-inner)`} className="ld-ink">
            {PARKS.map((pk, i) => <path key={i} d={closedD(PP(pk))} fill="var(--ld-green)" opacity="0.5" stroke="var(--ld-ink-soft)" strokeWidth="0.7" strokeDasharray="2 3" />)}
            <g fill="none" stroke="var(--ld-ink)" strokeWidth="1.1" strokeLinecap="round" opacity="0.34" filter={hand}>
              {ROADS.map((r, i) => <path key={i} d={pathD(PP(r), 12)} />)}
            </g>

            <path d={thamesD} fill="none" stroke="var(--ld-river)" strokeWidth="20" strokeLinecap="round" opacity="0.5" />
            <g fill="none" stroke="var(--ld-ink)" strokeWidth="1" strokeLinecap="round" opacity="0.6" filter={hand}>
              <path d={thamesD} transform="translate(0 -9.5)" /><path d={thamesD} transform="translate(0 9.5)" />
            </g>
            <Hatching pts={thames} />
            <g filter={hand}>
              {BRIDGES.map((b, i) => { const [x, y] = P(b.lon, b.lat); return (
                <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${b.a})`} stroke="var(--ld-ink)" strokeWidth="1.1" opacity="0.85">
                  <line x1="-2.6" y1="-15" x2="-2.6" y2="15" /><line x1="2.6" y1="-15" x2="2.6" y2="15" /><path d="M-2.6,-15 h5.2 M-2.6,15 h5.2" /></g>); })}
            </g>
            <text x={px(-0.056)} y={py(51.5028)} className="ld-m-river" transform={`rotate(-4 ${px(-0.056)} ${py(51.5028)})`}>River Thames</text>

            {/* landmarks stand on their coordinates; footprints walk over them */}
            <g className="ld-lm" opacity={mini ? 0.7 : 0.9}>
              {TREES.map(([lon, lat], i) => { const [x, y] = P(lon, lat); return <g key={`t${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${GS * 1.1})`}><Tree /></g>; })}
              {!mini && ROUNDELS.map(([lon, lat], i) => { const [x, y] = P(lon, lat); return <g key={`r${i}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${GS})`}><Roundel /></g>; })}
              {PLACED.map(({ C, n, lon, lat }, i) => { const [x, y] = P(lon, lat); return (
                <g key={i} className="ld-lm-hit" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${GS})`}
                  onMouseEnter={mini ? undefined : () => tip(x, y - 18, n, null, 'var(--ld-ink)')} onMouseLeave={mini ? undefined : () => setHover(null)}><C /></g>); })}
              {!mini && <><g transform="translate(215 60) scale(0.6)"><Castle /></g><text x="215" y="74" className="ld-m-off">Leavesden</text>
                <g transform="translate(852 116) scale(0.9)" className="ld-lm-hit ld-owl" onMouseEnter={() => tip(852, 96, 'Hedwig, with the post', null, 'var(--ld-ink)')} onMouseLeave={() => setHover(null)}><Owl /></g></>}
            </g>

            {!mini && PLACES.map((p, i) => { const x = px(p.lon), y = py(p.lat); return <text key={p.n} x={x} y={y} transform={`rotate(${lean(i)} ${x} ${y})`} className="ld-m-place">{p.n}</text>; })}

            {/* where the films were shot */}
            {!mini && WIZARDING.map((w, i) => { const [x, y] = P(w.lon, w.lat); const [lx, ly, anchor] = LAB[w.side]; return (
              <g key={w.n} className="ld-wiz" onMouseEnter={() => tip(x, y, w.n, w.sub, 'var(--ld-ink)')} onMouseLeave={() => setHover(null)}>
                <circle cx={x} cy={y} r="9" fill="transparent" />
                <circle cx={x} cy={y} r="6.5" fill="none" stroke="var(--ld-ink-soft)" strokeWidth="0.8" strokeDasharray="1.6 2.2" />
                <text x={x} y={y + 3.2} className="ld-m-wizstar">✦</text>
                <text x={x + lx} y={y + (ly === 4 ? 3.5 : ly)} textAnchor={anchor} transform={`rotate(${lean(i + 2)} ${x} ${y})`} className="ld-m-wiz">{w.n}</text>
              </g>); })}

            {shownDays.map((d) => { const pts = route(d); if (pts.length < 2) return null; return (
              <g key={d.id} mask={`url(#${uid}-rv-${d.id})`} className="ld-trail" opacity={visible(d.id) ? 1 : 0.07}>
                <Footprints pts={pts} ink={HOUSE[d.house].ink} scale={mini ? 1.05 : 0.9} />
                {d.id === 'thu' && <Footprints pts={offPts} ink={HOUSE[d.house].ink} scale={mini ? 1.05 : 0.9} />}
              </g>); })}

            {stops.map((s, i) => {
              const [x, y] = P(s.geo.lon, s.geo.lat), on = visible(s.dayId), key = `${s.dayId}-${i}`, ink = HOUSE[s.house].ink;
              const dIdx = days.findIndex((d) => d.id === s.dayId);
              const labelled = s.major && (s.kind === 'magic' || iso === s.dayId);
              const [lx, ly, anchor] = LAB[s.lab || 'r'];
              return (
                <g key={key} className="ld-pin" style={{ animationDelay: `${mini ? 0.6 : 1.1 + dIdx * 0.6}s` }} opacity={on ? 1 : 0.1}
                  tabIndex={mini || !on ? -1 : 0} role={mini ? undefined : 'button'} aria-label={`${s.name}, ${s.t}, day ${s.dayN}`}
                  onMouseEnter={mini ? undefined : () => tip(x, y, s.name, `${s.t}, day ${s.dayN}`, ink)} onMouseLeave={mini ? undefined : () => setHover(null)}
                  onFocus={mini ? undefined : () => tip(x, y, s.name, `${s.t}, day ${s.dayN}`, ink)} onBlur={mini ? undefined : () => setHover(null)}>
                  <circle cx={x} cy={y} r="12" fill="transparent" />
                  {s.major ? (<>
                    <circle cx={x} cy={y} r={hover?.title === s.name ? 6.5 : 5} fill="var(--ld-parch-1)" stroke={ink} strokeWidth="1.7" className="ld-pin-dot" />
                    <circle cx={x} cy={y} r="1.9" fill={ink} />
                    {s.kind === 'magic' && <circle cx={x} cy={y} r="9.5" fill="none" stroke={ink} strokeWidth="0.9" strokeDasharray="2 2.5" opacity="0.75" />}
                  </>) : <circle cx={x} cy={y} r="2.4" fill={ink} opacity="0.85" className="ld-pin-dot" />}
                  {labelled && <text x={x + lx} y={y + ly} textAnchor={anchor} transform={`rotate(${lean(i)} ${x} ${y})`} className="ld-m-label" style={{ fill: ink }}>{s.kind === 'magic' ? '✦ ' : ''}{s.name}</text>}
                </g>);
            })}

            {/* the two of them, walking it */}
            {walkPts.length > 1 && (
              <g className="ld-walkers">
                <Walker pathId={walkId} name="Riwa" begin={mini ? 1.4 : 3.8} dur={mini ? 18 : 26} ink={HOUSE[walkDay.house].ink} />
                <Walker pathId={walkId} name="Charbel" begin={mini ? 3.0 : 5.6} dur={mini ? 18 : 26} ink={HOUSE[walkDay.house].ink} />
              </g>)}
          </g>)}

          {!mini && inked && (<g className="ld-ink">
            <g className="ld-m-tick" stroke="var(--ld-ink)" strokeWidth="0.8" opacity="0.7">
              {LON_TICKS.map((t) => { const x = px(t.v); return <g key={t.v}><line x1={x} y1="10" x2={x} y2="17" /><text x={x} y="27" textAnchor="middle" className="ld-m-tick-t">{t.label}</text></g>; })}
              {LAT_TICKS.map((t) => { const y = py(t.v); return <g key={t.v}><line x1={W - 17} y1={y} x2={W - 10} y2={y} /><text x={W - 21} y={y + 3} textAnchor="end" className="ld-m-tick-t">{t.label}</text></g>; })}
            </g>
            <g transform={`translate(${W - 62} 100)`} fill="none" stroke="var(--ld-ink)" strokeWidth="1">
              <circle r="21" opacity="0.8" /><circle r="2.6" fill="var(--ld-ink)" stroke="none" />
              <path d="M0,-19 L4,-3.5 L0,-6 L-4,-3.5 Z" fill="var(--ld-ink)" stroke="none" />
              <path d="M0,19 L4,3.5 L0,6 L-4,3.5 Z M-19,0 L-3.5,-4 L-6,0 L-3.5,4 Z M19,0 L3.5,-4 L6,0 L3.5,4 Z" opacity="0.8" />
              <text y="-26" className="ld-m-n">N</text>
            </g>
            <Ribbon x={W / 2} y={42} w={410} text="The Marauder’s Map of London" sub="being a true plan of five days in September, MMXXVI" />
            <g transform={`translate(${W - 40 - MILE} ${H - 40})`} stroke="var(--ld-ink)" strokeWidth="1" opacity="0.8">
              <line x1="0" y1="0" x2={MILE} y2="0" /><line x1="0" y1="-4" x2="0" y2="4" /><line x1={MILE / 2} y1="-3" x2={MILE / 2} y2="3" /><line x1={MILE} y1="-4" x2={MILE} y2="4" />
              <text x={MILE / 2} y="-7" textAnchor="middle" className="ld-m-tick-t" stroke="none">one mile</text>
            </g>
            <text x="30" y={H - 22} className="ld-m-foot">Messrs Moony, Wormtail, Padfoot &amp; Prongs are proud to present this map to Miss Riwa Hoteit</text>
          </g>)}
          <rect width={W} height={H} fill={`url(#${uid}-vig)`} pointerEvents="none" />
          <Frame filter={hand} />
        </svg>

        {hover && !mini && inked && (
          <div className="ld-tip" role="status" style={{ left: `${(hover.x / W) * 100}%`, top: `${(hover.y / H) * 100}%`, '--tip-ink': hover.ink }}>
            <span className="ld-tip-n">{hover.title}</span>{hover.sub && <span className="ld-tip-s">{hover.sub}</span>}
          </div>)}
      </div>

      {!mini && (
        <figcaption className={`ld-legend${inked ? '' : ' is-hidden'}`} aria-hidden={!inked}>
          <button type="button" className={`ld-lg${!active ? ' is-on' : ''}`} onClick={() => onActive(null)}>All five days</button>
          {days.map((d) => (
            <button key={d.id} type="button" className={`ld-lg${active === d.id ? ' is-on' : ''}`} style={{ '--lg-ink': HOUSE[d.house].ink }} onClick={() => onActive(active === d.id ? null : d.id)}>
              <svg viewBox="-5 -7 10 16" width="11" height="17" className="ld-lg-foot" aria-hidden="true"><Print /></svg>{d.dow}
            </button>))}
          <span className="ld-legend-note">Pick a day and watch where the footprints go.</span>
        </figcaption>)}
    </figure>
  );
}

export default LondonMap;
