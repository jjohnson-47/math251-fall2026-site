import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bracketsIntermediateValue,
  cubicPlusLinear,
  linearization,
  logLinearizationAtOne,
  logLinearizationError,
  roundTo,
} from '../lib/week4.ts';

void test('the linearization is the value plus the slope times the distance', () => {
  const line = linearization(3, -2, 5);

  assert.equal(line(5), 3);
  assert.equal(line(6), 1);
  assert.equal(line(4), 5);
});

void test('the tangent line to ln at a = 1 is L(x) = x − 1', () => {
  assert.equal(logLinearizationAtOne(1), 0);
  assert.equal(roundTo(logLinearizationAtOne(1.1), 4), 0.1);
  assert.equal(roundTo(logLinearizationAtOne(2), 4), 1);
});

void test('the worked estimate of ln(1.1) is 0.1 against 0.0953, high by 0.0047', () => {
  assert.equal(roundTo(Math.log(1.1), 4), 0.0953);
  assert.equal(roundTo(logLinearizationError(1.1), 4), 0.0047);
});

void test('the error grows with distance from the point of tangency', () => {
  assert.equal(roundTo(Math.log(2), 3), 0.693);
  assert.equal(roundTo(logLinearizationError(2), 3), 0.307);

  const distances = [0.05, 0.1, 0.25, 0.5, 1, 2];
  let previousError = 0;

  for (const distance of distances) {
    const error = logLinearizationError(1 + distance);

    assert.ok(
      error > previousError,
      `the error at x = ${1 + distance} did not exceed the previous one`,
    );
    previousError = error;
  }
});

void test('the error at x = 2 is roughly sixty-five times the error at x = 1.1', () => {
  const ratio = logLinearizationError(2) / logLinearizationError(1.1);

  assert.equal(roundTo(ratio, 0), 65);
});

void test('ln is concave down, so the tangent line never under-estimates it', () => {
  for (let x = 0.1; x <= 4; x += 0.1) {
    assert.ok(
      logLinearizationError(x) >= 0,
      `the tangent line fell below ln at x = ${x}`,
    );
  }

  assert.equal(logLinearizationError(1), 0);
});

void test('x³ + x runs from 2 to 10 across the interval from 1 to 2', () => {
  assert.equal(cubicPlusLinear(1), 2);
  assert.equal(cubicPlusLinear(2), 10);
});

void test('5 is bracketed on [1, 2], and the bracket claims nothing more', () => {
  assert.equal(bracketsIntermediateValue(cubicPlusLinear, 1, 2, 5), true);
  assert.equal(bracketsIntermediateValue(cubicPlusLinear, 1, 2, 11), false);
  assert.equal(bracketsIntermediateValue(cubicPlusLinear, 1, 2, 1), false);

  // An endpoint value is not strictly between the endpoint values, so the
  // bracket is false there even though a solution plainly exists. The theorem
  // reports existence inside the open interval and nothing else.
  assert.equal(bracketsIntermediateValue(cubicPlusLinear, 1, 2, 2), false);
  assert.equal(bracketsIntermediateValue(cubicPlusLinear, 1, 2, 10), false);
});

void test('x³ + x is strictly increasing, so its bracketed solution is unique', () => {
  // The page says the theorem promises "at least one" and that there happens
  // to be exactly one here, on a separate argument about this function. That
  // separate argument is monotonicity, so it gets checked rather than asserted.
  let previous = Number.NEGATIVE_INFINITY;

  for (let x = -3; x <= 3.0001; x += 0.01) {
    const value = cubicPlusLinear(x);

    assert.ok(value > previous, `x³ + x did not increase at x = ${x}`);
    previous = value;
  }
});

void test('a bracket works the same way when the function decreases', () => {
  const decreasing = (x: number) => -x;

  assert.equal(bracketsIntermediateValue(decreasing, 0, 3, -1.5), true);
  assert.equal(bracketsIntermediateValue(decreasing, 0, 3, 1), false);
});

void test('rounding for display keeps the digits the pages print', () => {
  assert.equal(roundTo(0.09531017980432493, 4), 0.0953);
  assert.equal(roundTo(0.004689820195675072, 4), 0.0047);
  assert.equal(roundTo(1.5, 0), 2);
});
