import assert from 'node:assert/strict';
import test from 'node:test';

import {
  quadratic,
  quadraticDerivative,
  secantSlope,
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
