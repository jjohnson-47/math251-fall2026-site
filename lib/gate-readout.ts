import type { GateRun } from './calculus';

export function formatGateValue(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatGateReading(value: number) {
  return value.toFixed(4);
}

function spokenSeconds(value: number) {
  const unit = Math.abs(value - 1) < Number.EPSILON ? 'second' : 'seconds';
  return `${formatGateValue(value)} ${unit}`;
}

export function gateRunAnnouncement(result: GateRun) {
  return `Gate A at ${formatGateValue(result.gateA)} metres, crossed at ${formatGateReading(result.startTime)} seconds. Gate B at ${formatGateValue(result.gateB)} metres, crossed at ${formatGateReading(result.endTime)} seconds. Change in position: ${formatGateValue(result.gateB)} minus ${formatGateValue(result.gateA)} equals ${formatGateValue(result.distanceChange)} metres. Change in time: ${formatGateValue(result.endTime)} minus ${formatGateValue(result.startTime)} equals ${spokenSeconds(result.elapsedTime)}. Average velocity: ${formatGateValue(result.distanceChange)} divided by ${formatGateValue(result.elapsedTime)} equals ${result.averageSpeed.toFixed(2)} metres per second.`;
}
