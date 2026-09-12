/**
 * The numbers stated in prose on the Week 4 embed routes.
 *
 * MathJax renders `$...$` at build time, so a number inside an expression on
 * one of those pages is literal text that nothing recomputes. These functions
 * are the independent source for those digits: `tests/week4.test.ts` checks the
 * arithmetic, and the `routeChecks` entries in `scripts/verify-pages.mjs` check
 * that the exported HTML still carries the same digits. Neither check is worth
 * much alone; together they pin the page to the mathematics.
 */

/** L(x) = f(a) + f′(a)(x − a), the linearization of f at a. */
export function linearization(
  valueAtCenter: number,
  slopeAtCenter: number,
  center: number,
) {
  return (x: number) => valueAtCenter + slopeAtCenter * (x - center);
}

/** The tangent line to ln(x) at a = 1, which is L(x) = x − 1. */
export const logLinearizationAtOne = linearization(0, 1, 1);

/**
 * L(x) − ln(x). Positive everywhere ln is defined, because ln is concave down
 * and so bends away beneath its own tangent line: the estimate is always high.
 */
export function logLinearizationError(x: number) {
  return logLinearizationAtOne(x) - Math.log(x);
}

/** f(x) = x³ + x, the polynomial the Intermediate Value Theorem page uses. */
export function cubicPlusLinear(x: number) {
  return x ** 3 + x;
}

/**
 * Whether `target` lies strictly between f(a) and f(b), which is the hypothesis
 * the Intermediate Value Theorem needs beyond continuity on the closed
 * interval. It reports that a value is bracketed, never where the solution is
 * or how many there are.
 */
export function bracketsIntermediateValue(
  fn: (x: number) => number,
  a: number,
  b: number,
  target: number,
) {
  const atA = fn(a);
  const atB = fn(b);

  return target > Math.min(atA, atB) && target < Math.max(atA, atB);
}

/** Round for display, so a test can assert the digits a page actually prints. */
export function roundTo(value: number, decimals: number) {
  const scale = 10 ** decimals;

  return Math.round(value * scale) / scale;
}
