/**
 * Generate a random hex number.
 */
export function randHex(digits: number = 8) {
  return Math.random()
    .toString(16)
    .slice(2, digits + 2);
}
