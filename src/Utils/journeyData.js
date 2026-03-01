export const journeyPoints = [
  {
    id: 'lebanon-home',
    location: 'Beirut, Lebanon',
    country: 'Lebanon',
    coordinates: { x: 58.5, y: 42.5 },
    dateRange: 'Home base',
    type: 'home',
    description: 'Where it all started. Born and raised in Lebanon — learned to code, built my first projects, and dreamed about what comes next.',
    professional: [
      { role: 'Simulation Engineer', company: 'inmind.ai' },
      { role: 'Coding Instructor', company: 'Freelance' }
    ],
    order: 0
  },
  {
    id: 'japan-2025',
    location: 'Japan',
    country: 'Japan',
    coordinates: { x: 87, y: 39 },
    subLocations: [
      { name: 'Tokyo', offset: { x: 3, y: -2 } },
      { name: 'Osaka', offset: { x: -2, y: 2 } },
      { name: 'Kyoto', offset: { x: -3, y: 0 } },
      { name: 'Nara', offset: { x: -1, y: 3 } },
      { name: 'Mt Fuji', offset: { x: 1, y: -3 } }
    ],
    dateRange: 'Feb — Mar 2025',
    type: 'travel',
    description: 'First big adventure abroad. Explored temples in Kyoto, ate ramen in every city, stood in awe at Mt Fuji, and wandered through Tokyo at 3am.',
    professional: null,
    order: 1
  },
  {
    id: 'warsaw-2025',
    location: 'Warsaw, Poland',
    country: 'Poland',
    coordinates: { x: 52.5, y: 30 },
    dateRange: 'Jul — Dec 2025',
    type: 'work',
    description: 'Six months in Warsaw for my Snowflake internship. Discovered pierogi, survived the cold, shipped production code, and used it as a base to explore Europe.',
    professional: [
      { role: 'SWE Intern', company: 'Snowflake' }
    ],
    order: 2
  },
  {
    id: 'prague-2025',
    location: 'Prague, Czech Republic',
    country: 'Czech Republic',
    coordinates: { x: 51, y: 31.5 },
    dateRange: 'Aug 2025',
    type: 'travel',
    description: 'Weekend trip from Warsaw. Charles Bridge at sunrise, Old Town Square at night, and the best trdelnik I never expected to love.',
    professional: null,
    order: 3
  },
  {
    id: 'budapest-2025',
    location: 'Budapest, Hungary',
    country: 'Hungary',
    coordinates: { x: 52, y: 33 },
    dateRange: 'Aug 2025',
    type: 'travel',
    description: 'Thermal baths and ruin bars. Budapest has an energy like no other city — half historic grandeur, half underground cool.',
    professional: null,
    order: 4
  },
  {
    id: 'krakow-2025',
    location: 'Krakow, Poland',
    country: 'Poland',
    coordinates: { x: 52, y: 31 },
    dateRange: 'Sep 2025',
    type: 'travel',
    description: 'Salt mines, pierogi (again), and some of the most powerful history I have ever walked through.',
    professional: null,
    order: 5
  },
  {
    id: 'vienna-2025',
    location: 'Vienna, Austria',
    country: 'Austria',
    coordinates: { x: 50.5, y: 32 },
    dateRange: 'Sep 2025',
    type: 'travel',
    description: 'Classical music floating through the streets, endless coffee culture, and Sachertorte that lived up to the hype.',
    professional: null,
    order: 6
  },
  {
    id: 'london-2025',
    location: 'London, UK',
    country: 'United Kingdom',
    coordinates: { x: 47.5, y: 29.5 },
    dateRange: 'Oct 2025',
    type: 'travel',
    description: 'Quick London visit — museums, markets, and yes, it rained every single day. Loved it anyway.',
    professional: null,
    order: 7
  },
  {
    id: 'paris-2025',
    location: 'Paris, France',
    country: 'France',
    coordinates: { x: 49, y: 32 },
    dateRange: 'Nov — Dec 2025',
    type: 'travel',
    description: 'First time in Paris. Fell in love with the city before even knowing I would end up working here.',
    professional: null,
    order: 8
  },
  {
    id: 'lebanon-return',
    location: 'Beirut, Lebanon',
    country: 'Lebanon',
    coordinates: { x: 58.5, y: 42.5 },
    dateRange: 'Dec 2025 — Jan 2026',
    type: 'home',
    description: 'Back home for the holidays. Recharged with family, good food, and a view of the Mediterranean before the next chapter.',
    professional: null,
    order: 9
  },
  {
    id: 'paris-2026',
    location: 'Paris, France',
    country: 'France',
    coordinates: { x: 49, y: 32 },
    dateRange: 'Feb 2026 — Present',
    type: 'current',
    description: 'Now based in Paris, building the future of AI at Mistral. Croissants for breakfast, code all day, Seine walks at sunset.',
    professional: [
      { role: 'Software Engineer', company: 'Mistral' }
    ],
    order: 10
  }
];
