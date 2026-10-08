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
    scale: 0.59,
    coreBox: { x: 22, y: 48, width: 316, height: 67 },
    juts: [
      { name: 't', x: 26, y: 26, width: 45, height: 22 },
      { name: 'h', x: 100, y: 22, width: 40, height: 26 },
      { name: 'i', x: 215, y: 20, width: 25, height: 28 },
    ],
  },
  'is1': {
    id: 'is1',
    type: 'word',
    svg: 'svgs/is1.svg',
    width: 195,
    height: 135,
    scale: 0.59,
    coreBox: { x: 20, y: 48, width: 150, height: 67 },
    juts: [
      { name: 'i', x: 46, y: 20, width: 26, height: 28 },
    ],
  },
  'the': {
    id: 'the',
    type: 'word',
    svg: 'svgs/the.svg',
    width: 284,
    height: 134,
    scale: 0.59,
    coreBox: { x: 21, y: 48, width: 240, height: 66 },
    juts: [
      { name: 't', x: 26, y: 26, width: 40, height: 22 },
      { name: 'h', x: 100, y: 26, width: 36, height: 22 },
    ],
  },
  'website': {
    id: 'website',
    type: 'word',
    svg: 'svgs/website.svg',
    width: 596,
    height: 135,
    scale: 0.59,
    coreBox: { x: 20, y: 48, width: 552, height: 67 },
    juts: [
      { name: 'b', x: 200, y: 22, width: 40, height: 26 },
      { name: 'i', x: 368, y: 20, width: 26, height: 28 },
      { name: 't', x: 450, y: 27, width: 40, height: 21 },
    ],
  },
  'of': {
    id: 'of',
    type: 'word',
    svg: 'svgs/of.svg',
    width: 204,
    height: 133,
    scale: 0.59,
    coreBox: { x: 20, y: 48, width: 152, height: 66 },
    juts: [
      { name: 'f', x: 125, y: 25, width: 40, height: 23 },
    ],
  },

  // Row 2
  'jacqueline': {
    id: 'jacqueline',
    type: 'word',
    svg: 'svgs/jacqueline.svg',
    width: 1947,
    height: 340,
    scale: 0.59,
    coreBox: { x: 40, y: 80, width: 1867, height: 180 },
    juts: [
      { name: 'j_desc', x: 40, y: 260, width: 135, height: 40 },
      { name: 'j_dot', x: 82, y: 40, width: 94, height: 40 },
      { name: 'q_desc', x: 655, y: 260, width: 133, height: 35 },
      { name: 'l', x: 1215, y: 40, width: 110, height: 40 },
      { name: 'i', x: 1368, y: 40, width: 96, height: 40 },
    ],
  },

  // Row 3
  'chung': {
    id: 'chung',
    type: 'word',
    svg: 'svgs/chung.svg',
    width: 1151,
    height: 341,
    scale: 0.59,
    coreBox: { x: 40, y: 80, width: 1070, height: 180 },
    juts: [
      { name: 'h', x: 250, y: 40, width: 100, height: 40 },
      { name: 'g_desc', x: 920, y: 260, width: 190, height: 40 },
    ],
  },

  // Row 4
  'and': {
    id: 'and',
    type: 'word',
    svg: 'svgs/and.svg',
    width: 285,
    height: 134,
    scale: 0.59,
    coreBox: { x: 25, y: 48, width: 233, height: 66 },
    juts: [
      { name: 'd', x: 200, y: 21, width: 36, height: 27 },
    ],
  },
  'it': {
    id: 'it',
    type: 'word',
    svg: 'svgs/it.svg',
    width: 193,
    height: 135,
    scale: 0.59,
    coreBox: { x: 20, y: 48, width: 153, height: 67 },
    juts: [
      { name: 'i', x: 46, y: 20, width: 26, height: 28 },
      { name: 't', x: 120, y: 27, width: 36, height: 21 },
    ],
  },
  'is2': {
    id: 'is2',
    type: 'word',
    svg: 'svgs/is2.svg',
    width: 195,
    height: 135,
    scale: 0.59,
    coreBox: { x: 20, y: 48, width: 150, height: 67 },
    juts: [
      { name: 'i', x: 46, y: 20, width: 26, height: 28 },
    ],
  },
  'still': {
    id: 'still',
    type: 'word',
    svg: 'svgs/still.svg',
    width: 435,
    height: 136,
    scale: 0.59,
    coreBox: { x: 23, y: 48, width: 392, height: 68 },
    juts: [
      { name: 't', x: 90, y: 28, width: 40, height: 20 },
      { name: 'i', x: 211, y: 21, width: 25, height: 27 },
      { name: 'l1', x: 285, y: 23, width: 30, height: 25 },
      { name: 'l2', x: 365, y: 23, width: 30, height: 25 },
    ],
  },

  // Row 5
  'under': {
    id: 'under',
    type: 'word',
    svg: 'svgs/under.svg',
    width: 520,
    height: 160,
    scale: 0.60,
    coreBox: { x: 36, y: 55, width: 437, height: 80 },
    juts: [
      { name: 'd', x: 270, y: 25, width: 40, height: 30 },
    ],
  },
  'construction': {
    id: 'construction',
    type: 'word',
    svg: 'svgs/construction.svg',
    width: 1159,
    height: 163,
    scale: 0.60,
    coreBox: { x: 25, y: 58, width: 1100, height: 80 },
    juts: [
      { name: 't1', x: 420, y: 35, width: 40, height: 23 },
      { name: 't2', x: 790, y: 35, width: 40, height: 23 },
      { name: 'i', x: 886, y: 25, width: 33, height: 33 },
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
    title: 'my latest squash resume',
    svg: 'svgs/Group 65.svg',
    width: 1019,
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
    width: 1430,
    height: 140,
    scale: 0.36,
  },
};

/**
 * Returns a dictionary of element IDs with scaled width and height.
 * @returns {Record<string, { id: string, scaledWidth: number, scaledHeight: number }>}
 */
export function getScaledDimensions() {
  const result = {};
  for (const [id, def] of Object.entries(ELEMENT_DEFINITIONS)) {
    result[id] = {
      id,
      scaledWidth: def.width * def.scale,
      scaledHeight: def.height * def.scale,
    };
  }
  return result;
}
