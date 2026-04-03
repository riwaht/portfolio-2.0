/**
 * Generate dot-matrix world map from real geographic data.
 *
 * Uses Natural Earth 110m land boundaries (via world-atlas)
 * and standard equirectangular projection so that geoToGrid
 * is trivially correct: col = (lon+180)/360 * COLS, etc.
 *
 * Run: node scripts/generateDotMap.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import * as topojson from 'topojson-client';
import { geoContains } from 'd3-geo';

// Grid dimensions — tweak for desired density
const COLS = 180;
const ROWS = 90;

// Load world land boundaries
const world = JSON.parse(
  readFileSync(
    new URL('../node_modules/world-atlas/land-50m.json', import.meta.url),
    'utf-8'
  )
);
const land = topojson.feature(world, world.objects.land);

// For each grid cell, check if the center point is on land
const landRows = [];
for (let row = 0; row < ROWS; row++) {
  const lat = 90 - (row + 0.5) / ROWS * 180;
  const ranges = [];
  let start = null;

  for (let col = 0; col < COLS; col++) {
    const lon = (col + 0.5) / COLS * 360 - 180;
    const onLand = geoContains(land, [lon, lat]);

    if (onLand && start === null) {
      start = col;
    } else if (!onLand && start !== null) {
      ranges.push([start, col - 1]);
      start = null;
    }
  }
  if (start !== null) {
    ranges.push([start, COLS - 1]);
  }
  landRows.push(ranges);
}

// Format as JS
const formatted = landRows
  .map(ranges => {
    if (ranges.length === 0) return '  []';
    const inner = ranges.map(([s, e]) => `[${s},${e}]`).join(', ');
    return `  [${inner}]`;
  })
  .join(',\n');

console.log(`Generated ${ROWS} rows, ${landRows.flat().length} ranges`);
console.log(`\nPaste into worldDotMap.js:\n`);
console.log(`export const landRows = [\n${formatted},\n];`);

// Also write to a temp file for easy copy
writeFileSync(
  new URL('../src/Utils/landRows.generated.js', import.meta.url),
  `// Auto-generated from Natural Earth 110m — do not edit manually\n// Grid: ${COLS} cols × ${ROWS} rows, equirectangular projection\n// col = (lon+180)/360 * ${COLS}, row = (90-lat)/180 * ${ROWS}\n\nexport const landRows = [\n${formatted},\n];\n`
);
console.log('\nWritten to src/Utils/landRows.generated.js');
