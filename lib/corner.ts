/**
 * The corner explorer on Section 1.7.
 *
 * Every number the explorer shows comes from here, so the claim the section
 * makes — that the one-sided difference quotients at a corner disagree, and go
 * on disagreeing however small the gap gets — is arithmetic that
 * `tests/corner.test.ts` can check, not something read off a drawing.
 */

/** The corner of g(x) = |x − 2|. */
export const cornerPoint = 2;

/** g(x) = |x − 2|, the example Section 1.7 asks you to keep in your head. */
export function cornerFunction(x: number) {
  return Math.abs(x - cornerPoint);
}

function requirePositiveGap(gap: number) {
  if (!(gap > 0)) {
    throw new RangeError('gap must be positive');
  }
}

/** The difference quotient using the point `gap` to the left of x. */
export function leftDifferenceQuotient(x: number, gap: number) {
  requirePositiveGap(gap);

  return (cornerFunction(x) - cornerFunction(x - gap)) / gap;
}

/** The difference quotient using the point `gap` to the right of x. */
export function rightDifferenceQuotient(x: number, gap: number) {
  requirePositiveGap(gap);

  return (cornerFunction(x + gap) - cornerFunction(x)) / gap;
}

export type CornerReading = {
  x: number;
  gap: number;
  leftSlope: number;
  rightSlope: number;
  slopeDifference: number;
  slopesAgree: boolean;
};

/**
 * How close two slopes have to be before the explorer calls them equal.
 *
 * Floating point never returns exactly −1 from (0 − |1.99 − 2|) / 0.01, so
 * "agree" is a tolerance and not an equality. The tolerance widens as the gap
 * narrows because a difference quotient subtracts two nearly equal numbers and
 * then divides by the small gap, which multiplies the rounding error by 1/gap:
 * at gap = 1e-8 the slopes at the corner come out as ±0.999999993922529, not
 * ±1. It stays far below the two-unit disagreement at the corner, which is the
 * quantity the page is about.
 */
export function slopeTolerance(gap: number) {
  return Math.max(1e-9, 1e-12 / gap);
}

export function readCorner(x: number, gap: number): CornerReading {
  const leftSlope = leftDifferenceQuotient(x, gap);
  const rightSlope = rightDifferenceQuotient(x, gap);
  const slopeDifference = rightSlope - leftSlope;

  return {
    x,
    gap,
    leftSlope,
    rightSlope,
    slopeDifference,
    slopesAgree: Math.abs(slopeDifference) < slopeTolerance(gap),
  };
}

/**
 * Two decimal places, with a real minus sign rather than a hyphen, and no
 * negative zero: a reader should never be told the slope is "-0". Used for
 * every number the explorer prints, so the graph and the readout cannot drift.
 */
export function formatDecimal(value: number) {
  const rounded = Math.round(value * 100) / 100;
  const withoutNegativeZero = Object.is(rounded, -0) ? 0 : rounded;

  return String(withoutNegativeZero).replace('-', '−');
}
