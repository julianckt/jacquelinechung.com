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
