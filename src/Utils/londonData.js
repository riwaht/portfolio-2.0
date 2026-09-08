/**
 * London, 9 to 13 September 2026. A birthday itinerary.
 *
 * The five days are keyed to the four Hogwarts houses (plus a plum finale) using
 * the site's existing accent tokens rather than costume-shop primaries, so the
 * wizarding layer sits on the printed-paper substrate instead of fighting it.
 *
 * `geo` on a stop is real lon/lat. LondonMap projects it, so the plotted route
 * is geographically true, not decorative.
 */

export const trip = {
  city: 'London',
  country: 'United Kingdom',
  dateRange: '9 to 13 September 2026',
  nights: 4,
  occasion: 'Birthday',
  birthday: 'Thursday 10 September',
  hotel: { name: 'Club Quarters St Paul’s', address: '24 Ludgate Hill, EC4M 7DR' },
  out: { service: 'Eurostar 9057', from: 'Paris Gare du Nord', to: 'London St Pancras', dep: '08:30', arr: '10:00', date: 'Wed 9 Sep' },
  back: { service: 'Eurostar 9042', from: 'London St Pancras', to: 'Paris Gare du Nord', dep: '16:00', arr: '19:29', date: 'Sun 13 Sep' },
};

export const days = [
  {
    id: 'wed',
    n: 1,
    dow: 'Wednesday',
    date: '9 Sep',
    house: 'gryffindor',
    title: 'Arrival & the Alley',
    blurb:
      'Off the train and straight onto the platform, because the trick with Platform 9¾ is going before anyone else is awake. Then south to Borough for lunch, an hour inside the strangest house in London, and back up into the lanes that Diagon Alley was borrowed from.',
    stops: [
      { t: '08:30', name: 'Eurostar, Gare du Nord', kind: 'travel', geo: null },
      { t: '10:10', name: 'Platform 9¾', major: true, lab: 'r', kind: 'magic', geo: { lon: -0.1233, lat: 51.5320 }, note: 'Straight off the train, before anyone else is awake.', photo: 'platform934' },
      { t: '12:00', name: 'Borough Market', major: true, lab: 'b', kind: 'market', geo: { lon: -0.0910, lat: 51.5055 }, note: 'Lunch, and the Leaky Cauldron’s doorway on the Stoney Street corner.', photo: 'borough' },
      { t: '14:00', name: "Sir John Soane's Museum", major: true, lab: 'r', kind: 'museum', geo: { lon: -0.1173, lat: 51.5170 }, note: 'An architect’s house frozen in 1837. A sarcophagus in the basement, walls that fold open.', photo: 'soane' },
      { t: '15:15', name: 'Cecil Court', major: true, lab: 'b', kind: 'magic', geo: { lon: -0.1275, lat: 51.5108 }, note: 'Twenty antiquarian bookshops in one lane. The cited inspiration for Diagon Alley.', photo: 'cecil' },
      { t: '15:35', name: "Goodwin's Court", kind: 'magic', geo: { lon: -0.1268, lat: 51.5104 }, note: 'A gas-lit alley of bow windows. The other Diagon Alley.', photo: 'goodwin' },
      { t: '15:45', name: "Neal's Yard & Seven Dials", kind: 'sight', geo: { lon: -0.1265, lat: 51.5142 }, note: 'A hidden painted courtyard, then the 1690s sundial junction.', photo: 'nealsyard' },
      { t: '15:55', name: 'Choosing Keeping', kind: 'gift', geo: { lon: -0.1270, lat: 51.5136 }, note: 'Japanese paper, wax seals, fountain pens. A stationery shop that looks like a museum.', photo: 'choosingkeeping' },
      { t: '16:00', name: 'The Seven Noses of Soho', kind: 'sight', geo: { lon: -0.1330, lat: 51.5140 }, note: 'Seven plaster noses hidden on the walls. Find one.' },
      { t: '16:30', name: 'House of MinaLima', major: true, lab: 'l', kind: 'magic', geo: { lon: -0.1345, lat: 51.5135 }, note: 'The two designers who made every prop, poster and letter, and the Marauder’s Map itself.', photo: 'minalima' },
      { t: '18:15', name: 'Kissaten', kind: 'sight', geo: { lon: -0.1315, lat: 51.5133 }, note: 'Gachapon machines, floor to ceiling.', photo: 'kissaten' },
      { t: '21:00', name: 'Fatt Pundit', major: true, lab: 't', kind: 'food', geo: { lon: -0.1355, lat: 51.5138 }, note: 'Indo-Chinese, in the middle of Soho.', photo: 'fattpundit' },
    ],
  },
  {
    id: 'thu',
    n: 2,
    dow: 'Thursday',
    date: '10 Sep',
    house: 'birthday',
    title: 'The Birthday',
    blurb:
      'A slow morning with nothing in it but flowers, a letter and cake. Then four hours inside the actual castle: the Great Hall, the Forbidden Forest, Diagon Alley as it was built. Dinner seven floors up afterwards.',
    stops: [
      { t: '09:45', name: 'Scarlett Green', kind: 'food', geo: { lon: -0.1370, lat: 51.5148 }, note: 'Australian brunch in Soho, then the Victoria line to Euston.', photo: 'scarlettgreen' },
      { t: '13:00', name: 'Warner Bros. Studio Tour', major: true, lab: 'b', kind: 'magic', geo: null, off: 'Leavesden, beyond the map', note: 'The Making of Harry Potter. Lunch at the Backlot Café, Butterbeer in hand.', photo: 'wbstudio' },
      { t: '19:50', name: 'CLAP rooftop terrace', kind: 'sight', geo: { lon: -0.1620, lat: 51.4995 }, note: 'Seventh floor, 180° over Knightsbridge. Drinks upstairs first.' },
      { t: '20:30', name: 'Dinner at CLAP', major: true, lab: 'r', kind: 'food', geo: { lon: -0.1620, lat: 51.4995 }, note: 'Sixth floor, one below the terrace.', photo: 'clap' },
    ],
  },
  {
    id: 'fri',
    n: 3,
    dow: 'Friday',
    date: '11 Sep',
    house: 'ravenclaw',
    title: 'Ceramics, Gardens & the City',
    blurb:
      'The largest ceramics collection in the world in the morning, dumplings at lunch, then a hidden garden, the market that plays Diagon Alley from the outside, a church left to the trees, and a fairground at the end of the street.',
    stops: [
      { t: '10:00', name: 'V&A, ceramics galleries', major: true, lab: 'b', kind: 'museum', geo: { lon: -0.1722, lat: 51.4966 }, note: 'The largest ceramics collection in the world.', photo: 'va' },
      { t: '12:30', name: 'Petersham Nurseries', kind: 'sight', geo: { lon: -0.1237, lat: 51.5118 }, note: 'A plant nursery in a glass courtyard off King Street.', photo: 'petersham' },
      { t: '13:00', name: 'Din Tai Fung', major: true, lab: 't', kind: 'food', geo: { lon: -0.1240, lat: 51.5122 }, note: 'Covent Garden.', photo: 'dtf' },
      { t: '14:30', name: 'Inner Temple Garden', major: true, lab: 'b', kind: 'sight', geo: { lon: -0.1105, lat: 51.5118 }, note: 'Three hidden acres inside the barristers’ quarter. Public until three.', photo: 'innertemple' },
      { t: '15:00', name: 'Temple lanes', kind: 'magic', geo: { lon: -0.1112, lat: 51.5128 }, note: 'Gas lamps and cobbles. The other other Diagon Alley.', photo: 'templelanes' },
      { t: '16:00', name: "St Paul's & Daunt Cheapside", kind: 'sight', geo: { lon: -0.0984, lat: 51.5138 }, photo: 'dauntcheapside' },
      { t: '16:20', name: 'Leadenhall Market', major: true, lab: 't', kind: 'magic', geo: { lon: -0.0834, lat: 51.5128 }, note: 'The Diagon Alley exterior. Victorian ironwork, and better when it is empty.', photo: 'leadenhall' },
      { t: '16:30', name: 'St Dunstan-in-the-East', major: true, lab: 'r', kind: 'sight', geo: { lon: -0.0827, lat: 51.5096 }, note: 'A bombed church left as a garden. Trees grow through the windows.', photo: 'stdunstan' },
      { t: '18:30', name: 'Ye Olde Cheshire Cheese', major: true, lab: 'l', kind: 'food', geo: { lon: -0.1073, lat: 51.5142 }, note: 'Fish and chips in a pub rebuilt in 1667. Dickens drank here.', photo: 'cheshire' },
      { t: '20:15', name: 'One New Change, roof terrace', major: true, lab: 'b', kind: 'sight', geo: { lon: -0.0958, lat: 51.5138 }, note: 'The dome of St Paul’s lit up, from six floors up.', photo: 'stpauls' },
      { t: '21:00', name: 'Fairgame City', major: true, lab: 'r', kind: 'play', geo: { lon: -0.0963, lat: 51.5140 }, note: 'Twelve fairground games and a live leaderboard.', photo: 'fairgame' },
    ],
  },
  {
    id: 'sat',
    n: 4,
    dow: 'Saturday',
    date: '12 Sep',
    house: 'slytherin',
    title: 'Bookshop, Hill & the Globe',
    blurb:
      'The Edwardian bookshop with the oak galleries, then up through Regent’s Park to the best skyline in London. Lunch in the railway arches, fresh pasta by the river, and the night belongs to a wooden O with no roof on it.',
    stops: [
      { t: '09:00', name: 'Daunt Books Marylebone', major: true, lab: 'l', kind: 'sight', geo: { lon: -0.1524, lat: 51.5209 }, note: 'Long oak galleries, a skylight, travel books shelved by country.', photo: 'daunt' },
      { t: '09:45', name: 'Divertimenti', kind: 'sight', geo: { lon: -0.1522, lat: 51.5205 }, note: 'A cookshop full of bakeware, one minute up the same street.', photo: 'divertimenti' },
      { t: '10:15', name: "Regent's Park", kind: 'park', geo: { lon: -0.1570, lat: 51.5313 }, photo: 'regentspark' },
      { t: '11:00', name: 'Primrose Hill', major: true, lab: 'r', kind: 'park', geo: { lon: -0.1608, lat: 51.5388 }, note: 'The best skyline view in London.', photo: 'primrose' },
      { t: '13:00', name: 'Maltby Street Market', major: true, lab: 'b', kind: 'market', geo: { lon: -0.0765, lat: 51.4992 }, note: 'Saturday-only. Food in the railway arches, and a salvage warehouse that opens onto it.', photo: 'maltby' },
      { t: '16:30', name: 'Padella', major: true, lab: 'b', kind: 'food', geo: { lon: -0.0905, lat: 51.5050 }, note: 'Hand-rolled pasta in the window since 2016. Pici cacio e pepe, then the river walk to the Globe.', photo: 'padella' },
      { t: '19:30', name: "Shakespeare's Globe", major: true, lab: 'r', kind: 'play', geo: { lon: -0.0972, lat: 51.5081 }, note: "Love's Labour's Lost, under an open sky.", photo: 'globe' },
    ],
  },
  {
    id: 'sun',
    n: 5,
    dow: 'Sunday',
    date: '13 Sep',
    house: 'finale',
    title: 'Flowers, then home',
    blurb:
      'One long east London walk that only exists on a Sunday: a street of flowers, a lane of bagels, a Victorian market, and a four-minute photograph of the two of you. Then the First Folio on the way back to the train.',
    stops: [
      { t: '08:00', name: 'Columbia Road Flower Market', major: true, lab: 'r', kind: 'market', geo: { lon: -0.0708, lat: 51.5292 }, note: 'A whole street of flowers, only ever on a Sunday.', photo: 'columbia' },
      { t: '09:00', name: 'Lily Vanilli', kind: 'food', geo: { lon: -0.0700, lat: 51.5297 }, note: 'A baker’s bakery in a courtyard off the flower market.', photo: 'lilyvanilli' },
      { t: '10:15', name: 'Old Spitalfields Market', major: true, lab: 'b', kind: 'market', geo: { lon: -0.0755, lat: 51.5194 }, photo: 'spitalfields' },
      { t: '10:30', name: 'The Autofoto booth', kind: 'gift', geo: { lon: -0.0750, lat: 51.5192 }, note: 'A 1980s darkroom in a box. Four minutes, one strip of the two of you.', photo: 'autofoto' },
      { t: '11:00', name: 'Rough Trade East', kind: 'sight', geo: { lon: -0.0718, lat: 51.5214 }, note: 'Records, and a hand-built photobooth by the door.', photo: 'roughtrade' },
      { t: '11:30', name: 'Hirono, Dray Walk', major: true, lab: 'r', kind: 'sight', geo: { lon: -0.0722, lat: 51.5218 }, note: 'In the Old Truman Brewery.', photo: 'hirono' },
      { t: '13:00', name: 'British Library, Treasures', major: true, lab: 'l', kind: 'museum', geo: { lon: -0.1276, lat: 51.5299 }, note: 'The Shakespeare First Folio is in there.', photo: 'britishlib' },
      { t: '13:50', name: 'Word on the Water', major: true, lab: 'r', kind: 'sight', geo: { lon: -0.1252, lat: 51.5352 }, note: 'A 1920s barge that is a bookshop. Wood stove on board.', photo: 'wordwater' },
      { t: '16:00', name: 'Eurostar home', major: true, lab: 'r', kind: 'travel', geo: { lon: -0.1263, lat: 51.5308 }, note: 'Into Gare du Nord at 19:29.', photo: 'eurostar' },
    ],
  },
];

