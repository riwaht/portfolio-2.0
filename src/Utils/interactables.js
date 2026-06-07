// Free-roam hotspot config for the House experience.
//
// Each entry turns one of the house's objects into a clickable hotspot. The
// `focus` camera framings are world-space positions authored at model
// rotation.y === 0 (the ModelController resets rotation to 0 on focus so these
// stay valid). `meshNames` are the GLTF node names raycast against in Model.jsx.
//
// action:
//   'info'   -> camera focuses on the object and an InfoCard (label + blurb) shows.
//   'fridge' -> same as info, and the fridge door swings open.
//   'pc'     -> camera zooms to the screen (responsive) and the on-screen folder UI opens.

export const interactables = [
  {
    id: 'fridge',
    meshNames: ['Fridge', 'FridgeDoor'],
    label: 'Fridge',
    description: 'Mostly cold brew, leftover takeout, and an emergency chocolate stash. Go on, open it.',
    focus: { position: [25, 15, 28], lookAt: [12, 5, 0] },
    action: 'fridge',
  },
  {
    id: 'oven',
    meshNames: ['Stove'],
    label: 'The stove',
    description: 'Where I claim to make the best pancakes in the world. The smoke alarm respectfully disagrees.',
    focus: { position: [17, 15, 30], lookAt: [-12, 2, 0] },
    action: 'info',
  },
  {
    id: 'gloves',
    meshNames: ['BoxingGlove'],
    label: 'Boxing gloves',
    description: 'Stress relief between deploys. The bag has never once filed a bug report.',
    focus: { position: [-20, 10, 10], lookAt: [0, 0, 0] },
    action: 'info',
  },
  {
    id: 'dipbars',
    meshNames: ['Dip_Bar'],
    label: 'Dip bars',
    description: 'Ego lifting: mandatory. Good form: negotiable. Careful on these.',
    focus: { position: [-40, 10, 15], lookAt: [-10, 3, 0] },
    action: 'info',
  },
  {
    id: 'sunflower',
    meshNames: ['Sunflower'],
    label: 'Sunflowers',
    description: 'My favorite. They follow the light all day — honestly, relatable. What’s yours?',
    focus: { position: [-15, 20, -33], lookAt: [15, -5, 0] },
    action: 'info',
  },
  {
    id: 'mango',
    meshNames: ['Object_3003', 'Object_3003_1', 'Object_3003_2'],
    label: 'Mango tree',
    description: 'Been here for years and, frankly, more productive than me in the summer.',
    focus: { position: [-40, 20, -25], lookAt: [-2, 7, 0] },
    action: 'info',
  },
  {
    id: 'manga',
    meshNames: ['Tokyo_Ghoul_Manga'],
    label: 'Manga shelf',
    description: 'Tokyo Ghoul on top. Reading is my favorite way to actually log off.',
    focus: { position: [15, 15, -32], lookAt: [-10, 0, 0] },
    action: 'info',
  },
  {
    id: 'pc',
    meshNames: ['Screen2', 'Screen'],
    label: 'Battlestation',
    description: 'Where most of the magic (and the bugs) happen. Click the screen to dig into my work.',
    // Default desktop framing; `focusResponsive` overrides per breakpoint at runtime.
    focus: { position: [15, 14, -7], lookAt: [14, 13, 0] },
    focusResponsive: {
      small: { position: [18, 16, -5], lookAt: [14, 13, 0] },   // <= 480px
      mobile: { position: [16, 15, -6], lookAt: [14, 13, 0] },  // <= 768px
      desktop: { position: [15, 14, -7], lookAt: [14, 13, 0] }, // > 768px
    },
    action: 'pc',
  },
];

// mesh node name -> interactable, for O(1) raycast hit lookup.
export const interactableByMesh = interactables.reduce((map, item) => {
  item.meshNames.forEach((name) => {
    map[name] = item;
  });
  return map;
}, {});
