export function quadratic(x: number) {
  return 0.5 * x * x;
}

export function square(x: number) {
  return x * x;
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

export function differenceQuotientAtTwo(h: number) {
  if (h === 0) {
    return undefined;
  }

  return secantSlope(square, 2, h);
}

export function ballDistance(time: number) {
  if (time < 0) {
    throw new RangeError('time must be nonnegative');
  }

  return time * time;
}

export function ballVelocity(time: number) {
  if (time < 0) {
    throw new RangeError('time must be nonnegative');
  }

  return 2 * time;
}

export function ballTimeAtDistance(distance: number) {
  if (distance < 0) {
    throw new RangeError('distance must be nonnegative');
  }

  return Math.sqrt(distance);
}

export type GateRun = {
  gateA: number;
  gateB: number;
  distanceChange: number;
  startTime: number;
  endTime: number;
  elapsedTime: number;
  averageSpeed: number;
};

export function measureGateRun(gateA: number, gateB: number): GateRun {
  if (gateA < 0 || gateB > 100 || gateB <= gateA) {
    throw new RangeError('gates must satisfy 0 <= gate A < gate B <= 100');
  }

  const startTime = ballTimeAtDistance(gateA);
  const endTime = ballTimeAtDistance(gateB);
  const elapsedTime = endTime - startTime;
  const distanceChange = gateB - gateA;

  return {
    gateA,
    gateB,
    distanceChange,
    startTime,
    endTime,
    elapsedTime,
    averageSpeed: distanceChange / elapsedTime,
  };
}
