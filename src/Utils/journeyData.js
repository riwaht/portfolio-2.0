import { geoToGrid } from './worldDotMap';

export const journeyPoints = [
  {
    id: 'lebanon-home',
    city: 'Beirut',
    country: 'Lebanon',
    geo: { lon: 35.5, lat: 33.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Home base',
    month: null,
    type: 'home',
    description: 'Where it all started. Learned to code, built my first projects, and dreamed about what comes next.',
    professional: [
      { role: 'Software / Simulation Engineer', company: 'inmind.ai' }
    ],
  },
  {
    id: 'paris-2018',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2018',
    month: 9,
    type: 'travel',
    description: 'My first trip abroad. Disneyland Paris, Eiffel Tower, and the Louvre. The cliché, but I loved it.',
    professional: null,
  },
  {
    id: 'beirut-after-paris-2018',
    city: 'Beirut',
    country: 'Lebanon',
    geo: { lon: 35.5, lat: 33.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2018',
    month: 9,
    type: 'home',
    description: 'Back home.',
    professional: null,
  },
  {
    id: 'rome-2019',
    city: 'Rome',
    country: 'Italy',
    geo: { lon: 12.5, lat: 41.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2019',
    month: 8,
    type: 'travel',
    description: 'My second trip abroad. Colosseum, Trevi Fountain, and the Pantheon. I gained 5 kilos of gelato and pizza.',
    professional: null,
  },
  {
    id: 'venice-2019',
    city: 'Venice',
    country: 'Italy',
    geo: { lon: 12.3, lat: 45.4 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2019',
    month: 8,
    type: 'travel',
    description: 'Gondolas and getting lost in the best way. Taxi boats, hidden canals, and the best pizza I have ever had.',
    professional: null,
  },
  {
    id: 'florence-2019',
    city: 'Florence',
    country: 'Italy',
    geo: { lon: 11.25, lat: 43.8 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2019',
    month: 8,
    type: 'travel',
    description: 'Renaissance art and the best gelato. Such a perfect city for study-abroad students. (I was not tho.)',
    professional: null,
  },
  {
    id: 'beirut-after-italy',
    city: 'Beirut',
    country: 'Lebanon',
    geo: { lon: 35.5, lat: 33.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2019',
    month: 8,
    type: 'home',
    description: 'Back home.',
    professional: null,
  },
  {
    id: 'tokyo-2025',
    city: 'Tokyo',
    country: 'Japan',
    geo: { lon: 138.7, lat: 35.7 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Feb 2025',
    month: 2,
    type: 'travel',
    description: 'A trip I had been planning for years. Wandered through Tokyo: Shibuya, Akihabara, Shinjuku. Every neighborhood felt like its own little world.',
    professional: null,
  },
  {
    id: 'osaka-2025',
    city: 'Osaka',
    country: 'Japan',
    geo: { lon: 134.5, lat: 34.7 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Mar 2025',
    month: 3,
    type: 'travel',
    description: 'Street food capital. Had the best yakiniku of my life. Pretty bizarre place.',
    professional: null,
  },
  {
    id: 'kyoto-2025',
    city: 'Kyoto',
    country: 'Japan',
    geo: { lon: 134.8, lat: 35.0 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Mar 2025',
    month: 3,
    type: 'travel',
    description: 'Temples, bamboo forests, and the quietest streets I have ever walked. Too many stairs. Went to a 1000-year-old temple and a 1000-year-old restaurant.',
    professional: null,
  },
  {
    id: 'nara-2025',
    city: 'Nara',
    country: 'Japan',
    geo: { lon: 134.8, lat: 34.7 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Mar 2025',
    month: 3,
    type: 'travel',
    description: 'Deer everywhere. They bow for crackers. They also bite. Went to random anime shops.',
    professional: null,
  },
  {
    id: 'mtfuji-2025',
    city: 'Mt Fuji',
    country: 'Japan',
    geo: { lon: 137.7, lat: 35.4 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Feb 2025',
    month: 2,
    type: 'travel',
    description: 'Visible for the two days I was there. Biked around Lake Kawaguchiko. Went to a very fancy ryokan with a private onsen. Had a 7-course Wagyu dinner. Unlimited wine. Stood in awe of Mt Fuji.',
    professional: null,
  },
  {
    id: 'beirut-after-japan',
    city: 'Beirut',
    country: 'Lebanon',
    geo: { lon: 35.5, lat: 33.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Mar 2025',
    month: 3,
    type: 'home',
    description: 'Back home.',
    professional: null,
  },
  {
    id: 'warsaw-2025',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Jul 2025',
    month: 7,
    type: 'work',
    description: 'Six months in Warsaw for my Snowflake internship. Discovered pierogi, survived the cold, shipped production code, and used it as a base to explore Europe.',
    professional: [
      { role: 'SWE Intern', company: 'Snowflake' }
    ],
  },
  {
    id: 'prague-2025',
    city: 'Prague',
    country: 'Czech Republic',
    geo: { lon: 14.4, lat: 50.1 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2025',
    month: 8,
    type: 'travel',
    description: 'Weekend trip from Warsaw. Charles Bridge at sunrise, Old Town Square at night, and the best trdelník I never expected to love.',
    professional: null,
  },
  {
    id: 'warsaw-after-prague',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2025',
    month: 8,
    type: 'work',
    description: 'Back to base.',
    professional: null,
  },
  {
    id: 'budapest-2025',
    city: 'Budapest',
    country: 'Hungary',
    geo: { lon: 19.0, lat: 47.5 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2025',
    month: 8,
    type: 'travel',
    description: 'Thermal baths and ruin bars. Budapest has an energy like no other city, half historic grandeur and half underground cool.',
    professional: null,
  },
  {
    id: 'warsaw-after-budapest',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Aug 2025',
    month: 8,
    type: 'work',
    description: 'Back to base.',
    professional: null,
  },
  {
    id: 'krakow-2025',
    city: 'Krakow',
    country: 'Poland',
    geo: { lon: 19.9, lat: 50.1 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2025',
    month: 9,
    type: 'travel',
    description: 'Salt mines, pierogi (again), and some of the most powerful history I have ever walked through. Went mainly for an amusement park.',
    professional: null,
  },
  {
    id: 'warsaw-after-krakow',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2025',
    month: 9,
    type: 'work',
    description: 'Back to base.',
    professional: null,
  },
  {
    id: 'vienna-2025',
    city: 'Vienna',
    country: 'Austria',
    geo: { lon: 16.4, lat: 48.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2025',
    month: 9,
    type: 'travel',
    description: 'Classical music floating through the streets, endless coffee culture, went to the Belvedere and a classical concert.',
    professional: null,
  },
  {
    id: 'warsaw-after-vienna',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2025',
    month: 9,
    type: 'work',
    description: 'Back to base.',
    professional: null,
  },
  {
    id: 'copenhagen-2025',
    city: 'Copenhagen',
    country: 'Denmark',
    geo: { lon: 12.57, lat: 55.68 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2025',
    month: 9,
    type: 'travel',
    description: 'With my friends. Went to the Nyhavn and the big Copenhagen Zoo. Also a bizarre place.',
    professional: null,
  },
  {
    id: 'malmo-2025',
    city: 'Malmö',
    country: 'Sweden',
    geo: { lon: 13.0, lat: 55.6 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2025',
    month: 9,
    type: 'travel',
    description: 'A 20 min trip from Copenhagen. My friends insisted.',
    professional: null,
  },
  {
    id: 'warsaw-after-scandinavia',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Sep 2025',
    month: 9,
    type: 'work',
    description: 'Back to base.',
    professional: null,
  },
  {
    id: 'london-2025',
    city: 'London',
    country: 'United Kingdom',
    geo: { lon: -0.1, lat: 51.5 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Oct 2025',
    month: 10,
    type: 'travel',
    description: '3-day London visit. Museums, Notting Hill, Borough Market, St Paul’s Cathedral, and it was raining, yes. Loved it anyway. Probably the best city I have ever visited.',
    professional: null,
  },
  {
    id: 'warsaw-after-london',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Oct 2025',
    month: 10,
    type: 'work',
    description: 'Back to base.',
    professional: null,
  },
  {
    id: 'paris-nov-2025',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Nov 2025',
    month: 11,
    type: 'travel',
    description: 'Second time to Paris. Autumn leaves, croissants, and a city that felt like it was waiting for me. (Spoiler alert: it was.)',
    professional: null,
  },
  {
    id: 'warsaw-after-paris',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Nov 2025',
    month: 10,
    type: 'work',
    description: 'Back to base.',
    professional: null,
  },
  {
    id: 'paris-dec-2025',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Dec 2025',
    month: 11,
    type: 'travel',
    description: 'Third time to Paris. A quick trip while doing my interviews, Christmas was starting.',
    professional: null,
  },
  {
    id: 'warsaw-return-2025',
    city: 'Warsaw',
    country: 'Poland',
    geo: { lon: 21.0, lat: 52.2 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Nov 2025',
    month: 11,
    type: 'work',
    description: 'Back to wrap up the internship. Last pierogi runs and goodbyes.',
    professional: null,
  },
  {
    id: 'paris-dec-2025',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Dec 2025',
    month: 12,
    type: 'travel',
    description: 'Paris in winter. Christmas markets, lights on the Champs-Élysées, and the decision to come back for good.',
    professional: null,
  },
  {
    id: 'strasbourg-2025',
    city: 'Strasbourg',
    country: 'France',
    geo: { lon: 7.75, lat: 48.58 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Dec 2025',
    month: 12,
    type: 'travel',
    description: 'Christmas markets as well, raclette and very good crêpes. A very nice Christmas.',
    professional: null,
  },
  {
    id: 'paris-after-strasbourg',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Dec 2025',
    month: 12,
    type: 'travel',
    description: 'Back to Paris, funemployment, and getting ready for a new year.',
    professional: null,
  },
  {
    id: 'lebanon-return',
    city: 'Beirut',
    country: 'Lebanon',
    geo: { lon: 35.5, lat: 33.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Dec 2025 — Jan 2026',
    month: 12,
    type: 'home',
    description: 'Back home for the holidays. Recharged with family, really good food, and a nice ski trip before the next chapter.',
    professional: null,
  },
  {
    id: 'paris-2026',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Feb 2026',
    month: 2,
    type: 'work',
    description: 'Now based in Paris, building the future of AI at Mistral AI. Croissants for breakfast, code all day, Seine walks at sunset.',
    professional: [
      { role: 'Software Engineer', company: 'Mistral AI' }
    ],
  },
  {
    id: 'london-apr-2026',
    city: 'London',
    country: 'United Kingdom',
    geo: { lon: -0.1, lat: 51.5 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Apr 2026',
    month: 4,
    type: 'travel',
    description: 'A quick trip to see family and experience London again. Loved it. Bought some really cool vinyls and Hirono merch.',
    professional: null,
  },
  {
    id: 'paris-apr-2026',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Apr 2026',
    month: 4,
    type: 'travel',
    description: 'Back in Paris. Building, exploring, living.',
    professional: null,
  },
  {
    id: 'london-may-2026',
    city: 'London',
    country: 'United Kingdom',
    geo: { lon: -0.1, lat: 51.5 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'May 2026',
    month: 5,
    type: 'travel',
    description: 'A quick London trip. Strolled through Hyde Park and ate incredible Chinese and Indian food, then went to Code with Claude on May 20 and made some amazing connections there.',
    professional: null,
  },
  {
    id: 'paris-after-london-may-2026',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'May 2026',
    month: 5,
    type: 'travel',
    description: 'Flew back to Paris the same day, just enough time to repack before the next one.',
    professional: null,
  },
  {
    id: 'amsterdam-may-2026',
    city: 'Amsterdam',
    country: 'Netherlands',
    geo: { lon: 4.9, lat: 52.37 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'May 2026',
    month: 5,
    type: 'travel',
    description: 'Four days in Amsterdam with my boyfriend. Wandered the canals, the Van Gogh Museum, and the NEMO Science Museum, then watched Harry Styles live, a dream I had been holding onto for years.',
    professional: null,
  },
  {
    id: 'paris-after-amsterdam-2026',
    city: 'Paris',
    country: 'France',
    geo: { lon: 2.35, lat: 48.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'May 2026 — Present',
    month: 5,
    type: 'current',
    description: 'Home in Paris again. Back to building, back to the routine I love.',
    professional: null,
  },
  {
    id: 'deauville-jun-2026',
    city: 'Deauville',
    country: 'France',
    geo: { lon: 0.07, lat: 49.36 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: 'Jun 2026',
    month: 6,
    type: 'travel',
    description: 'A day trip to the Normandy coast. The long boardwalk, the striped parasols, oysters, and sea air, an hour from Paris.',
    professional: null,
  },
  {
    id: 'dolomites-jul-2026',
    city: 'Dolomites',
    country: 'Italy',
    geo: { lon: 12.13, lat: 46.54 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: '23–27 Jul 2026',
    month: 7,
    type: 'upcoming',
    description: 'A loop out of Venice by car. East to the Tre Cime and the pale lakes first, then west to Val Gardena, with two nights spent up on the mountain.',
    itinerary: 'https://itineraries.riwashouse.live/dolomites',
    professional: null,
    kind: "Couple's road trip",
    region: 'Italy · The Alps',
    nights: 4,
    depart: 'Jul 23',
    ret: 'Jul 27',
    code: 'IT',
    iata: 'VCE',
    startDate: '2026-07-23',
    endDate: '2026-07-27',
    theme: 'alpine',
    stops: ['Tre Cime', 'Lago di Braies', 'Val Gardena', 'Seceda', 'Alpe di Siusi'],
    mrz: 'P<ITADOLOMITES<<VALGARDENA<<<<<<<<<<<2307VCE<<4N',
  },
  {
    id: 'corfu-aug-2026',
    city: 'Corfu',
    country: 'Greece',
    geo: { lon: 19.92, lat: 39.62 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: '5–9 Aug 2026',
    month: 8,
    type: 'upcoming',
    description: 'Four of us meeting on one Ionian island. My parents coming in from Athens, my sister from Birmingham, me from Paris, all of us based in Dassia on the green northeast coast.',
    itinerary: 'https://itineraries.riwashouse.live/corfu',
    professional: null,
    kind: 'Family trip',
    region: 'Greece · Ionian Sea',
    nights: 4,
    depart: 'Aug 5',
    ret: 'Aug 9',
    code: 'GR',
    iata: 'CFU',
    startDate: '2026-08-05',
    endDate: '2026-08-09',
    theme: 'sea',
    stops: ['Dassia', 'Old Town', 'Paleokastritsa', "Canal d'Amour"],
    mrz: 'P<GRCCORFU<<DASSIA<<<<<<<<<<<<<<<0508CFU<<4N',
  },
  {
    id: 'beirut-jul-2026',
    city: 'Beirut',
    country: 'Lebanon',
    geo: { lon: 35.5, lat: 33.9 },
    get coordinates() { return geoToGrid(this.geo.lon, this.geo.lat); },
    dateRange: '11 Jul 2026',
    month: 7,
    type: 'upcoming',
    description: 'Heading home for the summer. Family, the sea, and the food I miss most. No plan this time, just Beirut.',
    // A homecoming, not a written-up trip — it rides the Departures board and its
    // date-accurate countdown, then folds back into the Beirut base once the day passes.
    itinerary: null,
    professional: null,
    kind: 'Homecoming',
    region: 'Lebanon · Home',
    depart: 'Jul 11',
    code: 'LB',
    iata: 'BEY',
    startDate: '2026-07-11',
    endDate: '2026-07-11',
    theme: 'city',
  }
];

export function getJourneyStats() {
  const cities = new Set(journeyPoints.map(p => p.city));
  const countries = new Set(journeyPoints.map(p => p.country));
  const continents = new Set();
  const continentMap = {
    'Lebanon': 'Asia', 'France': 'Europe', 'Italy': 'Europe',
    'Japan': 'Asia', 'Poland': 'Europe', 'Czech Republic': 'Europe',
    'Hungary': 'Europe', 'Austria': 'Europe', 'Denmark': 'Europe',
    'Sweden': 'Europe', 'United Kingdom': 'Europe',
    'Netherlands': 'Europe', 'Greece': 'Europe',
  };
  journeyPoints.forEach(p => {
    if (continentMap[p.country]) continents.add(continentMap[p.country]);
  });
  return { cities: cities.size, countries: countries.size, continents: continents.size };
}

/* ---- Arrivals & Departures board model ---- */

// How "significant" a stay is when choosing the representative entry for a city.
const TYPE_RANK = { current: 4, work: 3, home: 2, travel: 1, upcoming: 0 };
const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// City → IATA code for the board's mono "flight code" column.
const IATA = {
  Beirut: 'BEY', Paris: 'CDG', Rome: 'FCO', Venice: 'VCE', Florence: 'FLR',
  Tokyo: 'HND', Osaka: 'KIX', Kyoto: 'UKY', Nara: 'NAR', 'Mt Fuji': 'NGO',
  Warsaw: 'WAW', Prague: 'PRG', Budapest: 'BUD', Krakow: 'KRK', Vienna: 'VIE',
  Copenhagen: 'CPH', 'Malmö': 'MMX', London: 'LHR', Strasbourg: 'SXB',
  Amsterdam: 'AMS', Dolomites: 'VCE', Corfu: 'CFU', Deauville: 'DOL',
};

export function iataFor(city) {
  return IATA[city] || '';
}

const yearOf = (p) => {
  const m = /(20\d{2})/.exec(p.dateRange || '');
  return m ? Number(m[1]) : null;
};

const DAY_MS = 86400000;

// Date-accurate board phase for a featured itinerary, comparing today (UTC) to
// the trip's own window. "boarding" is the departure day *itself*, so the amber
// BOARDING flap only ever lights up on the real date — never before:
//   scheduled → still ahead        boarding  → the departure day
//   departed  → mid-trip           documented → over (slides below, kept for the write-up)
function tripPhase(p, iso) {
  if (p.endDate < iso) return 'documented';
  if (iso < p.startDate) return 'scheduled';
  if (iso === p.startDate) return 'boarding';
  return 'departed';
}

// Whole days from today to the departure date (0 once the day arrives).
function daysToDeparture(startDate, iso) {
  return Math.max(0, Math.round((Date.parse(startDate) - Date.parse(iso)) / DAY_MS));
}

// The featured spread is the live slate only: any dated trip (one carrying a
// start/end window) still ahead or in progress, soonest departure first. Once a
// trip's dates pass it graduates out of here and into the Arrivals ledger (below),
// so a finished trip is never shown twice. A written-up itinerary is optional — a
// trip with no write-up (e.g. a homecoming) still rides the board and its countdown.
export function getFeaturedItineraries(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  return journeyPoints
    .filter((p) => p.startDate && p.endDate && tripPhase(p, iso) !== 'documented')
    .map((p) => ({
      ...p,
      phase: tripPhase(p, iso),
      days: daysToDeparture(p.startDate, iso),
    }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate)); // soonest departure first
}

// Deduped, newest-first ledger of every place already arrived in.
// journeyPoints stays intact (the map route needs its order + transit duplicates);
// this view collapses it to one row per city.
export function getArrivalsLedger(today = new Date()) {
  const iso = today.toISOString().slice(0, 10);
  // Everything already landed in. A trip is held out only while it's still a live
  // featured departure (an itinerary trip not yet past its dates) or otherwise
  // still upcoming; the moment it's documented it graduates in here. Older trips
  // that gain an itinerary link stay put and simply become clickable rows.
  const isLiveFeature = (p) => p.startDate && p.endDate && tripPhase(p, iso) !== 'documented';
  const isFutureUpcoming = (p) => p.type === 'upcoming' && !(p.endDate < iso);
  const arrived = journeyPoints.filter((p) => !isLiveFeature(p) && !isFutureUpcoming(p));

  const byCity = new Map();
  arrived.forEach((p, i) => {
    const e = byCity.get(p.city) || { city: p.city, country: p.country, entries: [] };
    e.entries.push({ p, i });
    byCity.set(p.city, e);
  });

  const items = [];
  for (const { city, country, entries } of byCity.values()) {
    // Representative = most significant stay; ties broken by earliest appearance.
    const rep = entries
      .slice()
      .sort((a, b) => TYPE_RANK[b.p.type] - TYPE_RANK[a.p.type] || a.i - b.i)[0].p;
    // Pull a company from any entry for the city (e.g. Paris → Mistral, Warsaw → Snowflake).
    const withRole = entries.find((e) => e.p.professional);
    const company = withRole ? withRole.p.professional[0].company : null;
    // A written-up trip makes its city's row link out (e.g. Dolomites, Corfu once
    // their dates pass — or any older stay you later document).
    const withItin = entries.find((e) => e.p.itinerary);
    const itinerary = withItin ? withItin.p.itinerary : null;

    const status =
      rep.type === 'current' ? 'RESIDENT' : rep.type === 'home' ? 'HOME' : 'STAMPED';
    const y = yearOf(rep);
    const label =
      rep.type === 'current'
        ? 'NOW'
        : rep.month && y
          ? `${MONTHS[rep.month]} ${y}`
          : y
            ? String(y)
            : 'HOME';
    const sortKey =
      rep.type === 'current' ? Infinity : y ? y * 100 + (rep.month || 0) : 0;

    items.push({
      id: rep.id,
      city,
      country,
      iata: IATA[city] || '',
      region: company ? `${country} · ${company}` : country,
      label,
      status,
      sortKey,
      itinerary,
    });
  }

  items.sort((a, b) => b.sortKey - a.sortKey);
  return items;
}
