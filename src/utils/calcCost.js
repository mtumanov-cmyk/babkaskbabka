/**
 * Calculates total meeting cost.
 * Formula: participants * hourlyRate * (elapsedSeconds / 3600)
 *
 * @param {number} elapsedSeconds
 * @param {number} participants
 * @param {number} hourlyRate  - rate per person per hour
 * @returns {number}
 */
export function calcCost(elapsedSeconds, participants, hourlyRate) {
  return participants * hourlyRate * (elapsedSeconds / 3600);
}
