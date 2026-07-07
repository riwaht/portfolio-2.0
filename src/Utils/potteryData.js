// A wheel-throwing log, oldest first, so the shelf reads as real progress. Each
// piece carries its glaze, when it was fired, and honest notes on what came out
// nice and what went wrong. The little vessel drawings (Pottery/PotteryVessel,
// keyed by `art`) sit on the shelf; a real `photo` shows inside the field notes.
//
// NOTE: `fired` dates and `notes` below are placeholders — swap in your own.
// Photos: drop the files at the `photo` paths (in public/Images/pottery/) and they
// appear in the field notes automatically; until then it falls back to the drawing.
export const potteryPieces = [
  {
    id: 'celadon-bowl',
    name: 'Celadon bowl',
    form: 'Wheel-thrown bowl',
    glaze: 'Green celadon',
    fired: 'Apr 2026',
    art: 'greenBowl',
    accent: '#7D9E76',
    photo: '/Images/pottery/celadon-bowl.jpg',
    tag: { nice: 'pale rim break', oops: 'ran to foot' },
    notes: {
      tried: 'My first one. A thick celadon pulled over a dark iron slip.',
      nice: 'The glaze broke pale over the rim, exactly how I hoped.',
      oops: 'It ran to the foot and nearly stuck to the kiln shelf.',
      next: 'Wax the foot, and go one coat thinner near the base.',
    },
  },
  {
    id: 'honey-cup',
    name: 'Honey cup',
    form: 'Wheel-thrown cup',
    glaze: 'Amber honey',
    fired: 'May 2026',
    art: 'amberCup',
    accent: '#C0842F',
    photo: '/Images/pottery/honey-cup.jpg',
    tag: { nice: 'glossy pool', oops: 'rim crawl' },
    notes: {
      tried: 'A thick amber glaze over pale stoneware, dipped in one go.',
      nice: 'It pooled thick and glossy where it ran down the walls.',
      oops: 'The glaze crawled back off the rim and left a dry, raw patch.',
      next: 'Wipe the bisque dust off the rim before glazing.',
    },
  },
  {
    id: 'speckle-bowl',
    name: 'Speckle bowl',
    form: 'Wheel-thrown bowl',
    glaze: 'Blue on white',
    fired: 'Jun 2026',
    art: 'blueBowl',
    accent: '#6E93C8',
    photo: '/Images/pottery/speckle-bowl.jpg',
    tag: { nice: 'even speckle', oops: 'warped rim' },
    notes: {
      tried: 'A white glaze with blue specks flicked over the inside.',
      nice: 'The speckle scattered just right, nothing too heavy.',
      oops: 'The rim warped a little on the wheel and dried not-quite-round.',
      next: 'Slow down on the last pull and compress the rim more.',
    },
  },
];

// Little kiln-log stats for the masthead.
export function getPotteryStats() {
  const glazes = new Set(potteryPieces.map((p) => p.glaze));
  return { pieces: potteryPieces.length, glazes: glazes.size };
}
