import { ELEMENT_DEFINITIONS, getScaledDimensions } from './elements-data.js';
import { createCompoundCollider } from './physics-colliders.js';
import { computeInitialLayout } from './layout-grid.js';
import { SimulationLifecycleController } from './lifecycle.js';
import { resolvePointerAction, DEFAULT_PILL_LINKS } from './interaction.js';

// Resolve Matter from global CDN script or ES module
const Matter = window.Matter;
const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Query } = Matter;

// Configuration
const CONFIG = {
  backgroundColor: '#F7E6F2',
  wallThickness: 100,
  gravityScale: 0.002,
  wakeTimeoutMs: 5000,
  moveThresholdPx: 50,
  dragThresholdPx: 5,
};

// State
let engine, runner, mouseConstraint;
let canvas, ctx;
let bodiesMap = {};
let imagesMap = {};
let lifecycleController;
let showWireframes = false;
let pointerDownPos = null;
let pointerDownBody = null;

/**
 * Preloads all 18 SVGs as HTML Image objects.
 * @returns {Promise<Record<string, HTMLImageElement>>}
 */
async function preloadImages() {
  const promises = Object.entries(ELEMENT_DEFINITIONS).map(([id, def]) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = def.svg;
      img.onload = () => resolve({ id, img });
      img.onerror = () => {
        console.warn(`Could not load SVG for ${id} from ${def.svg}`);
        resolve({ id, img: null });
      };
    });
  });

  const loaded = await Promise.all(promises);
  const map = {};
  for (const { id, img } of loaded) {
    if (img) map[id] = img;
  }
  return map;
}

/**
 * Creates boundary walls (floor, ceiling, left, right).
 */
function createWalls(width, height) {
  const t = CONFIG.wallThickness;
  return {
    ground: Bodies.rectangle(width / 2, height + t / 2, width * 2, t, { isStatic: true, label: 'ground' }),
    ceiling: Bodies.rectangle(width / 2, -t / 2, width * 2, t, { isStatic: true, label: 'ceiling' }),
    leftWall: Bodies.rectangle(-t / 2, height / 2, t, height * 2, { isStatic: true, label: 'leftWall' }),
    rightWall: Bodies.rectangle(width + t / 2, height / 2, t, height * 2, { isStatic: true, label: 'rightWall' }),
  };
}

/**
 * Resizes the canvas buffer for crisp high-DPI rendering.
 */
