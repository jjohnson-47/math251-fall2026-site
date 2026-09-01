export function quadratic(x: number) {
  return 0.5 * x * x;
}

export function secantSlope(
  fn: (input: number) => number,
  x: number,
  deltaX: number,
) {
  if (deltaX === 0) {
    throw new RangeError('deltaX must be nonzero');
  }

  return (fn(x + deltaX) - fn(x)) / deltaX;
}

export function quadraticDerivative(x: number) {
  return x;
}
