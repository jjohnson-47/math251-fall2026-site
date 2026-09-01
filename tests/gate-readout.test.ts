import assert from 'node:assert/strict';
import test from 'node:test';

import { measureGateRun } from '../lib/calculus.ts';
import {
  formatGateReading,
  formatGateValue,
  gateRunAnnouncement,
} from '../lib/gate-readout.ts';

void test('gate readouts keep configured precision without obscuring spoken values', () => {
  assert.equal(formatGateReading(25), '25.0000');
  assert.equal(formatGateValue(25.1001), '25.1001');
});

void test('the completed gate run announces both subtractions', () => {
  assert.equal(
    gateRunAnnouncement(measureGateRun(25, 36)),
    'Gate A at 25 metres, crossed at 5.0000 seconds. Gate B at 36 metres, crossed at 6.0000 seconds. Change in position: 36 minus 25 equals 11 metres. Change in time: 6 minus 5 equals 1 second. Average velocity: 11 divided by 1 equals 11.00 metres per second.',
  );
});
