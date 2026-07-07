// Little hand-drawn portraits of each pot, keyed by a piece's `art`. Flat, layered
// vessels with a hint of glaze pooling, throwing rings, and the quirks that make
// each one itself (a raw rim patch, a warped lip, a drip to the foot).

function AmberCup() {
  return (
    <>
      <ellipse cx="50" cy="86" rx="22" ry="4.5" fill="rgba(0,0,0,0.26)" />
      <path d="M29,30 C27,60 33,82 50,82 C67,82 73,60 71,30 Z" fill="#C0842F" />
      <path d="M33,54 C32,72 40,80 50,80 C60,80 68,72 67,54 C60,60 40,60 33,54 Z" fill="#8A5A1C" />
      <path d="M37,34 C35,55 38,74 42,78 C40,60 39,42 41,34 Z" fill="#E4B25E" opacity="0.7" />
      <path d="M31,44 C42,47 58,47 69,44" stroke="#9C6A22" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M31,58 C42,61 58,61 69,58" stroke="#9C6A22" strokeWidth="1" fill="none" opacity="0.35" />
      <ellipse cx="50" cy="30" rx="21" ry="6" fill="#D69A3E" />
      <ellipse cx="50" cy="30" rx="14" ry="3.6" fill="#0E1116" />
      <path d="M62,25 C68,25 71,29 70,32 L65,31 C65,28 63,27 59,27 Z" fill="#D6C9AC" />
    </>
  );
}

function BlueBowl() {
  return (
    <>
      <ellipse cx="50" cy="86" rx="26" ry="4.5" fill="rgba(0,0,0,0.26)" />
      <path d="M20,44 C22,70 35,82 50,82 C65,82 78,70 80,44 Z" fill="#6E93C8" />
      <path d="M28,66 C34,78 42,80 50,80 C58,80 66,78 72,66 C64,72 36,72 28,66 Z" fill="#B79A72" opacity="0.5" />
      <path d="M20,44 C24,38 40,36 50,36 C61,36 76,38 80,45 C76,50 61,52 50,52 C39,52 24,50 20,44 Z" fill="#88A9D6" />
      <path d="M26,44 C30,40 42,39 50,39 C59,39 70,40 74,44 C70,48 59,49 50,49 C41,49 30,48 26,44 Z" fill="#E7EDF4" />
      <g fill="#3E6BB0">
        <circle cx="42" cy="43" r="1.4" /><circle cx="55" cy="45" r="1.2" /><circle cx="49" cy="42" r="1" />
        <circle cx="60" cy="43" r="1.1" /><circle cx="46" cy="46" r="0.9" /><circle cx="35" cy="44" r="1" />
      </g>
    </>
  );
}

function GreenBowl() {
  return (
    <>
      <ellipse cx="50" cy="86" rx="24" ry="4.5" fill="rgba(0,0,0,0.26)" />
      <path d="M23,42 C24,68 36,82 50,82 C64,82 76,68 77,42 Z" fill="#7D9E76" />
      <path d="M30,58 C36,76 44,80 50,80 C56,80 64,76 70,58 C60,66 40,66 30,58 Z" fill="#4E6E4A" opacity="0.5" />
      <path d="M48,80 C47,86 47,90 49,91 C51,90 51,86 51,80 Z" fill="#5E7E54" />
      <path d="M23,42 C28,37 40,35 50,35 C60,35 72,37 77,43 C72,47 60,49 50,49 C40,49 28,47 23,42 Z" fill="#A9CFC0" />
      <ellipse cx="50" cy="42" rx="21" ry="5.2" fill="#4E6E4A" />
      <g fill="#CBB86A">
        <circle cx="45" cy="41" r="1" /><circle cx="54" cy="43" r="1" /><circle cx="50" cy="40" r="0.9" /><circle cx="57" cy="41" r="0.8" />
      </g>
    </>
  );
}

const ART = { amberCup: AmberCup, blueBowl: BlueBowl, greenBowl: GreenBowl };

function PotteryVessel({ art, className = 'pot-vessel' }) {
  const Shape = ART[art] || AmberCup;
  return (
    <svg className={className} viewBox="0 0 100 96" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Shape />
    </svg>
  );
}

export default PotteryVessel;
