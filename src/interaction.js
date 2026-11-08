/**
 * Default placeholder URLs for interactive pill elements.
 * 'Group 67' (quick links:) is intentionally omitted so it acts as an unlinked physical pill.
 */
export const DEFAULT_PILL_LINKS = {
  'Group 66': 'https://adoptarun.org',
  'Group 65': 'https://www.linkedin.com/in/jacqueline-chung-a3ab57418',
  'Group 68': 'https://instagram.com/jackie_c_',
  'Group 64': 'https://youtu.be/MszbdKjZAy8?si=nWj8j1u8bxcBVvrl',
};

/**
 * Distinguishes between physics drag gestures and link-opening clicks.
 *
 * @param {{x: number, y: number}} startPos - Pointer down coordinate
 * @param {{x: number, y: number}} endPos - Pointer up coordinate
 * @param {string|null} bodyLabel - Label of the clicked physics body
 * @param {Record<string, string>} [pillLinks=DEFAULT_PILL_LINKS] - Map of pill labels to URLs
 * @param {Object} [options]
 * @param {number} [options.dragThreshold=5] - Pixels threshold separating click from drag
 * @returns {{ type: 'drag', distance: number } | { type: 'navigate', url: string, label: string } | { type: 'none', label: string|null }}
 */
export function resolvePointerAction(startPos, endPos, bodyLabel, pillLinks = DEFAULT_PILL_LINKS, options = {}) {
  const threshold = options.dragThreshold ?? 5;
  const distance = Math.hypot(endPos.x - startPos.x, endPos.y - startPos.y);

  if (distance >= threshold) {
    return { type: 'drag', distance };
  }

  if (bodyLabel && pillLinks[bodyLabel]) {
    return {
      type: 'navigate',
      url: pillLinks[bodyLabel],
      label: bodyLabel,
    };
  }

  return { type: 'none', label: bodyLabel };
}
