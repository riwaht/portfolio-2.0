/**
 * Geography for the Marauder's Map, all in real lon/lat. The projection is
 * equirectangular at true aspect for 51.5°N, so a mile is a mile in both axes.
 */
export const LON0 = -0.183, LON1 = -0.012, LAT0 = 51.4905, LAT1 = 51.5445;
export const W = 1000, H = 507;               // 7.36 mi × 3.73 mi → true aspect
export const MILE = W / 7.36;                  // ~136 units

/* The Thames, west→east. Clamped up into frame at the far west. */
export const THAMES = [
  [-0.183, 51.4915], [-0.160, 51.4912], [-0.1400, 51.4935], [-0.1246, 51.5008],
  [-0.1160, 51.5065], [-0.1040, 51.5088], [-0.0980, 51.5082], [-0.0880, 51.5078],
  [-0.0755, 51.5055], [-0.0640, 51.5065], [-0.0480, 51.5040], [-0.0350, 51.5075],
  [-0.0250, 51.5062], [-0.0120, 51.5010],
];

/* Parks as real shapes rather than ellipses. */
export const PARKS = [
  [[-0.1660, 51.5250], [-0.1560, 51.5235], [-0.1470, 51.5260], [-0.1460, 51.5330], [-0.1530, 51.5370], [-0.1620, 51.5360], [-0.1680, 51.5310]],   // Regent's
  [[-0.1650, 51.5370], [-0.1580, 51.5375], [-0.1560, 51.5405], [-0.1620, 51.5420], [-0.1670, 51.5400]],                                          // Primrose Hill
  [[-0.1900, 51.5040], [-0.1500, 51.5030], [-0.1520, 51.5090], [-0.1620, 51.5120], [-0.1780, 51.5110], [-0.1900, 51.5080]],                       // Hyde Park + Kensington Gdns
  [[-0.1440, 51.5030], [-0.1300, 51.5010], [-0.1280, 51.5040], [-0.1400, 51.5060], [-0.1460, 51.5050]],                                          // Green Park + St James's
];

/* Major roads, drawn as fine ink lines beneath everything else. */
export const ROADS = [
  [[-0.1590, 51.5140], [-0.1418, 51.5152], [-0.1300, 51.5165], [-0.1200, 51.5178], [-0.1080, 51.5180], [-0.1000, 51.5150], [-0.0900, 51.5135]],  // Oxford St → Holborn → Cheapside → Bank
  [[-0.1418, 51.5152], [-0.1380, 51.5125], [-0.1337, 51.5100], [-0.1300, 51.5085]],                                                              // Regent St
  [[-0.1520, 51.5028], [-0.1440, 51.5060], [-0.1337, 51.5100]],                                                                                  // Piccadilly
  [[-0.1281, 51.5080], [-0.1200, 51.5105], [-0.1130, 51.5125], [-0.1060, 51.5142], [-0.0990, 51.5138]],                                          // Strand → Fleet St → Ludgate Hill
  [[-0.1660, 51.5215], [-0.1500, 51.5238], [-0.1337, 51.5262], [-0.1240, 51.5300], [-0.1100, 51.5316]],                                          // Marylebone Rd → Euston Rd → Pentonville
  [[-0.1200, 51.5300], [-0.1120, 51.5250], [-0.1055, 51.5205], [-0.1040, 51.5140], [-0.1040, 51.5090]],                                          // Farringdon Rd → Blackfriars
  [[-0.0880, 51.5085], [-0.0880, 51.5135], [-0.0815, 51.5180], [-0.0780, 51.5240], [-0.0760, 51.5310]],                                          // London Bridge → Bishopsgate → Shoreditch
  [[-0.0890, 51.5133], [-0.0760, 51.5140], [-0.0600, 51.5172], [-0.0400, 51.5190]],                                                              // Aldgate → Whitechapel Rd
  [[-0.1520, 51.5028], [-0.1620, 51.5010], [-0.1740, 51.4950]],                                                                                  // Knightsbridge → Brompton Rd
  [[-0.1520, 51.5028], [-0.1700, 51.5020], [-0.1830, 51.5012]],                                                                                  // Kensington Rd
  [[-0.1281, 51.5080], [-0.1265, 51.5040], [-0.1255, 51.5005], [-0.1350, 51.4985], [-0.1440, 51.4968]],                                          // Whitehall → Victoria St
  [[-0.1035, 51.5075], [-0.0960, 51.5058], [-0.0905, 51.5052], [-0.0800, 51.5045], [-0.0740, 51.5040]],                                          // Southwark St → Tooley St
  [[-0.1560, 51.5228], [-0.1530, 51.5185], [-0.1520, 51.5148]],                                                                                  // Baker St / Marylebone High St
  [[-0.1340, 51.5262], [-0.1320, 51.5215], [-0.1300, 51.5165]],                                                                                  // Tottenham Court Rd
  [[-0.1300, 51.5165], [-0.1280, 51.5130], [-0.1281, 51.5082]],                                                                                  // Charing Cross Rd
  [[-0.1337, 51.5100], [-0.1280, 51.5130], [-0.1240, 51.5165]],                                                                                  // Shaftesbury Ave
  [[-0.1180, 51.5195], [-0.1050, 51.5225], [-0.0900, 51.5255], [-0.0780, 51.5262]],                                                              // Theobalds → Clerkenwell Rd → Old St
  [[-0.0760, 51.5140], [-0.0755, 51.5195], [-0.0725, 51.5262]],                                                                                  // Commercial St → Brick Lane
  [[-0.0780, 51.5272], [-0.0700, 51.5302], [-0.0600, 51.5322]],                                                                                  // Hackney Rd
];

