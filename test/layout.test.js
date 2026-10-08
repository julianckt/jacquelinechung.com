import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeInitialLayout, ROW_DEFINITIONS, MOBILE_ROW_DEFINITIONS, computeContainmentScale } from '../src/layout-grid.js';
import { getScaledDimensions } from '../src/elements-data.js';



test('computeInitialLayout positions all 18 elements across 8 rows centered in viewport', () => {
  const viewportWidth = 1440;
  const viewportHeight = 1000;

  // Mock element specs dictionary with scaled dimensions
  const elementSpecs = {};
  for (const row of ROW_DEFINITIONS) {
    for (const id of row.items) {
      elementSpecs[id] = {
        id,
        scaledWidth: id === 'jacqueline' ? 1150 : id === 'chung' ? 680 : 200,
        scaledHeight: id === 'jacqueline' || id === 'chung' ? 200 : 70,
      };
    }
  }

  const layout = computeInitialLayout(viewportWidth, viewportHeight, elementSpecs);

  // 18 items returned
  assert.equal(Object.keys(layout).length, 18, 'Must position all 18 elements');

  // Single-item rows must be centered horizontally
  assert.equal(layout['jacqueline'].x, viewportWidth / 2, 'jacqueline centered horizontally');
  assert.equal(layout['chung'].x, viewportWidth / 2, 'chung centered horizontally');
  assert.equal(layout['Group 64'].x, viewportWidth / 2, 'Group 64 centered horizontally');

  // Multi-item rows should be centered as a group
  const row1Items = ['this', 'is1', 'the', 'website', 'of'];
  const row1Left = Math.min(...row1Items.map(id => layout[id].x - elementSpecs[id].scaledWidth / 2));
  const row1Right = Math.max(...row1Items.map(id => layout[id].x + elementSpecs[id].scaledWidth / 2));
  const row1Center = (row1Left + row1Right) / 2;
  assert.ok(Math.abs(row1Center - viewportWidth / 2) < 1, 'Row 1 centered horizontally');

  // Rows strictly advance vertically
  assert.ok(layout['this'].y < layout['jacqueline'].y, 'Row 1 above Row 2');
  assert.ok(layout['jacqueline'].y < layout['chung'].y, 'Row 2 above Row 3');
  assert.ok(layout['chung'].y < layout['and'].y, 'Row 3 above Row 4');
  assert.ok(layout['and'].y < layout['under'].y, 'Row 4 above Row 5');
  assert.ok(layout['under'].y < layout['Group 67'].y, 'Row 5 above Row 6');
  assert.ok(layout['Group 67'].y < layout['Group 65'].y, 'Row 6 above Row 7');
  assert.ok(layout['Group 65'].y < layout['Group 64'].y, 'Row 7 above Row 8');

  // Entire block centered around viewportHeight / 2
  const topY = Math.min(...Object.values(layout).map(item => item.y - item.height / 2));
  const bottomY = Math.max(...Object.values(layout).map(item => item.y + item.height / 2));
  const totalCenterY = (topY + bottomY) / 2;
  assert.ok(Math.abs(totalCenterY - viewportHeight / 2) < 5, 'Layout vertically centered');
});

test('MOBILE_ROW_DEFINITIONS specifies 12 rows with the agreed mobile split and all 18 elements', () => {
  assert.ok(Array.isArray(MOBILE_ROW_DEFINITIONS), 'MOBILE_ROW_DEFINITIONS should be defined');
  assert.equal(MOBILE_ROW_DEFINITIONS.length, 12, 'Must have exactly 12 rows');

  // Verify each row's items
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[0].items, ['this', 'is1', 'the']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[1].items, ['website', 'of']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[2].items, ['jacqueline']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[3].items, ['chung']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[4].items, ['and', 'it', 'is2']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[5].items, ['still', 'under']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[6].items, ['construction']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[7].items, ['Group 67']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[8].items, ['Group 66']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[9].items, ['Group 65']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[10].items, ['Group 68']);
  assert.deepEqual(MOBILE_ROW_DEFINITIONS[11].items, ['Group 64']);

  // Verify total items count is 18
  const totalItems = MOBILE_ROW_DEFINITIONS.reduce((acc, row) => acc + row.items.length, 0);
  assert.equal(totalItems, 18, 'All 18 items must be present');
});

test('computeContainmentScale calculates 2D containment scale factor based on natural bounding box', () => {
  const baseDims = getScaledDimensions(1.0);

  // 1. Large desktop viewport (1440x900) with desktop rows: should clamp to 1.0
  const desktopScale = computeContainmentScale(1440, 900, ROW_DEFINITIONS, baseDims);
  assert.equal(desktopScale, 1.0, 'Desktop viewport with ample space clamps to 1.0');

  // 2. Narrow mobile viewport (390x844) with mobile rows: should scale down to fit width
  const mobileScale = computeContainmentScale(390, 844, MOBILE_ROW_DEFINITIONS, baseDims, { paddingX: 20, paddingY: 20 });
  assert.ok(mobileScale < 1.0, 'Mobile viewport scales down below 1.0');
  assert.ok(mobileScale >= 0.4, 'Mobile scale is reasonable (> 0.4)');

  // Width of widest element ('jacqueline' native width 798px at 1.0) must fit in 390 - 40 = 350px
  assert.ok(798 * mobileScale <= 350, 'Widest element scaled fits within available width');

  // 3. Short desktop window (1200x300): should scale down by height (containment)
  const shortScale = computeContainmentScale(1200, 300, ROW_DEFINITIONS, baseDims, { paddingX: 20, paddingY: 20 });
  assert.ok(shortScale < 1.0, 'Short window scales down below 1.0');
  assert.ok(shortScale < desktopScale, 'Short window scale is constrained by height');
});

test('computeInitialLayout automatically uses MOBILE_ROW_DEFINITIONS when viewportWidth < 768 and keeps all items inside viewport', () => {
  const viewportWidth = 390;
  const viewportHeight = 844;
  const baseDims = getScaledDimensions(1.0);
  const scale = computeContainmentScale(viewportWidth, viewportHeight, MOBILE_ROW_DEFINITIONS, baseDims, { paddingX: 20, paddingY: 20 });
  const scaledDims = getScaledDimensions(scale);

  const layout = computeInitialLayout(viewportWidth, viewportHeight, scaledDims, { scaleFactor: scale });

  assert.equal(Object.keys(layout).length, 18, 'All 18 elements positioned');

  // Verify it used mobile layout by checking rows
  // On mobile: 'website' is in row 2, not row 1
  assert.equal(layout['this'].row, 1);
  assert.equal(layout['website'].row, 2);
  assert.equal(layout['jacqueline'].row, 3);
  assert.equal(layout['Group 64'].row, 12);

  // Check all 18 elements are strictly inside viewport bounds with margin
  for (const [id, item] of Object.entries(layout)) {
    const halfW = item.width / 2;
    const halfH = item.height / 2;
    const left = item.x - halfW;
    const right = item.x + halfW;
    const top = item.y - halfH;
    const bottom = item.y + halfH;

    assert.ok(left >= 0, `${id} left edge (${left}) >= 0`);
    assert.ok(right <= viewportWidth, `${id} right edge (${right}) <= viewportWidth (${viewportWidth})`);
    assert.ok(top >= 0, `${id} top edge (${top}) >= 0`);
    assert.ok(bottom <= viewportHeight, `${id} bottom edge (${bottom}) <= viewportHeight (${viewportHeight})`);
  }
});



