// A wheel-throwing log. Each piece carries its glaze, when it was fired, and honest
// notes on what came out nice and what went wrong — a way to actually watch the
// progress. The little vessel drawings live in Pottery/PotteryVessel (keyed by `art`);
// drop a real photo path on a piece and the field notes will show it instead.
//
// NOTE: the `notes` below are placeholders drawn from what the pieces look like —
// swap in your own words. Add a new object to log a new piece.
export const potteryPieces = [
  {
    id: 'honey-cup',
    name: 'Honey cup',
    form: 'Wheel-thrown cup',
    glaze: 'Amber honey',
    fired: 'Mar 2024',
    art: 'amberCup',
    accent: '#C0842F',
    photo: null,
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
    fired: 'Mar 2024',
    art: 'blueBowl',
    accent: '#6E93C8',
    photo: null,
    tag: { nice: 'even speckle', oops: 'warped rim' },
    notes: {
      tried: 'A white glaze with blue specks flicked over the inside.',
      nice: 'The speckle scattered just right, nothing too heavy.',
      oops: 'The rim warped a little on the wheel and dried not-quite-round.',
      next: 'Slow down on the last pull and compress the rim more.',
    },
  },
  {
    id: 'celadon-bowl',
    name: 'Celadon bowl',
    form: 'Wheel-thrown bowl',
    glaze: 'Green celadon',
    fired: 'Apr 2024',
    art: 'greenBowl',
    accent: '#7D9E76',
    photo: null,
    tag: { nice: 'pale rim break', oops: 'ran to foot' },
    notes: {
      tried: 'A thick celadon pulled over a dark iron slip.',
      nice: 'The glaze broke pale over the rim, exactly how I hoped.',
      oops: 'It ran to the foot and nearly stuck to the kiln shelf.',
      next: 'Wax the foot, and go one coat thinner near the base.',
    },
  },
];

// Little kiln-log stats for the masthead.
export function getPotteryStats() {
  const glazes = new Set(potteryPieces.map((p) => p.glaze));
  return { pieces: potteryPieces.length, glazes: glazes.size };
}
