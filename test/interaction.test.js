import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePointerAction, DEFAULT_PILL_LINKS } from '../src/interaction.js';

test('resolves to drag when pointer movement is greater than or equal to threshold', () => {
  const start = { x: 100, y: 100 };
  const end = { x: 106, y: 100 }; // 6px > 5px threshold

  const result = resolvePointerAction(start, end, 'Group 66', DEFAULT_PILL_LINKS);
  assert.equal(result.type, 'drag');
});

test('resolves to navigate when pointer movement is under threshold and body is a link pill', () => {
  const start = { x: 100, y: 100 };
  const end = { x: 102, y: 101 }; // ~2.2px < 5px threshold

  const result = resolvePointerAction(start, end, 'Group 66', DEFAULT_PILL_LINKS);
  assert.equal(result.type, 'navigate');
  assert.equal(result.url, DEFAULT_PILL_LINKS['Group 66']);
});

test('resolves to none when clicking quick links pill or regular word', () => {
  const start = { x: 100, y: 100 };
  const end = { x: 101, y: 100 };

  const quickLinksResult = resolvePointerAction(start, end, 'Group 67', DEFAULT_PILL_LINKS);
  assert.equal(quickLinksResult.type, 'none', 'quick links is a pill without an external link');

  const wordResult = resolvePointerAction(start, end, 'jacqueline', DEFAULT_PILL_LINKS);
  assert.equal(wordResult.type, 'none', 'words are not links');
});
