/**
 * Pen-and-ink landmark glyphs for the Marauder's Map. Each is authored with its
 * origin at bottom-centre so a building "stands" on its coordinate. Fine sepia
 * strokes, parchment fills, a little hatching: drawn, not iconographic.
 */

const INK = 'var(--ld-ink)';
const FILL = 'var(--ld-parch-2)';
const g = { fill: FILL, stroke: INK, strokeWidth: 1.2, strokeLinejoin: 'round', strokeLinecap: 'round' };
const line = { fill: 'none', stroke: INK, strokeWidth: 0.9, strokeLinecap: 'round' };

const Hatch = ({ d, n = 3, dx = 4, dy = 0 }) => (
  <g {...line} opacity="0.55">{Array.from({ length: n }, (_, i) => <path key={i} d={d} transform={`translate(${i * dx} ${i * dy})`} />)}</g>
);

export const StPauls = () => (
  <g>
    <rect x="-34" y="-22" width="68" height="22" {...g} />
    <rect x="-31" y="-40" width="10" height="18" {...g} /><rect x="21" y="-40" width="10" height="18" {...g} />
    <path d="M-31,-40 C-31,-46 -21,-46 -21,-40 M21,-40 C21,-46 31,-46 31,-40" {...line} />
    <rect x="-14" y="-36" width="28" height="14" {...g} />
    <path d="M-14,-36 C-14,-56 14,-56 14,-36 Z" {...g} />
    <Hatch d="M-8,-40 C-6,-48 0,-51 6,-49" n={3} dx={0} dy={3} />
    <rect x="-3" y="-64" width="6" height="8" {...g} /><path d="M0,-64 L0,-70 M-3,-67 L3,-67" {...line} />
    <path d="M-28,-14 v6 M-20,-14 v6 M-12,-14 v6 M12,-14 v6 M20,-14 v6 M28,-14 v6" {...line} />
  </g>
);

export const TowerBridge = () => (
  <g>
    <path d="M-42,-6 L42,-6" {...line} strokeWidth="1.4" />
    <rect x="-31" y="-38" width="14" height="38" {...g} /><rect x="17" y="-38" width="14" height="38" {...g} />
    <path d="M-31,-38 L-24,-50 L-17,-38 M17,-38 L24,-50 L31,-38" {...g} />
    <path d="M-17,-28 L17,-28 M-17,-24 L17,-24 M-10,-28 v4 M0,-28 v4 M10,-28 v4" {...line} />
    <path d="M-31,-34 C-38,-24 -42,-14 -42,-6 M31,-34 C38,-24 42,-14 42,-6" {...line} />
    <path d="M-27,-30 v4 M-21,-30 v4 M21,-30 v4 M27,-30 v4" {...line} />
  </g>
);

export const TowerOfLondon = () => (
  <g>
    <rect x="-18" y="-26" width="36" height="26" {...g} />
    {[-18, 12].map((x) => <rect key={x} x={x} y="-34" width="6" height="34" {...g} />)}
    <path d="M-18,-34 C-18,-38 -12,-38 -12,-34 M12,-34 C12,-38 18,-38 18,-34" {...g} />
    <path d="M-12,-26 h3 v-3 h3 v3 h3 v-3 h3 v3 h3 v-3 h3 v3 h3 v-3 h3 v3" {...line} />
    <path d="M-8,-16 v5 M0,-16 v5 M8,-16 v5" {...line} />
  </g>
);

export const Globe = () => (
  <g>
    <path d="M-20,0 L-20,-22 L-12,-26 L12,-26 L20,-22 L20,0 Z" {...g} />
    <path d="M-12,-26 v26 M0,-26 v26 M12,-26 v26 M-16,-14 h32" {...line} />
    <path d="M-22,-22 C-22,-32 22,-32 22,-22 C22,-27 -22,-27 -22,-22 Z" {...g} />
    <Hatch d="M-16,-28 l3,-2 M-8,-29 l3,-2 M0,-29.5 l3,-2 M8,-29 l3,-2" n={1} />
  </g>
);

export const Shard = () => (
  <g>
    <path d="M-11,0 L11,0 L2,-76 L-2,-76 Z" {...g} />
    <path d="M-4,0 L-1,-70 M4,0 L1,-70 M0,-76 L-3,-82 M0,-76 L2,-84" {...line} />
    <Hatch d="M-8,-10 L8,-10" n={5} dx={0} dy={-12} />
  </g>
);

