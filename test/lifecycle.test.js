import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SimulationLifecycleController } from '../src/lifecycle.js';

test('starts in frozen state', () => {
  let wakeCalled = false;
  const ctrl = new SimulationLifecycleController({
    timeoutMs: 5000,
    onWake: () => { wakeCalled = true; },
  });

  assert.equal(ctrl.isFrozen, true);
  assert.equal(wakeCalled, false);
  ctrl.destroy();
});

test('wakes up when mouse movement exceeds threshold', () => {
  let wakeCalls = 0;
  const ctrl = new SimulationLifecycleController({
    timeoutMs: 5000,
    moveThreshold: 50,
    onWake: () => { wakeCalls++; },
  });

  // Small movements below threshold (30px total)
  ctrl.handleMouseMove(10, 0);
  ctrl.handleMouseMove(20, 0);
  assert.equal(ctrl.isFrozen, true);
  assert.equal(wakeCalls, 0);

  // Crosses threshold (30 + 25 = 55px >= 50px)
  ctrl.handleMouseMove(25, 0);
  assert.equal(ctrl.isFrozen, false);
  assert.equal(wakeCalls, 1);

  // Further movement does not re-trigger wake
  ctrl.handleMouseMove(100, 100);
  assert.equal(wakeCalls, 1);
  ctrl.destroy();
});

test('wakes up immediately on direct user interaction (click / drag start)', () => {
  let wakeCalls = 0;
  const ctrl = new SimulationLifecycleController({
    timeoutMs: 5000,
    onWake: () => { wakeCalls++; },
  });

  ctrl.handleUserInteraction();
  assert.equal(ctrl.isFrozen, false);
  assert.equal(wakeCalls, 1);

  // Subsequent calls are idempotent
  ctrl.handleUserInteraction();
  assert.equal(wakeCalls, 1);
  ctrl.destroy();
});

test('wakes up automatically when timer expires', async () => {
  let wakeCalls = 0;
  const ctrl = new SimulationLifecycleController({
    timeoutMs: 50, // fast timer for testing
    onWake: () => { wakeCalls++; },
  });

  assert.equal(ctrl.isFrozen, true);

  await new Promise(resolve => setTimeout(resolve, 80));

  assert.equal(ctrl.isFrozen, false);
  assert.equal(wakeCalls, 1);
  ctrl.destroy();
});
