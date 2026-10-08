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

export const MOBILE_ROW_DEFINITIONS = [
  { row: 1, items: ['this', 'is1', 'the'], gap: 8, marginBelow: 6 },
  { row: 2, items: ['website', 'of'], gap: 8, marginBelow: 12 },
  { row: 3, items: ['jacqueline'], gap: 0, marginBelow: 10 },
  { row: 4, items: ['chung'], gap: 0, marginBelow: 12 },
  { row: 5, items: ['and', 'it', 'is2'], gap: 8, marginBelow: 6 },
  { row: 6, items: ['still', 'under'], gap: 10, marginBelow: 8 },
  { row: 7, items: ['construction'], gap: 0, marginBelow: 20 },
  { row: 8, items: ['Group 67'], gap: 0, marginBelow: 10 },
  { row: 9, items: ['Group 66'], gap: 0, marginBelow: 10 },
  { row: 10, items: ['Group 65'], gap: 0, marginBelow: 10 },
  { row: 11, items: ['Group 68'], gap: 0, marginBelow: 10 },
  { row: 12, items: ['Group 64'], gap: 0, marginBelow: 0 },
];

/**
 * Calculates a 2D containment scale factor based on natural bounding box dimensions.
 *
 * @param {number} viewportWidth - Viewport width
 * @param {number} viewportHeight - Viewport height
 * @param {typeof ROW_DEFINITIONS} rowDefs - Row definitions to measure
 * @param {Record<string, { scaledWidth: number, scaledHeight: number }>} baseElementSpecs - Base element dimensions
 * @param {{ paddingX?: number, paddingY?: number, maxScale?: number }} [options]
 * @returns {number} Scale factor clamped between 0 and maxScale (default 1.0)
 */
export function computeContainmentScale(viewportWidth, viewportHeight, rowDefs, baseElementSpecs, options = {}) {
  const paddingX = options.paddingX ?? 24;
  const paddingY = options.paddingY ?? 24;
  const maxScale = options.maxScale ?? 1.0;

  let maxRowWidth = 0;
  let totalHeight = 0;

  for (let i = 0; i < rowDefs.length; i++) {
    const def = rowDefs[i];
    let rowW = 0;
    let rowH = 0;

    for (let j = 0; j < def.items.length; j++) {
      const id = def.items[j];
      const spec = baseElementSpecs[id];
      if (spec) {
        rowW += spec.scaledWidth;
        if (spec.scaledHeight > rowH) {
          rowH = spec.scaledHeight;
        }
      }
      if (j < def.items.length - 1) {
        rowW += def.gap;
      }
    }

    if (rowW > maxRowWidth) {
      maxRowWidth = rowW;
    }

    totalHeight += rowH;
    if (i < rowDefs.length - 1) {
      totalHeight += def.marginBelow;
    }
  }

  const availableWidth = Math.max(0, viewportWidth - 2 * paddingX);
  const availableHeight = Math.max(0, viewportHeight - 2 * paddingY);

  const scaleW = maxRowWidth > 0 ? availableWidth / maxRowWidth : 1.0;
  const scaleH = totalHeight > 0 ? availableHeight / totalHeight : 1.0;

  return Math.min(scaleW, scaleH, maxScale);
}



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
  const rowDefs = options.rowDefinitions || (viewportWidth < 768 ? MOBILE_ROW_DEFINITIONS : ROW_DEFINITIONS);
  const scaleFactor = options.scaleFactor ?? 1.0;
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
      totalHeight += rowDefs[i].marginBelow * scaleFactor;
    }
  }

  // 2. Start from centered vertical origin
  let currentY = (viewportHeight - totalHeight) / 2;

  // 3. Layout each row horizontally centered
  for (let i = 0; i < rowDefs.length; i++) {
    const def = rowDefs[i];
    const rowH = rowHeights[i];
    const gap = def.gap * scaleFactor;
    const marginBelow = def.marginBelow * scaleFactor;

    // Compute total row width
    let totalRowWidth = 0;
    for (let j = 0; j < def.items.length; j++) {
      const id = def.items[j];
      const spec = elementSpecs[id];
      totalRowWidth += (spec ? spec.scaledWidth : 0);
      if (j < def.items.length - 1) {
        totalRowWidth += gap;
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

      currentX += w + gap;
    }

    currentY += rowH + marginBelow;
  }

  return layout;
}

