// A wheel-throwing log, oldest first, so the shelf reads as real progress. Each
// piece carries its glaze, when it was fired, and honest notes on the form and the
// glaze, what came out nice and what went wrong. The little vessel drawings
// (Pottery/PotteryVessel, keyed by `art`) sit on the shelf; the real `photo` shows
// inside the field notes on click.
//
// The running thread: the walls were thick and a bit fat on the first two, and the
// pull finally clicked on the blue one. Tweak any wording freely.
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
    tag: { nice: 'pale rim', oops: 'thick walls' },
    notes: {
      tried: 'My very first one on the wheel, a green celadon over dark iron.',
      nice: 'The celadon broke pale over the rim, just how I wanted.',
      oops: 'The walls came out thick and a bit fat. I could have kept pulling them taller and thinner.',
      next: 'Trust the clay and pull more before it firms up.',
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
    tag: { nice: 'glossy pool', oops: 'still thick' },
    notes: {
      tried: 'Same fight with the walls, this time under a thick amber glaze.',
      nice: 'The glaze pooled deep and glossy down the sides.',
      oops: 'Still a bit fat. I pulled more than the first but stopped too early, and the glaze crawled off the rim.',
      next: 'One more pull each time, and wipe the dust off the rim before glazing.',
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
    tag: { nice: 'thin at last', oops: 'uneven rim' },
    notes: {
      tried: 'Blue specks over white, and finally really committing to the pull.',
      nice: 'This is where it clicked, thinner and taller walls at last, and the speckle scattered just right.',
      oops: 'The rim went a little uneven on the last pull, but the wall was the best yet.',
      next: 'Keep this height, and steady the rim as I finish.',
    },
  },
];

// Total pots off the wheel so far. Only the finished ones (glazed, fired, and
// photographed) earn a spot on the shelf above and appear in `potteryPieces`;
// this counts everything thrown, including pieces still drying or unglazed.
// Bump it as more come out of the kiln.
export const potsThrown = 8;

// Little kiln-log stats for the masthead. `pieces` is everything thrown;
// `finished` is how many made it onto the shelf.
export function getPotteryStats() {
  const glazes = new Set(potteryPieces.map((p) => p.glaze));
  return { pieces: potsThrown, glazes: glazes.size, finished: potteryPieces.length };
}