/** Aged-ink tones for each day's footprints: house colours as old ink, never named on the page. */
export const HOUSE = {
  gryffindor: { ink: 'var(--ld-ink-wed)', name: 'Gryffindor', motto: 'daring, nerve and chivalry' },
  birthday:   { ink: 'var(--ld-ink-thu)', name: 'Hufflepuff', motto: 'her house. Patient, loyal, unafraid of toil, and it is her birthday' },
  ravenclaw:  { ink: 'var(--ld-ink-fri)', name: 'Ravenclaw', motto: 'wit beyond measure' },
  slytherin:  { ink: 'var(--ld-ink-sat)', name: 'Slytherin', motto: 'cunning folk use any means' },
  finale:     { ink: 'var(--ld-ink-sun)', name: 'the Marauders', motto: 'mischief managed' },
};

/** Stop-kind glyphs, quill-drawn rather than iconographic. */
export const KIND = {
  magic:  { glyph: '✦', label: 'Wizarding' },
  travel: { glyph: '→', label: 'Travel' },
  hotel:  { glyph: '⌂', label: 'Hotel' },
  food:   { glyph: '◗', label: 'Food' },
  market: { glyph: '❋', label: 'Market' },
  museum: { glyph: '▣', label: 'Museum' },
  sight:  { glyph: '◈', label: 'Sight' },
  park:   { glyph: '↟', label: 'Green' },
  play:   { glyph: '✧', label: 'Theatre & play' },
  gift:   { glyph: '❍', label: 'Gifts' },
};

/** Every stop that carries a real coordinate, flattened for the map. */
export function mappedStops() {
  return days.flatMap((d) =>
    d.stops
      .filter((s) => s.geo)
      .map((s) => ({ ...s, dayId: d.id, dayN: d.n, house: d.house }))
  );
}

/* Derived from the data above, so the masthead can never drift from the plan. */
export const stats = [
  { value: String(days.length), label: 'days' },
  { value: String(trip.nights), label: 'nights' },
  { value: '1', label: 'castle' },
  { value: '1', label: 'birthday' },
];
