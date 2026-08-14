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
  {
    id: 'brushed-bowl',
    name: 'Brushed bowl',
    form: 'Wheel-thrown bowl',
    glaze: 'Iron brushed on white',
    fired: 'Jul 2026',
    art: 'brushedBowl',
    accent: '#A9784B',
    photo: '/Images/pottery/brushed-bowl.jpg',
    tag: { nice: 'soft brushwork', oops: 'glaze ran' },
    notes: {
      tried: 'Kept the outside plain and warm and put all the colour inside, iron brushed under a milky white.',
      nice: 'The brush marks stayed soft and warm under the white, and the throwing rings still read right through the outside.',
      oops: 'I poured in too much glaze, so it ran over the lip and dripped down the outside, and the rim dried a little wavy.',
      next: 'Less glaze in the pour, and wipe the rim back before it goes in the kiln.',
    },
  },
  {
    id: 'cobalt-cup',
    name: 'Cobalt cup',
    form: 'Wheel-thrown tumbler',
    glaze: 'Cobalt on cream',
    fired: 'Jul 2026',
    art: 'cobaltCup',
    accent: '#3A63AE',
    photo: '/Images/pottery/cobalt-cup.jpg',
    tag: { nice: 'round belly', oops: 'low glaze line' },
    notes: {
      tried: 'A rounder tumbler this time, cream down the outside and a deep cobalt dipped inside.',
      nice: 'The belly came out full and even, thin walls all the way up, and the cobalt pooled dark and glossy.',
      oops: 'One drip of cream ran down the front, and the line where the glaze stops sits low and a bit crooked.',
      next: 'Dip slower and hold it level so the glaze line lands straight.',
    },
  },
  {
    id: 'periwinkle-bowl',
    name: 'Periwinkle bowl',
    form: 'Wheel-thrown low bowl',
    glaze: 'Mottled periwinkle',
    fired: 'Aug 2026',
    art: 'periwinkleBowl',
    accent: '#7B92CC',
    photo: '/Images/pottery/periwinkle-bowl.jpg',
    tag: { nice: 'speckled blue', oops: 'oval rim' },
    notes: {
      tried: 'A wide, shallow bowl. A friend glazed this one for me, a mottled periwinkle inside and out.',
      nice: 'The blue broke light and speckled over the rim and went deep and even down in the well.',
      oops: 'The rim went properly oval, and a couple of patches by the foot missed the glaze.',
      next: 'Let a wide one firm up before I cut it off the wheel, and lift it with both hands.',
    },
  },
  {
    id: 'sage-bowl',
    name: 'Sage bowl',
    form: 'Wheel-thrown bowl',
    glaze: 'Sage celadon',
    fired: 'Aug 2026',
    art: 'sageBowl',
    accent: '#93A98C',
    photo: '/Images/pottery/sage-bowl.jpg',
    tag: { nice: 'straight walls', oops: 'heavy base' },
    notes: {
      tried: 'Straight walls this time, plain sand outside and a soft sage pooled inside.',
      nice: 'The sage settled into the throwing rings and went warm and gold where it ran thin.',
      oops: 'The wall is thicker at the bottom than the top, and the rim came out a touch wavy again.',
      next: 'Even the wall out from the base up before the last pull, and true the rim as I finish.',
    },
  },
];

// Total pots off the wheel so far. Only the finished ones (glazed, fired, and
// photographed) earn a spot on the shelf above and appear in `potteryPieces`;
// this counts everything thrown, including pieces still drying or unglazed.
// Bump it as more come out of the kiln.
export const potsThrown = 10;

// Little kiln-log stats for the masthead. `pieces` is everything thrown;
// `finished` is how many made it onto the shelf.
export function getPotteryStats() {
  const glazes = new Set(potteryPieces.map((p) => p.glaze));
  return { pieces: potsThrown, glazes: glazes.size, finished: potteryPieces.length };
}
