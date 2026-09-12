import assert from 'node:assert/strict';
import test from 'node:test';

import {
  cornerFunction,
  cornerPoint,
  formatDecimal,
  leftDifferenceQuotient,
  readCorner,
  rightDifferenceQuotient,
  slopeTolerance,
} from '../lib/corner.ts';

/** The three the explorer offers, plus gaps well past anything it can select. */
const gaps = [1, 0.5, 0.25, 0.1, 0.01, 0.0001, 1e-8];

void test('g(x) = |x − 2| is zero at the corner and rises on both sides', () => {
  assert.equal(cornerFunction(cornerPoint), 0);
  assert.equal(cornerFunction(0), 2);
  assert.equal(cornerFunction(4), 2);
  assert.equal(cornerFunction(1.5), 0.5);
  assert.equal(cornerFunction(2.5), 0.5);
});

void test('at the corner the one-sided slopes are −1 and +1 for every gap', () => {
  for (const gap of gaps) {
    const reading = readCorner(cornerPoint, gap);
    const tolerance = slopeTolerance(gap);

    assert.ok(
      Math.abs(reading.leftSlope - -1) < tolerance,
      `left slope at gap ${gap} was ${reading.leftSlope}`,
    );
    assert.ok(
      Math.abs(reading.rightSlope - 1) < tolerance,
      `right slope at gap ${gap} was ${reading.rightSlope}`,
    );
  }
});

void test('shrinking the gap never closes the two-unit disagreement at the corner', () => {
  for (const gap of gaps) {
    const reading = readCorner(cornerPoint, gap);

    assert.equal(reading.slopesAgree, false);
    assert.ok(
      Math.abs(reading.slopeDifference - 2) < slopeTolerance(gap),
      `the gap of ${gap} left a slope difference of ${reading.slopeDifference}`,
    );
  }
});

void test('the difference quotient loses precision long before the gap reaches zero', () => {
  // A difference quotient subtracts two nearly equal numbers and divides by the
  // gap, so rounding error grows like 1/gap. At the corner the exact answer is
  // ±1 for every positive gap; at 1e-8 the computed answer is already wrong in
  // the eighth decimal place. This is the reason the explorer stops at 0.01,
  // and the reason `slopeTolerance` scales instead of being one constant.
  const coarse = readCorner(cornerPoint, 0.01);
  const tiny = readCorner(cornerPoint, 1e-8);

  assert.ok(Math.abs(coarse.rightSlope - 1) < 1e-9);
  assert.ok(Math.abs(tiny.rightSlope - 1) > 1e-9);
  assert.ok(Math.abs(tiny.rightSlope - 1) < 1e-5);
});

void test('away from the corner a small enough gap makes the slopes agree', () => {
  const straddling = readCorner(2.25, 0.5);

  assert.ok(Math.abs(straddling.leftSlope - 0) < 1e-9);
  assert.ok(Math.abs(straddling.rightSlope - 1) < 1e-9);
  assert.equal(straddling.slopesAgree, false);

  const clear = readCorner(2.25, 0.1);

  assert.ok(Math.abs(clear.leftSlope - 1) < 1e-9);
  assert.ok(Math.abs(clear.rightSlope - 1) < 1e-9);
  assert.equal(clear.slopesAgree, true);
});

void test('the slope is −1 left of the corner and +1 right of it', () => {
  for (const gap of [0.25, 0.1, 0.01]) {
    const left = readCorner(1, gap);
    const right = readCorner(3, gap);

    assert.ok(Math.abs(left.leftSlope - -1) < 1e-9);
    assert.ok(Math.abs(left.rightSlope - -1) < 1e-9);
    assert.equal(left.slopesAgree, true);

    assert.ok(Math.abs(right.leftSlope - 1) < 1e-9);
    assert.ok(Math.abs(right.rightSlope - 1) < 1e-9);
    assert.equal(right.slopesAgree, true);
  }
});

void test('a zero or negative gap is rejected rather than dividing by zero', () => {
  assert.throws(() => leftDifferenceQuotient(2, 0), /gap must be positive/);
  assert.throws(() => rightDifferenceQuotient(2, 0), /gap must be positive/);
  assert.throws(() => readCorner(2, -0.5), /gap must be positive/);
  assert.throws(() => readCorner(2, Number.NaN), /gap must be positive/);
});

void test('slopes are displayed with a minus sign and never as negative zero', () => {
  assert.equal(formatDecimal(-1), '−1');
  assert.equal(formatDecimal(1), '1');
  assert.equal(formatDecimal(0.5), '0.5');
  assert.equal(formatDecimal(-0), '0');
  assert.equal(formatDecimal(-1.0000000000000009), '−1');
  assert.equal(formatDecimal(0.9999999999999987), '1');
});
