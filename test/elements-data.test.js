import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ELEMENT_DEFINITIONS, getScaledDimensions } from '../src/elements-data.js';

test('defines all 18 elements with required properties', () => {
  const ids = Object.keys(ELEMENT_DEFINITIONS);
  assert.equal(ids.length, 18, 'Must have exactly 18 elements');

  for (const [id, def] of Object.entries(ELEMENT_DEFINITIONS)) {
    assert.equal(def.id, id);
    assert.ok(def.svg, `${id} must have svg filename`);
    assert.ok(def.width > 0, `${id} must have width`);
    assert.ok(def.height > 0, `${id} must have height`);
    assert.ok(def.type === 'pill' || def.type === 'word', `${id} must be pill or word`);
    assert.ok(def.scale > 0, `${id} must have scale`);

    if (def.type === 'word') {
      assert.ok(def.coreBox, `${id} must have coreBox`);
      assert.ok(Array.isArray(def.juts), `${id} must have juts array`);
    }
  }
});

test('getScaledDimensions returns scaled widths and heights matching target text sizes', () => {
  const dims = getScaledDimensions();
  assert.equal(Object.keys(dims).length, 18);

  // Pills: height should be ~50px
  assert.ok(Math.abs(dims['Group 64'].scaledHeight - 50) < 3, 'Group 64 height ~50px');
  assert.ok(Math.abs(dims['Group 66'].scaledHeight - 50) < 3, 'Group 66 height ~50px');

  // jacqueline: width should be ~800px, height ~140px (~30% smaller than previous ~200px)
  assert.ok(Math.abs(dims['jacqueline'].scaledHeight - 140) < 10, 'jacqueline height ~140px');

  // chung: height should be ~140px
  assert.ok(Math.abs(dims['chung'].scaledHeight - 140) < 10, 'chung height ~140px');

  // under & construction: height should be ~68px
  assert.ok(Math.abs(dims['under'].scaledHeight - 67) < 5, 'under height ~67px');
  assert.ok(Math.abs(dims['construction'].scaledHeight - 68) < 5, 'construction height ~68px');
});

test('getScaledDimensions scales dimensions with scaleFactor and enforces pill height floor of 34px', () => {
  // Test with scaleFactor = 0.5
  const halfDims = getScaledDimensions(0.5);

  // 'jacqueline': native 340, scale 0.41 -> 340 * 0.41 * 0.5 = 69.7px
  assert.ok(Math.abs(halfDims['jacqueline'].scaledHeight - 69.7) < 1, 'jacqueline scales down linearly');

  // Pill: native 140, scale 0.36 -> 140 * 0.36 * 0.5 = 25.2px.
  // BUT minimum floor is 34px, so scaledHeight must be clamped to 34px!
  assert.equal(halfDims['Group 64'].scaledHeight, 34, 'Group 64 height clamped to minimum 34px floor');
  assert.equal(halfDims['Group 66'].scaledHeight, 34, 'Group 66 height clamped to minimum 34px floor');

  // Pill width scales in proportion to the clamped height (34 / 140 = 0.242857)
  const expectedPillScale = 34 / 140;
  assert.ok(Math.abs(halfDims['Group 64'].scaledWidth - (1199 * expectedPillScale)) < 1, 'Group 64 width scales proportionally with height floor');
});