export const BigBen = () => (
  <g>
    <rect x="8" y="-18" width="34" height="18" {...g} />
    <path d="M12,-12 v8 M18,-12 v8 M24,-12 v8 M30,-12 v8 M36,-12 v8" {...line} />
    <rect x="-8" y="-50" width="16" height="50" {...g} />
    <path d="M-8,-50 L0,-68 L8,-50 Z" {...g} />
    <circle cx="0" cy="-40" r="5.5" {...g} /><path d="M0,-40 L0,-44 M0,-40 L3,-38" {...line} />
    <path d="M-5,-30 v6 M5,-30 v6 M-5,-20 v6 M5,-20 v6" {...line} />
  </g>
);

export const LondonEye = () => (
  <g>
    <path d="M0,-30 L-16,0 M0,-30 L16,0 M-12,-6 L12,-6" {...line} strokeWidth="1.2" />
    <circle cx="0" cy="-32" r="26" fill="none" stroke={INK} strokeWidth="1.4" />
    <circle cx="0" cy="-32" r="3" {...g} />
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return (
      <g key={i}><line x1="0" y1="-32" x2={Math.cos(a) * 26} y2={-32 + Math.sin(a) * 26} {...line} opacity="0.7" />
        <circle cx={Math.cos(a) * 26} cy={-32 + Math.sin(a) * 26} r="2" {...g} /></g>); })}
  </g>
);

export const Gherkin = () => (
  <g>
    <path d="M-10,0 L-10,-36 C-10,-56 10,-56 10,-36 L10,0 Z" {...g} />
    <path d="M-9,-8 L9,-40 M-9,-24 L7,-50 M9,-8 L-9,-40 M9,-24 L-7,-50 M-10,-14 h20 M-10,-28 h20 M-8,-42 h16" {...line} opacity="0.6" />
  </g>
);

export const SkyGarden = () => (
  <g>
    <path d="M-9,0 L-9,-38 C-11,-48 -14,-54 -14,-58 L14,-58 C14,-54 11,-48 9,-38 L9,0 Z" {...g} />
    <path d="M-9,-10 h18 M-9,-20 h18 M-9,-30 h18 M-11,-42 h22 M-13,-52 h26" {...line} opacity="0.6" />
    <path d="M-8,-58 C-8,-64 -2,-64 -2,-58 M-1,-58 C-1,-65 5,-65 5,-58 M6,-58 C6,-63 11,-63 11,-58" {...g} />
  </g>
);

export const StPancrasKingsCross = () => (
  <g>
    <rect x="-40" y="-46" width="12" height="46" {...g} />
    <path d="M-40,-46 L-34,-62 L-28,-46 Z" {...g} /><circle cx="-34" cy="-40" r="3" fill="none" stroke={INK} strokeWidth="0.9" />
    <rect x="-28" y="-30" width="28" height="30" {...g} />
    <path d="M-23,-22 l3,-4 l3,4 M-13,-22 l3,-4 l3,4 M-3,-22 l3,-4 M-23,-12 v6 M-16,-12 v6 M-9,-12 v6 M-3,-12 v6" {...line} />
    <path d="M2,0 L2,-14 C2,-32 22,-32 22,-14 L22,0 M24,0 L24,-14 C24,-32 44,-32 44,-14 L44,0" {...g} />
    <path d="M6,-14 C6,-26 18,-26 18,-14 M28,-14 C28,-26 40,-26 40,-14" {...line} opacity="0.6" />
    <rect x="20" y="-40" width="6" height="10" {...g} /><path d="M20,-40 L23,-45 L26,-40" {...g} />
  </g>
);

export const CanaryWharf = () => (
  <g>
    <rect x="-12" y="-56" width="24" height="56" {...g} />
    <path d="M-12,-56 L0,-70 L12,-56 Z" {...g} />
    <Hatch d="M-9,-8 h18" n={6} dx={0} dy={-8} />
    <path d="M-4,-56 v56 M4,-56 v56" {...line} opacity="0.5" />
  </g>
);

export const Buckingham = () => (
  <g>
    <rect x="-34" y="-20" width="68" height="20" {...g} />
    <path d="M-12,-20 L0,-28 L12,-20 Z" {...g} />
    <path d="M-28,-16 v10 M-22,-16 v10 M-16,-16 v10 M16,-16 v10 M22,-16 v10 M28,-16 v10 M-6,-16 v10 M6,-16 v10" {...line} />
    <path d="M0,-28 L0,-40 M0,-40 L8,-37 L0,-34" {...line} />
  </g>
);

export const NelsonColumn = () => (
  <g>
    <rect x="-9" y="-6" width="18" height="6" {...g} /><rect x="-6" y="-10" width="12" height="4" {...g} />
    <rect x="-2.5" y="-50" width="5" height="40" {...g} /><rect x="-5" y="-54" width="10" height="4" {...g} />
    <circle cx="0" cy="-60" r="2.2" {...g} /><path d="M0,-58 L0,-54 M-2,-56 L2,-56" {...line} />
    <path d="M-1,-46 v34 M1,-46 v34" {...line} opacity="0.5" />
  </g>
);

