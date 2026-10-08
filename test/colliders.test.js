import { test } from 'node:test';
import assert from 'node:assert/strict';
import Matter from 'matter-js';
import { createCompoundCollider } from '../src/physics-colliders.js';

test('creates a pill capsule compound body with 1 central rectangle and 2 end circles', () => {
  const pillSpec = {
    id: 'adopt-a-run',
    type: 'pill',
    width: 900,
    height: 140,
  };
  const scale = 0.5;
  const position = { x: 300, y: 200 };

  const body = createCompoundCollider(pillSpec, scale, position);

  assert.ok(body, 'Body should be created');
  assert.equal(body.label, 'adopt-a-run');
  assert.equal(body.restitution, 0.3);
  assert.equal(body.friction, 0.2);

  // In Matter.js, body.parts[0] is the parent body, followed by the sub-parts
  const subParts = body.parts.slice(1);
  assert.equal(subParts.length, 3, 'Pill should have 1 center rectangle + 2 circles');

  // Verify bounding box dimensions match scaled size
  const boundsWidth = body.bounds.max.x - body.bounds.min.x;
  const boundsHeight = body.bounds.max.y - body.bounds.min.y;

  assert.ok(Math.abs(boundsWidth - 900 * scale) < 2, `Width ${boundsWidth} should be close to ${900 * scale}`);
  assert.ok(Math.abs(boundsHeight - 140 * scale) < 2, `Height ${boundsHeight} should be close to ${140 * scale}`);
});

test('creates a word compound body with a core rectangle and specified jutting rectangles', () => {
  const wordSpec = {
    id: 'website',
    type: 'word',
    width: 596,
    height: 135,
    coreBox: { x: 0, y: 35, width: 596, height: 75 },
    juts: [
      { name: 'b', x: 140, y: 10, width: 45, height: 25 },
      { name: 'i', x: 260, y: 15, width: 35, height: 20 },
      { name: 't', x: 420, y: 10, width: 40, height: 25 },
    ],
  };
  const scale = 0.6;
  const position = { x: 400, y: 300 };

  const body = createCompoundCollider(wordSpec, scale, position);

  assert.ok(body, 'Body should be created');
  assert.equal(body.label, 'website');
  assert.equal(body.restitution, 0.3);
  assert.equal(body.friction, 0.2);

  // 1 core box + 3 juts = 4 subparts
  const subParts = body.parts.slice(1);
  assert.equal(subParts.length, 4, 'Word should have 1 core box + 3 jutting boxes');
});

test('unfreezing a body created with isStatic: true does not produce NaN mass or position', () => {
  const pillSpec = {
    id: 'adopt-a-run',
    type: 'pill',
    width: 900,
    height: 140,
  };
  const body = createCompoundCollider(pillSpec, 0.5, { x: 300, y: 200 }, { isStatic: true });
  assert.equal(body.isStatic, true);

  // Unfreeze
  Matter.Body.setStatic(body, false);
  assert.equal(body.isStatic, false);
  assert.ok(Number.isFinite(body.mass), `Mass must be finite, got ${body.mass}`);
  assert.ok(!Number.isNaN(body.position.x), 'Position x must not be NaN');
  assert.ok(!Number.isNaN(body.position.y), 'Position y must not be NaN');
});

