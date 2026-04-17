/**
 * Converts total seconds to "hh:mm:ss" string.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}