export const Barbican = () => (
  <g>
    <rect x="-22" y="-30" width="12" height="30" {...g} /><rect x="-6" y="-48" width="12" height="48" {...g} /><rect x="10" y="-38" width="12" height="38" {...g} />
    <Hatch d="M-22,-6 h12 M-6,-6 h12 M10,-6 h12" n={6} dx={0} dy={-7} />
  </g>
);

export const Chimney = () => (
  <g>
    <path d="M-5,0 L-4,-44 L4,-44 L5,0 Z" {...g} />
    <path d="M-4.5,-38 h9 M-4.6,-34 h9.2" {...line} />
    <path d="M0,-48 c-3,-4 3,-8 0,-12 M3,-50 c3,-4 -2,-8 1,-11" {...line} opacity="0.55" />
  </g>
);

export const Flowers = () => (
  <g>
    <path d="M-8,0 C-8,-8 -10,-14 -9,-20 M0,0 C0,-10 1,-16 0,-24 M8,0 C8,-8 10,-14 9,-20 M-4,-8 c-4,-1 -6,-4 -6,-7 M4,-10 c4,-1 6,-4 6,-7" {...line} />
    {[[-9, -22], [0, -26], [9, -22]].map(([x, y], i) => (
      <g key={i}>{Array.from({ length: 5 }, (_, k) => { const a = (k / 5) * Math.PI * 2; return <circle key={k} cx={x + Math.cos(a) * 3.2} cy={y + Math.sin(a) * 3.2} r="2.2" {...g} />; })}
        <circle cx={x} cy={y} r="1.6" fill={INK} /></g>))}
  </g>
);

export const OpenBook = () => (
  <g>
    <path d="M-13,0 C-13,-9 -3,-12 0,-7 C3,-12 13,-9 13,0 Z" {...g} />
    <path d="M0,-7 L0,0 M-10,-5 C-7,-7 -4,-7 -2,-5 M-10,-2 C-7,-4 -4,-4 -2,-2 M2,-5 C4,-7 7,-7 10,-5 M2,-2 C4,-4 7,-4 10,-2" {...line} />
  </g>
);

export const Harrods = () => (
  <g>
    <rect x="-30" y="-18" width="60" height="18" {...g} />
    <path d="M-9,-18 C-9,-30 9,-30 9,-18 Z" {...g} /><path d="M0,-30 L0,-34" {...line} />
    <path d="M-30,-18 C-30,-23 -24,-23 -24,-18 M24,-18 C24,-23 30,-23 30,-18" {...g} />
    <path d="M-24,-14 v8 M-16,-14 v8 M16,-14 v8 M24,-14 v8 M-4,-10 v4 M4,-10 v4" {...line} />
  </g>
);

export const VandA = () => (
  <g>
    <rect x="-20" y="-24" width="40" height="24" {...g} />
    <rect x="-7" y="-38" width="14" height="14" {...g} />
    <path d="M-7,-38 L-4,-45 L0,-40 L4,-45 L7,-38 Z" {...g} />
    <path d="M-4,0 L-4,-10 C-4,-15 4,-15 4,-10 L4,0" {...line} />
    <path d="M-15,-18 v6 M-10,-18 v6 M10,-18 v6 M15,-18 v6" {...line} />
  </g>
);

export const TateModern = () => (
  <g>
    <rect x="-26" y="-22" width="52" height="22" {...g} />
    <rect x="-5" y="-62" width="10" height="40" {...g} />
    <path d="M-5,-58 h10 M-4,-40 h8 M-22,-14 h44 M-22,-8 h44" {...line} opacity="0.6" />
  </g>
);

export const BTTower = () => (
  <g>
    <rect x="-4" y="-60" width="8" height="60" {...g} />
    <rect x="-8" y="-48" width="16" height="14" rx="2" {...g} />
    <path d="M-8,-44 h16 M-8,-40 h16 M-8,-36 h16 M0,-60 L0,-74 M-2,-70 h4" {...line} />
  </g>
);

export const WestminsterAbbey = () => (
  <g>
    <rect x="-20" y="-24" width="40" height="24" {...g} />
    <rect x="-20" y="-40" width="10" height="16" {...g} /><rect x="10" y="-40" width="10" height="16" {...g} />
    <path d="M-20,-40 l2,-5 l3,5 l2,-5 l3,5 M10,-40 l2,-5 l3,5 l2,-5 l3,5" {...line} />
    <path d="M-4,0 L-4,-12 C-4,-17 4,-17 4,-12 L4,0 M-12,-14 l2,-4 l2,4 M8,-14 l2,-4 l2,4" {...line} />
  </g>
);

