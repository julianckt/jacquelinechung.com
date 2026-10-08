import Matter from 'matter-js';

const { Bodies, Body } = Matter;

/**
 * Creates a Matter.js compound physics body based on element specification.
 *
 * @param {Object} spec - Element specification (type: 'pill' | 'word', dimensions, coreBox, juts)
 * @param {number} scale - Viewport scale factor
 * @param {{x: number, y: number}} position - Target center position
 * @param {Object} [options] - Additional Matter.js body options
 * @returns {Matter.Body}
 */
export function createCompoundCollider(spec, scale = 1, position = { x: 0, y: 0 }, options = {}) {
  const parts = [];
  const isStaticRequested = Boolean(options.isStatic);
  const bodyOptions = {
    label: spec.id,
    restitution: 0.3,
    friction: 0.2,
    frictionAir: 0.01,
    ...options,
    isStatic: false, // Ensure dynamic mass & inertia are computed first
  };

  if (spec.type === 'pill') {
    const totalW = spec.width * scale;
    const totalH = spec.height * scale;
    const radius = totalH / 2;
    const centerW = Math.max(0, totalW - totalH);

    const centerRect = Bodies.rectangle(position.x, position.y, centerW, totalH, {
      label: `${spec.id}_core`,
    });
    const leftCircle = Bodies.circle(position.x - centerW / 2, position.y, radius, {
      label: `${spec.id}_left`,
    });
    const rightCircle = Bodies.circle(position.x + centerW / 2, position.y, radius, {
      label: `${spec.id}_right`,
    });

    parts.push(centerRect, leftCircle, rightCircle);
  } else {
    // Word with core box and jutting boxes
    const svgW = spec.width;
    const svgH = spec.height;
    const core = spec.coreBox || { x: 0, y: 0, width: svgW, height: svgH };

    const coreRelX = (core.x + core.width / 2 - svgW / 2) * scale;
    const coreRelY = (core.y + core.height / 2 - svgH / 2) * scale;
    const coreW = core.width * scale;
    const coreH = core.height * scale;

    const coreBody = Bodies.rectangle(position.x + coreRelX, position.y + coreRelY, coreW, coreH, {
      label: `${spec.id}_core`,
    });
    parts.push(coreBody);

    if (Array.isArray(spec.juts)) {
      for (const jut of spec.juts) {
        const jutRelX = (jut.x + jut.width / 2 - svgW / 2) * scale;
        const jutRelY = (jut.y + jut.height / 2 - svgH / 2) * scale;
        const jutW = jut.width * scale;
        const jutH = jut.height * scale;

        const jutBody = Bodies.rectangle(position.x + jutRelX, position.y + jutRelY, jutW, jutH, {
          label: `${spec.id}_jut_${jut.name || 'part'}`,
        });
        parts.push(jutBody);
      }
    }
  }

  const compoundBody = Body.create({
    parts,
    ...bodyOptions,
  });

  // Ensure body is centered exactly at requested position
  Body.setPosition(compoundBody, position);

  if (isStaticRequested) {
    Body.setStatic(compoundBody, true);
  }

  return compoundBody;
}
