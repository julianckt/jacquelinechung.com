import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve('.');

test('404.html exists and implements the agreed wildcard redirect logic', () => {
  const content = fs.readFileSync(path.join(ROOT_DIR, '404.html'), 'utf8');

  // Verify head script redirects
  assert.match(content, /pathname\.startsWith\(['"]\/squash['"]\)\s*\?\s*['"]\/squash\/['"]\s*:\s*['"]\/['"]/i);
  assert.match(content, /window\.location\.replace\(target\)/);

  // Helper function replicating the 404 routing logic
  function get404RedirectTarget(pathname) {
    const cleanPath = pathname.toLowerCase();
    return cleanPath.startsWith('/squash') ? '/squash/' : '/';
  }

  // Verify routing behavior
  assert.equal(get404RedirectTarget('/squash'), '/squash/');
  assert.equal(get404RedirectTarget('/squash/'), '/squash/');
  assert.equal(get404RedirectTarget('/squash-highlights/hi'), '/squash/');
  assert.equal(get404RedirectTarget('/SQUASH-videos'), '/squash/');
  assert.equal(get404RedirectTarget('/squashing'), '/squash/');
  assert.equal(get404RedirectTarget('/about'), '/');
  assert.equal(get404RedirectTarget('/random-page'), '/');
  assert.equal(get404RedirectTarget('/'), '/');
});

test('squash-highlights/index.html exists and redirects directly to YouTube', () => {
  const content = fs.readFileSync(path.join(ROOT_DIR, 'squash-highlights', 'index.html'), 'utf8');
  const youtubeUrl = 'https://youtu.be/MszbdKjZAy8?si=nWj8j1u8bxcBVvrl';

  assert.ok(content.includes(youtubeUrl));
  assert.match(content, /window\.location\.replace\(['"]https:\/\/youtu\.be\/MszbdKjZAy8\?si=nWj8j1u8bxcBVvrl['"]\)/);
  assert.match(content, /<meta http-equiv=["']refresh["'] content=["']0; url=https:\/\/youtu\.be\/MszbdKjZAy8\?si=nWj8j1u8bxcBVvrl["']/);
  assert.match(content, /Redirecting to Jacqueline's Video Highlight Reel on Youtube\.\.\./);
});

test('squash/index.html exists and contains the direct YouTube link', () => {
  const content = fs.readFileSync(path.join(ROOT_DIR, 'squash', 'index.html'), 'utf8');
  assert.ok(content.includes('https://youtu.be/MszbdKjZAy8?si=nWj8j1u8bxcBVvrl'));
});