export const BankOfEngland = () => (
  <g>
    <rect x="-24" y="-18" width="48" height="18" {...g} />
    <path d="M-16,-18 L0,-28 L16,-18 Z" {...g} />
    <path d="M-18,-16 v13 M-11,-16 v13 M-4,-16 v13 M4,-16 v13 M11,-16 v13 M18,-16 v13" {...line} strokeWidth="1.2" />
  </g>
);

export const LiverpoolSt = () => (
  <g>
    <path d="M-26,0 L-26,-16 C-26,-36 26,-36 26,-16 L26,0 Z" {...g} />
    <path d="M-20,-16 C-20,-30 20,-30 20,-16 M0,-34 v-8 M-3,-40 h6" {...line} />
    <path d="M-16,-10 v6 M-8,-10 v6 M0,-10 v6 M8,-10 v6 M16,-10 v6" {...line} opacity="0.6" />
  </g>
);

export const CoventGarden = () => (
  <g>
    <path d="M-20,0 L-20,-12 C-20,-22 20,-22 20,-12 L20,0 Z" {...g} />
    <path d="M-14,-12 C-14,-18 -6,-18 -6,-12 M-4,-12 C-4,-18 4,-18 4,-12 M6,-12 C6,-18 14,-18 14,-12" {...line} />
  </g>
);

export const BoroughMarket = () => (
  <g>
    <path d="M-22,0 L-22,-14 L0,-24 L22,-14 L22,0 Z" {...g} />
    <path d="M-22,-14 h44 M-14,-14 v14 M0,-14 v14 M14,-14 v14 M-11,-19 l11,-4 l11,4" {...line} opacity="0.65" />
  </g>
);

/** An Underground roundel, drawn as ink. */
export const Roundel = () => (
  <g><circle r="6" {...g} strokeWidth="1.5" /><rect x="-9" y="-1.8" width="18" height="3.6" fill={INK} /></g>
);

/** Hedwig, in flight, with a letter. */
export const Owl = () => (
  <g>
    <path d="M-4,-6 C-14,-14 -26,-14 -32,-8 C-24,-10 -14,-6 -6,-2 Z" {...g} />
    <path d="M4,-6 C14,-14 26,-14 32,-8 C24,-10 14,-6 6,-2 Z" {...g} />
    <path d="M-22,-10 l-3,4 M-16,-11 l-2,4 M22,-10 l3,4 M16,-11 l2,4" {...line} opacity="0.6" />
    <ellipse cx="0" cy="0" rx="6" ry="8.5" {...g} />
    <circle cx="0" cy="-9" r="5.5" {...g} />
    <path d="M-4,-13 l-2,-4 l4,2 M4,-13 l2,-4 l-4,2" {...g} />
    <circle cx="-2.2" cy="-9.5" r="1.6" fill={INK} /><circle cx="2.2" cy="-9.5" r="1.6" fill={INK} />
    <path d="M0,-7.5 l-1,1.6 l2,0 Z" fill={INK} />
    <path d="M-2,2 c-1,1 -1,3 0,3 M2,2 c1,1 1,3 0,3" {...line} opacity="0.6" />
    <rect x="-5" y="8" width="10" height="7" {...g} /><path d="M-5,8 L0,12 L5,8" {...line} />
  </g>
);

export const Tree = () => (
  <g><path d="M0,0 L0,-6" {...line} strokeWidth="1.2" /><circle cx="0" cy="-10" r="4.6" {...g} /><path d="M-2,-12 c1,-2 3,-2 4,0" {...line} opacity="0.5" /></g>
);

export const Castle = () => (
  <g>
    {[[-30, -34, 10], [-14, -46, 10], [4, -40, 10], [20, -52, 8], [32, -30, 8]].map(([x, y, w], i) => (
      <g key={i}><rect x={x} y={y} width={w} height={-y} {...g} /><path d={`M${x},${y} L${x + w / 2},${y - 14} L${x + w},${y} Z`} {...g} />
        <path d={`M${x + w / 2},${y - 14} L${x + w / 2},${y - 20} L${x + w / 2 + 5},${y - 18} L${x + w / 2},${y - 16}`} {...line} /></g>))}
    <rect x="-20" y="-24" width="40" height="24" {...g} />
    <path d="M-20,-24 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3" {...line} />
    <path d="M-26,-14 v5 M-10,-12 v5 M8,-12 v5 M24,-14 v5 M-3,0 L-3,-8 C-3,-12 3,-12 3,-8 L3,0" {...line} />
    <Hatch d="M-36,4 C-20,2 20,2 38,4" n={2} dx={0} dy={3} />
  </g>
);
