import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeInitialLayout, ROW_DEFINITIONS } from '../src/layout-grid.js';

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
