export const ROW_DEFINITIONS = [
  { row: 1, items: ['this', 'is1', 'the', 'website', 'of'], gap: 14, marginBelow: 20 },
  { row: 2, items: ['jacqueline'], gap: 0, marginBelow: 15 },
  { row: 3, items: ['chung'], gap: 0, marginBelow: 24 },
  { row: 4, items: ['and', 'it', 'is2', 'still'], gap: 14, marginBelow: 12 },
  { row: 5, items: ['under', 'construction'], gap: 18, marginBelow: 36 },
  { row: 6, items: ['Group 67', 'Group 66'], gap: 20, marginBelow: 16 },
  { row: 7, items: ['Group 65', 'Group 68'], gap: 20, marginBelow: 16 },
  { row: 8, items: ['Group 64'], gap: 0, marginBelow: 0 },
];

/**
 * Computes the centered-pillared initial layout coordinates for all elements.
 *
 * @param {number} viewportWidth - Viewport width
 * @param {number} viewportHeight - Viewport height
 * @param {Record<string, { scaledWidth: number, scaledHeight: number }>} elementSpecs - Scaled dimensions
 * @param {{ rowDefinitions?: typeof ROW_DEFINITIONS }} [options]
 * @returns {Record<string, { id: string, x: number, y: number, width: number, height: number, row: number }>}
 */
export function computeInitialLayout(viewportWidth, viewportHeight, elementSpecs, options = {}) {
  const rowDefs = options.rowDefinitions || ROW_DEFINITIONS;
  const layout = {};

  // 1. Calculate heights and total block height
  const rowHeights = rowDefs.map(def => {
    let maxH = 0;
    for (const id of def.items) {
      const spec = elementSpecs[id];
      if (spec && spec.scaledHeight > maxH) {
        maxH = spec.scaledHeight;
      }
    }
    return maxH;
  });

  let totalHeight = 0;
  for (let i = 0; i < rowDefs.length; i++) {
    totalHeight += rowHeights[i];
    if (i < rowDefs.length - 1) {
      totalHeight += rowDefs[i].marginBelow;
    }
  }

  // 2. Start from centered vertical origin
  let currentY = (viewportHeight - totalHeight) / 2;

  // 3. Layout each row horizontally centered
  for (let i = 0; i < rowDefs.length; i++) {
    const def = rowDefs[i];
    const rowH = rowHeights[i];

    // Compute total row width
    let totalRowWidth = 0;
    for (let j = 0; j < def.items.length; j++) {
      const id = def.items[j];
      const spec = elementSpecs[id];
      totalRowWidth += (spec ? spec.scaledWidth : 0);
      if (j < def.items.length - 1) {
        totalRowWidth += def.gap;
      }
    }

    let currentX = (viewportWidth - totalRowWidth) / 2;

    for (const id of def.items) {
      const spec = elementSpecs[id];
      const w = spec ? spec.scaledWidth : 0;
      const h = spec ? spec.scaledHeight : rowH;

      layout[id] = {
        id,
        x: currentX + w / 2,
        y: currentY + rowH / 2,
        width: w,
        height: h,
        row: def.row,
      };

      currentX += w + def.gap;
    }

    currentY += rowH + def.marginBelow;
  }

  return layout;
}
