/**
 * Specifications for all 18 elements including SVGs, native dimensions,
 * target scale factors matching user text sizes, and compound collider sub-boxes.
 */
export const ELEMENT_DEFINITIONS = {
  // Row 1
  'this': {
    id: 'this',
    type: 'word',
    svg: 'svgs/this.svg',
    width: 363,
    height: 135,
    scale: 0.41,
    coreBox: { x: 14, y: 38, width: 335, height: 86 },
    juts: [
      { name: 't', x: 31, y: 15, width: 46, height: 23 },
      { name: 'h', x: 99, y: 11, width: 51, height: 27 },
      { name: 'i', x: 203, y: 10, width: 46, height: 28 },
    ],
  },
  'is1': {
    id: 'is1',
    type: 'word',
    svg: 'svgs/is1.svg',
    width: 195,
    height: 135,
    scale: 0.41,
    coreBox: { x: 10, y: 38, width: 171, height: 86 },
    juts: [
      { name: 'i', x: 39, y: 10, width: 41, height: 28 },
    ],
  },
  'the': {
    id: 'the',
    type: 'word',
    svg: 'svgs/the.svg',
    width: 284,
    height: 134,
    scale: 0.41,
    coreBox: { x: 14, y: 38, width: 257, height: 86 },
    juts: [
      { name: 't', x: 30, y: 14, width: 47, height: 24 },
      { name: 'h', x: 99, y: 11, width: 66, height: 27 },
    ],
  },
  'website': {
    id: 'website',
    type: 'word',
    svg: 'svgs/website.svg',
    width: 596,
    height: 135,
    scale: 0.41,
    coreBox: { x: 10, y: 38, width: 573, height: 86 },
    juts: [
      { name: 'b', x: 162, y: 11, width: 53, height: 27 },
      { name: 'i', x: 354, y: 10, width: 47, height: 28 },
      { name: 't', x: 424, y: 15, width: 43, height: 23 },
    ],
  },
  'of': {
    id: 'of',
    type: 'word',
    svg: 'svgs/of.svg',
    width: 204,
    height: 133,
    scale: 0.41,
    coreBox: { x: 10, y: 38, width: 180, height: 86 },
    juts: [
      { name: 'f', x: 112, y: 10, width: 72, height: 28 },
    ],
  },

  // Row 2
  'jacqueline': {
    id: 'jacqueline',
    type: 'word',
    svg: 'svgs/jacqueline.svg',
    width: 1947,
    height: 340,
    scale: 0.41,
    coreBox: { x: 20, y: 56, width: 1906, height: 219 },
    juts: [
      { name: 'j_desc', x: 30, y: 275, width: 154, height: 44 },
      { name: 'j_dot', x: 71, y: 20, width: 117, height: 36 },
      { name: 'q_desc', x: 638, y: 275, width: 161, height: 39 },
      { name: 'l', x: 1198, y: 20, width: 135, height: 36 },
      { name: 'i', x: 1359, y: 20, width: 113, height: 36 },
    ],
  },

  // Row 3
  'chung': {
    id: 'chung',
    type: 'word',
    svg: 'svgs/chung.svg',
    width: 1151,
    height: 341,
    scale: 0.41,
    coreBox: { x: 20, y: 56, width: 1110, height: 219 },
    juts: [
      { name: 'h', x: 213, y: 20, width: 147, height: 36 },
      { name: 'g_desc', x: 895, y: 275, width: 221, height: 45 },
    ],
  },

  // Row 4
  'and': {
    id: 'and',
    type: 'word',
    svg: 'svgs/and.svg',
    width: 285,
    height: 134,
    scale: 0.41,
    coreBox: { x: 13, y: 38, width: 260, height: 86 },
    juts: [
      { name: 'd', x: 201, y: 11, width: 65, height: 27 },
    ],
  },
  'it': {
    id: 'it',
    type: 'word',
    svg: 'svgs/it.svg',
    width: 193,
    height: 135,
    scale: 0.41,
    coreBox: { x: 10, y: 38, width: 172, height: 86 },
    juts: [
      { name: 'i', x: 39, y: 10, width: 41, height: 28 },
      { name: 't', x: 103, y: 15, width: 44, height: 23 },
    ],
  },
  'is2': {
    id: 'is2',
    type: 'word',
    svg: 'svgs/is2.svg',
    width: 195,
    height: 135,
    scale: 0.41,
    coreBox: { x: 10, y: 38, width: 171, height: 86 },
    juts: [
      { name: 'i', x: 39, y: 10, width: 41, height: 28 },
    ],
  },
  'still': {
    id: 'still',
    type: 'word',
    svg: 'svgs/still.svg',
    width: 435,
    height: 136,
    scale: 0.41,
    coreBox: { x: 13, y: 38, width: 410, height: 86 },
    juts: [
      { name: 't', x: 104, y: 16, width: 51, height: 22 },
      { name: 'i', x: 201, y: 11, width: 47, height: 27 },
      { name: 'l1', x: 259, y: 12, width: 57, height: 26 },
      { name: 'l2', x: 338, y: 12, width: 57, height: 26 },
    ],
  },

  // Row 5
  'under': {
    id: 'under',
    type: 'word',
    svg: 'svgs/under.svg',
    width: 520,
    height: 160,
    scale: 0.42,
    coreBox: { x: 13, y: 46, width: 490, height: 103 },
    juts: [
      { name: 'd', x: 224, y: 13, width: 85, height: 33 },
    ],
  },
  'construction': {
    id: 'construction',
    type: 'word',
    svg: 'svgs/construction.svg',
    width: 1159,
    height: 163,
    scale: 0.42,
    coreBox: { x: 13, y: 46, width: 1133, height: 103 },
    juts: [
      { name: 't1', x: 394, y: 20, width: 55, height: 26 },
      { name: 't2', x: 764, y: 20, width: 55, height: 26 },
      { name: 'i', x: 873, y: 13, width: 56, height: 33 },
    ],
  },

  // Row 6 (Pills)
  'Group 67': {
    id: 'Group 67',
    type: 'pill',
    title: 'quick links:',
    svg: 'svgs/Group 67.svg',
    width: 794,
    height: 140,
    scale: 0.36,
  },
  'Group 66': {
    id: 'Group 66',
    type: 'pill',
    title: 'adopt a run',
    svg: 'svgs/Group 66.svg',
    width: 909,
    height: 140,
    scale: 0.36,
  },

  // Row 7 (Pills)
  'Group 65': {
    id: 'Group 65',
    type: 'pill',
    title: 'my linkedin',
    svg: 'svgs/Group 65.svg',
    width: 707,
    height: 140,
    scale: 0.36,
  },
  'Group 68': {
    id: 'Group 68',
    type: 'pill',
    title: 'MY INSTAGRAM',
    svg: 'svgs/Group 68.svg',
    width: 839,
    height: 140,
    scale: 0.36,
  },

  // Row 8 (Pill)
  'Group 64': {
    id: 'Group 64',
    type: 'pill',
    title: 'squash highlights reel',
    svg: 'svgs/Group 64.svg',
    width: 1199,
    height: 140,
    scale: 0.36,
  },
};

/**
 * Returns a dictionary of element IDs with scaled width and height.
 * @param {number} [scaleFactor=1.0] - Viewport scaling multiplier
 * @param {{ minPillHeight?: number }} [options] - Options including min pill height floor
 * @returns {Record<string, { id: string, scaledWidth: number, scaledHeight: number, scale: number }>}
 */
export function getScaledDimensions(scaleFactor = 1.0, options = {}) {
  const minPillHeight = options.minPillHeight ?? 34;
  const result = {};
  for (const [id, def] of Object.entries(ELEMENT_DEFINITIONS)) {
    const targetScale = def.scale * scaleFactor;
    let effectiveScale = targetScale;

    if (def.type === 'pill') {
      const minScale = minPillHeight / def.height;
      effectiveScale = Math.max(targetScale, minScale);
    }

    result[id] = {
      id,
      scaledWidth: def.width * effectiveScale,
      scaledHeight: def.height * effectiveScale,
      scale: effectiveScale,
    };
  }
  return result;
}