/* Bridges: centre and heading (degrees) so each crosses the river square-on. */
export const BRIDGES = [
  { lon: -0.1220, lat: 51.5008, a: -32 }, { lon: -0.1170, lat: 51.5078, a: -22 }, { lon: -0.1040, lat: 51.5088, a: 2 },
  { lon: -0.0985, lat: 51.5093, a: 6 },   { lon: -0.0945, lat: 51.5078, a: 8 },   { lon: -0.0877, lat: 51.5078, a: 4 },
];

/* Underground roundels at the stations that matter for orientation. */
export const ROUNDELS = [
  [-0.1053, 51.5203], [-0.1418, 51.5152], [-0.1130, 51.5033], [-0.1308, 51.5165], [-0.1058, 51.5322],
  [-0.1200, 51.5174], [-0.1571, 51.5226], [-0.1225, 51.5073], [-0.0757, 51.5143], [-0.0876, 51.5259],
];

export const PLACES = [
  { n: "King's Cross", lon: -0.1215, lat: 51.5352 }, { n: 'Clerkenwell', lon: -0.1010, lat: 51.5270 },
  { n: 'Soho', lon: -0.1385, lat: 51.5185 }, { n: 'The City', lon: -0.0875, lat: 51.5165 },
  { n: 'Bankside', lon: -0.0940, lat: 51.5012 }, { n: 'Knightsbridge', lon: -0.1500, lat: 51.4962 },
  { n: 'Shoreditch', lon: -0.0800, lat: 51.5325 }, { n: 'Canary Wharf', lon: -0.0235, lat: 51.5115 },
  { n: 'Marylebone', lon: -0.1580, lat: 51.5172 }, { n: 'Westminster', lon: -0.1400, lat: 51.4980 },
];

/* Graticule ticks on the frame. */
export const LON_TICKS = [-0.16, -0.12, -0.08, -0.04].map((l) => ({ v: l, label: `0°${String(Math.round(Math.abs(l) * 60)).padStart(2, '0')}′W` }));
export const LAT_TICKS = [51.50, 51.52, 51.54].map((l) => ({ v: l, label: `51°${Math.round((l - 51) * 60)}′N` }));

/* Where the films were actually shot, marked as Easter eggs, not stops. `side` = label side. */
export const WIZARDING = [
  { n: 'Gringotts', sub: 'Australia House, on the Strand', lon: -0.1175, lat: 51.5128, side: 'r' },
  { n: 'Ministry of Magic', sub: 'Scotland Place, off Whitehall', lon: -0.1262, lat: 51.5058, side: 'r' },
  { n: 'Grimmauld Place', sub: 'Claremont Square, Islington', lon: -0.1105, lat: 51.5325, side: 't' },
  { n: 'the Knight Bus', sub: 'Lambeth Bridge', lon: -0.1238, lat: 51.4948, side: 'r' },
  { n: 'Death Eaters’ bridge', sub: 'Millennium Bridge, Half-Blood Prince', lon: -0.0985, lat: 51.5108, side: 'l' },  { n: 'the Leaky Cauldron, ours', sub: 'Club Quarters, 24 Ludgate Hill. Four nights, no Floo powder', lon: -0.1017, lat: 51.5139, side: 'r' },
];
