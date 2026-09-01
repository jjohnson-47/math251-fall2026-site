import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ballDistance,
  ballVelocity,
  differenceQuotientAtTwo,
  measureGateRun,
  quadratic,
  quadraticDerivative,
  secantSlope,
  square,
} from '../lib/calculus.ts';

void test('quadratic evaluates one-half x squared', () => {
  assert.equal(quadratic(0), 0);
  assert.equal(quadratic(2), 2);
  assert.equal(quadratic(-4), 8);
});

void test('secant slope approaches the derivative as delta x shrinks', () => {
  const x = 1;
  const wideGapError = Math.abs(
    secantSlope(quadratic, x, 2) - quadraticDerivative(x),
  );
  const smallGapError = Math.abs(
    secantSlope(quadratic, x, 0.01) - quadraticDerivative(x),
  );

  assert.ok(smallGapError < wideGapError);
  assert.ok(smallGapError < 0.01);
});

void test('secant slope rejects a zero-width interval', () => {
  assert.throws(() => secantSlope(quadratic, 1, 0), /nonzero/);
});

void test('the x squared difference quotient settles toward four at x = 2', () => {
  assert.equal(square(2), 4);
  assert.equal(differenceQuotientAtTwo(1), 5);
  assert.ok(Math.abs((differenceQuotientAtTwo(0.01) ?? 0) - 4.01) < 1e-12);
  assert.ok(Math.abs((differenceQuotientAtTwo(0.001) ?? 0) - 4.001) < 1e-12);
  assert.equal(differenceQuotientAtTwo(0), undefined);
});

void test('the ball follows d(t) = t squared and v(t) = 2t', () => {
  assert.equal(ballDistance(5), 25);
  assert.equal(ballDistance(10), 100);
  assert.equal(ballVelocity(5), 10);
});

void test('stage A measures an average speed of 15 metres per second', () => {
  const result = measureGateRun(25, 100);

  assert.equal(result.distanceChange, 75);
  assert.equal(result.elapsedTime, 5);
  assert.equal(result.averageSpeed, 15);
});

void test('squeezing gate B produces the guided stage B readings', () => {
  assert.equal(measureGateRun(25, 36).averageSpeed, 11);
  assert.equal(measureGateRun(25, 30.25).averageSpeed, 10.5);
});

void test('narrowing the gates approaches the speed at 25 metres', () => {
  const targetSpeed = ballVelocity(5);
  const firstError = Math.abs(
    measureGateRun(25, 26.01).averageSpeed - targetSpeed,
  );
  const secondError = Math.abs(
    measureGateRun(25, 25.1001).averageSpeed - targetSpeed,
  );

  assert.ok(firstError < 0.11);
  assert.ok(secondError < firstError);
  assert.ok(secondError < 0.011);
});

void test('gate timing rejects invalid or out-of-bounds gate positions', () => {
  assert.throws(() => measureGateRun(25, 25), /gate A/);
  assert.throws(() => measureGateRun(-1, 25), /gate A/);
  assert.throws(() => measureGateRun(25, 101), /gate A/);
});