function resizeCanvas(width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/**
 * Main animation & render loop.
 */
function renderLoop() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Clear background
  ctx.fillStyle = CONFIG.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Draw each element
  for (const [id, body] of Object.entries(bodiesMap)) {
    const spec = ELEMENT_DEFINITIONS[id];
    const img = imagesMap[id];
    if (!spec || !img) continue;

    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);

    const renderW = spec.width * spec.scale;
    const renderH = spec.height * spec.scale;

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);

    // Optional debug wireframe overlay
    if (showWireframes) {
      ctx.strokeStyle = 'rgba(255, 0, 100, 0.8)';
      ctx.lineWidth = 1.5;
      for (const part of body.parts.slice(1)) {
        ctx.beginPath();
        const verts = part.vertices;
        if (verts.length > 0) {
          ctx.moveTo(verts[0].x - body.position.x, verts[0].y - body.position.y);
          for (let i = 1; i < verts.length; i++) {
            ctx.lineTo(verts[i].x - body.position.x, verts[i].y - body.position.y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  requestAnimationFrame(renderLoop);
}

/**
 * Initializes the physics engine, bodies, and interaction events.
 */
export async function initApp() {
  canvas = document.getElementById('physics-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'physics-canvas';
    document.body.appendChild(canvas);
  }
  ctx = canvas.getContext('2d');

  const width = window.innerWidth;
  const height = window.innerHeight;
  resizeCanvas(width, height);

  // 1. Preload SVG graphics
  imagesMap = await preloadImages();

  // 2. Create Matter.js physics engine
  engine = Engine.create({
    gravity: { x: 0, y: 1, scale: CONFIG.gravityScale },
  });

  // 3. Create boundary walls
  const walls = createWalls(width, height);
  Composite.add(engine.world, Object.values(walls));

  // 4. Compute initial layout for all 18 elements
  const scaledDims = getScaledDimensions();
  const initialLayout = computeInitialLayout(width, height, scaledDims);

  // 5. Create compound physics bodies (initially frozen)
  bodiesMap = {};
  for (const [id, spec] of Object.entries(ELEMENT_DEFINITIONS)) {
    const pos = initialLayout[id] || { x: width / 2, y: height / 2 };
    const body = createCompoundCollider(spec, spec.scale, { x: pos.x, y: pos.y }, {
      isStatic: true, // Frozen for first 5 seconds or until interaction
    });
    bodiesMap[id] = body;
    Composite.add(engine.world, body);
  }

  // 6. Setup mouse control & dragging
  const mouse = Mouse.create(canvas);
  mouse.pixelRatio = window.devicePixelRatio || 1;

  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  Composite.add(engine.world, mouseConstraint);

  // 7. Setup Lifecycle Controller
  lifecycleController = new SimulationLifecycleController({
    timeoutMs: CONFIG.wakeTimeoutMs,
    moveThreshold: CONFIG.moveThresholdPx,
    onWake: () => {
      // Unfreeze all bodies to drop into gravity
      for (const body of Object.values(bodiesMap)) {
        Body.setStatic(body, false);
      }
    },
  });

  // 8. Pointer events for interaction, drag vs. click, and wake-up
  canvas.addEventListener('pointerdown', (e) => {
    pointerDownPos = { x: e.clientX, y: e.clientY };
    const hovered = Query.point(Object.values(bodiesMap), pointerDownPos);
    pointerDownBody = hovered.length > 0 ? hovered[0] : null;

    // Direct click/drag wakes up simulation immediately
    lifecycleController.handleUserInteraction();
  });

  window.addEventListener('pointermove', (e) => {
    lifecycleController.handlePointerPosition(e.clientX, e.clientY);

    // Update cursor when hovering over interactive pills
    const pos = { x: e.clientX, y: e.clientY };
    const hovered = Query.point(Object.values(bodiesMap), pos);
    if (hovered.length > 0 && DEFAULT_PILL_LINKS[hovered[0].label]) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
  });

  window.addEventListener('pointerup', (e) => {
    if (!pointerDownPos) return;
    const pointerUpPos = { x: e.clientX, y: e.clientY };
    const label = pointerDownBody ? pointerDownBody.label : null;

    const action = resolvePointerAction(pointerDownPos, pointerUpPos, label, DEFAULT_PILL_LINKS, {
      dragThreshold: CONFIG.dragThresholdPx,
    });

    if (action.type === 'navigate' && action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
    }

    pointerDownPos = null;
    pointerDownBody = null;
  });

  // 9. Keyboard shortcut: press 'w' to toggle wireframes
  window.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W' || e.key === 'd' || e.key === 'D') {
      showWireframes = !showWireframes;
    }
  });

  // 10. Handle window resize
  window.addEventListener('resize', () => {
    const newW = window.innerWidth;
    const newH = window.innerHeight;
    resizeCanvas(newW, newH);
    mouse.pixelRatio = window.devicePixelRatio || 1;

    const t = CONFIG.wallThickness;
    Body.setPosition(walls.ground, { x: newW / 2, y: newH + t / 2 });
    Body.setPosition(walls.ceiling, { x: newW / 2, y: -t / 2 });
    Body.setPosition(walls.leftWall, { x: -t / 2, y: newH / 2 });
    Body.setPosition(walls.rightWall, { x: newW + t / 2, y: newH / 2 });

    // Clamp bodies inside new viewport bounds
    for (const body of Object.values(bodiesMap)) {
      if (body.isStatic) continue;
      const margin = 30;
      const clampedX = Math.min(Math.max(body.position.x, margin), newW - margin);
      const clampedY = Math.min(Math.max(body.position.y, margin), newH - margin);
      if (body.position.x !== clampedX || body.position.y !== clampedY) {
        Body.setPosition(body, { x: clampedX, y: clampedY });
        Body.setVelocity(body, { x: 0, y: 0 });
      }
    }
  });

  // 11. Start Matter Runner and Canvas Render Loop
  runner = Runner.create();
  Runner.run(runner, engine);
  requestAnimationFrame(renderLoop);
}

// Auto-run if running in browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}
