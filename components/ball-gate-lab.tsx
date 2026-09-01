'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { Play, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ballDistance, measureGateRun, type GateRun } from '@/lib/calculus';
import {
  formatGateReading,
  formatGateValue,
  gateRunAnnouncement,
} from '@/lib/gate-readout';
import { activeCalculusSectionOneOne } from '@/lib/site';

const TRACK_LENGTH = 100;
const MINIMUM_GATE_GAP = 0.01;
const RUN_DURATION_MS = 2600;

const guidedMoves = [
  { stage: 'A', label: 'Wide', gateA: 25, gateB: 100 },
  { stage: 'B', label: 'Closer', gateA: 25, gateB: 36 },
  { stage: 'B', label: 'Closer still', gateA: 25, gateB: 30.25 },
  { stage: 'C', label: 'Near', gateA: 25, gateB: 26.01 },
  { stage: 'C', label: 'Nearly one point', gateA: 25, gateB: 25.1001 },
] as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function roundPosition(value: number) {
  return Math.round(value * 10_000) / 10_000;
}

function gateReadoutTransform(position: number) {
  if (position <= 15) {
    return 'translateX(0)';
  }

  if (position >= 85) {
    return 'translateX(-100%)';
  }

  return 'translateX(-50%)';
}

function resultNote(result: GateRun | null) {
  if (!result) {
    return 'Run the ball once, then move Gate B toward Gate A and compare the log.';
  }

  if (
    Math.abs(result.gateA - 25) < 0.0001 &&
    Math.abs(result.gateB - 100) < 0.0001
  ) {
    return 'The ball speeds up continuously between the gates, so its average velocity lies between its velocities at A and at B. The 15.00 m/s result describes the whole interval, not either endpoint.';
  }

  if (Math.abs(result.gateA - 25) < 0.0001 && result.distanceChange < 2) {
    return 'The gates have not met, but the average velocity is settling near 10 m/s.';
  }

  return 'This average velocity describes the whole interval; it does not locate one instant.';
}

export function BallGateLab() {
  const [gateA, setGateA] = useState(25);
  const [gateB, setGateB] = useState(100);
  const [ballPosition, setBallPosition] = useState(0);
  const [clock, setClock] = useState(0);
  const [gateATime, setGateATime] = useState<number | null>(null);
  const [gateBTime, setGateBTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<GateRun | null>(null);
  const [runLog, setRunLog] = useState<GateRun[]>([]);
  const [announcement, setAnnouncement] = useState(
    'The experiment is ready. Gate A is at 25 metres and Gate B is at 100 metres.',
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | null>(null);

  const configuredRun = useMemo(
    () => measureGateRun(gateA, gateB),
    [gateA, gateB],
  );

  const stopAnimation = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);

  useEffect(() => stopAnimation, [stopAnimation]);

  const finishRun = useCallback((result: GateRun) => {
    setBallPosition(result.gateB);
    setClock(result.endTime);
    setGateATime(result.startTime);
    setGateBTime(result.endTime);
    setIsRunning(false);
    setLastResult(result);
    setRunLog((current) => [...current.slice(-3), result]);
    setAnnouncement(gateRunAnnouncement(result));
    animationFrame.current = null;
  }, []);

  const run = () => {
    stopAnimation();
    const result = measureGateRun(gateA, gateB);
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    setBallPosition(0);
    setClock(0);
    setGateATime(null);
    setGateBTime(null);
    setIsRunning(true);
    setLastResult(null);
    setAnnouncement('The ball is running.');

    if (reduceMotion) {
      finishRun(result);
      return;
    }

    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = clamp((now - startedAt) / RUN_DURATION_MS, 0, 1);
      const simulatedTime = result.endTime * progress;
      const distance = Math.min(ballDistance(simulatedTime), result.gateB);

      setBallPosition(distance);
      setClock(simulatedTime);

      if (simulatedTime >= result.startTime) {
        setGateATime(result.startTime);
      }

      if (simulatedTime >= result.endTime) {
        setGateBTime(result.endTime);
      }

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(tick);
      } else {
        finishRun(result);
      }
    };

    animationFrame.current = requestAnimationFrame(tick);
  };

  const setGates = (nextGateA: number, nextGateB: number) => {
    stopAnimation();
    setGateA(nextGateA);
    setGateB(nextGateB);
    setBallPosition(0);
    setClock(0);
    setGateATime(null);
    setGateBTime(null);
    setIsRunning(false);
    setLastResult(null);
  };

  const reset = () => {
    setGates(25, 100);
    setRunLog([]);
    setAnnouncement(
      'The experiment was reset. Gate A is at 25 metres and Gate B is at 100 metres.',
    );
  };

  const moveGate = (which: 'a' | 'b', nextPosition: number) => {
    if (which === 'a') {
      setGates(
        roundPosition(clamp(nextPosition, 0, gateB - MINIMUM_GATE_GAP)),
        gateB,
      );
    } else {
      setGates(
        gateA,
        roundPosition(
          clamp(nextPosition, gateA + MINIMUM_GATE_GAP, TRACK_LENGTH),
        ),
      );
    }
  };

  const positionFromPointer = (clientX: number) => {
    const bounds = trackRef.current?.getBoundingClientRect();
    if (!bounds) {
      return 0;
    }

    return ((clientX - bounds.left) / bounds.width) * TRACK_LENGTH;
  };

  const beginGateDrag = (
    which: 'a' | 'b',
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    moveGate(which, positionFromPointer(event.clientX));
  };

  const continueGateDrag = (
    which: 'a' | 'b',
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      moveGate(which, positionFromPointer(event.clientX));
    }
  };

  const moveGateWithKeyboard = (
    which: 'a' | 'b',
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const current = which === 'a' ? gateA : gateB;
    const step = event.shiftKey ? 1 : 0.25;
    let next = current;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      next -= step;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      next += step;
    } else if (event.key === 'Home') {
      next = which === 'a' ? 0 : gateA + MINIMUM_GATE_GAP;
    } else if (event.key === 'End') {
      next = which === 'a' ? gateB - MINIMUM_GATE_GAP : TRACK_LENGTH;
    } else {
      return;
    }

    event.preventDefault();
    moveGate(which, next);
  };

  return (
    <section
      aria-labelledby="ball-gates-title"
      className="playfield border-2 border-[color:var(--play-border)] bg-[color:var(--play-bg)] text-[color:var(--play-text)] shadow-[12px_12px_0_color-mix(in_oklch,var(--foreground),transparent_88%)]"
    >
      <div className="playfield-grid">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[color:var(--play-border)] p-4 sm:p-5">
          <div>
            <p className="play-kicker">Experiment 01 / Average velocity</p>
            <h2
              id="ball-gates-title"
              className="mt-1 font-mono text-lg font-bold tracking-[-0.03em] text-white sm:text-xl"
            >
              THE BALL + THE GATES
            </h2>
          </div>
          <p className="max-w-xs font-mono text-[0.7rem] leading-5 text-[color:var(--play-muted)]">
            Drag either gate, or focus it and use arrow keys. Shift + arrow
            moves one metre.
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[0.68rem] font-bold tracking-[0.12em] text-[color:var(--play-muted)] uppercase">
            <span>0 m</span>
            <span>Track / 100 m</span>
            <span>100 m</span>
          </div>

          <div
            className="play-track-shell"
            aria-label="One hundred metre track"
          >
            <div ref={trackRef} className="play-track">
              <div className="play-rail" aria-hidden="true" />
              <div
                className="play-measured-gap"
                style={{
                  left: `${gateA}%`,
                  width: `${gateB - gateA}%`,
                }}
                aria-hidden="true"
              />
              <div
                className="play-ball"
                style={{ left: `${ballPosition}%` }}
                aria-hidden="true"
              />

              <button
                type="button"
                role="slider"
                aria-label="Gate A position"
                aria-valuemin={0}
                aria-valuemax={gateB - MINIMUM_GATE_GAP}
                aria-valuenow={gateA}
                aria-valuetext={`${formatGateValue(gateA)} metres`}
                disabled={isRunning}
                className="gate-marker gate-a"
                style={{ left: `${gateA}%` }}
                onPointerDown={(event) => beginGateDrag('a', event)}
                onPointerMove={(event) => continueGateDrag('a', event)}
                onKeyDown={(event) => moveGateWithKeyboard('a', event)}
              >
                <span aria-hidden="true" className="gate-post" />
                <span
                  aria-hidden="true"
                  className="gate-readout"
                  style={{ transform: gateReadoutTransform(gateA) }}
                >
                  <span className="gate-readout-title">Gate A</span>
                  <span>
                    s<sub>A</sub> = {formatGateReading(gateA)} m
                  </span>
                  <span className="gate-readout-time">
                    t<sub>A</sub> ={' '}
                    {gateATime === null
                      ? '—'
                      : `${formatGateReading(gateATime)} s`}
                  </span>
                </span>
              </button>

              <button
                type="button"
                role="slider"
                aria-label="Gate B position"
                aria-valuemin={gateA + MINIMUM_GATE_GAP}
                aria-valuemax={TRACK_LENGTH}
                aria-valuenow={gateB}
                aria-valuetext={`${formatGateValue(gateB)} metres`}
                disabled={isRunning}
                className="gate-marker gate-b"
                style={{ left: `${gateB}%` }}
                onPointerDown={(event) => beginGateDrag('b', event)}
                onPointerMove={(event) => continueGateDrag('b', event)}
                onKeyDown={(event) => moveGateWithKeyboard('b', event)}
              >
                <span aria-hidden="true" className="gate-post" />
                <span
                  aria-hidden="true"
                  className="gate-readout"
                  style={{ transform: gateReadoutTransform(gateB) }}
                >
                  <span className="gate-readout-title">Gate B</span>
                  <span>
                    s<sub>B</sub> = {formatGateReading(gateB)} m
                  </span>
                  <span className="gate-readout-time">
                    t<sub>B</sub> ={' '}
                    {gateBTime === null
                      ? '—'
                      : `${formatGateReading(gateBTime)} s`}
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="play-clock" aria-hidden="true">
              <span>Clock t</span>
              <strong>{formatGateReading(clock)} s</strong>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="play-kicker mb-2">
                Try these in order, or choose your own
              </p>
              <div
                className="flex flex-wrap gap-2"
                aria-label="Guided gate moves"
              >
                {guidedMoves.map((move) => (
                  <button
                    key={`${move.stage}-${move.gateB}`}
                    type="button"
                    disabled={isRunning}
                    className="play-preset min-h-11 border border-[color:var(--play-border)] px-3 py-2 font-mono text-xs font-bold text-[color:var(--play-text)] outline-none hover:border-[color:var(--play-accent)] hover:text-white focus-visible:ring-3 focus-visible:ring-[color:var(--play-accent)]/45 disabled:opacity-45"
                    onClick={() => setGates(move.gateA, move.gateB)}
                  >
                    <span className="text-[color:var(--play-accent)]">
                      {move.stage}
                    </span>{' '}
                    · {move.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="h-11 rounded-none border border-[color:var(--play-border)] px-4 font-mono text-xs font-bold text-[color:var(--play-muted)] hover:bg-white/6 hover:text-white"
                onClick={reset}
                disabled={isRunning}
              >
                <RotateCcw data-icon="inline-start" />
                Reset
              </Button>
              <Button
                type="button"
                className="h-11 rounded-none border border-[color:var(--play-accent)] bg-[color:var(--play-accent)] px-6 font-mono text-sm font-black tracking-[0.08em] text-[color:var(--play-button-text)] hover:bg-[color:var(--play-accent)]/88 focus-visible:ring-[color:var(--play-accent)]/55"
                onClick={run}
                disabled={isRunning}
              >
                <Play data-icon="inline-start" fill="currentColor" />
                {isRunning ? 'RUNNING' : 'RUN'}
              </Button>
            </div>
          </div>

          <div className="gate-calculation mt-5" aria-hidden="true">
            <div className="gate-calculation-row">
              <span>
                Δs = s<sub>B</sub> − s<sub>A</sub>
              </span>
              <span>
                = {formatGateReading(gateB)} m − {formatGateReading(gateA)} m ={' '}
                {formatGateReading(configuredRun.distanceChange)} m
              </span>
            </div>
            <div className="gate-calculation-row">
              <span>
                Δt = t<sub>B</sub> − t<sub>A</sub>
              </span>
              <span>
                ={' '}
                {gateBTime === null ? '—' : `${formatGateReading(gateBTime)} s`}{' '}
                −{' '}
                {gateATime === null ? '—' : `${formatGateReading(gateATime)} s`}{' '}
                ={' '}
                {lastResult === null
                  ? '—'
                  : `${formatGateReading(lastResult.elapsedTime)} s`}
              </span>
            </div>
            <div className="gate-calculation-row gate-calculation-average">
              <span>Average velocity</span>
              <span>
                = Δs ÷ Δt ={' '}
                {lastResult === null
                  ? '—'
                  : `${formatGateReading(lastResult.distanceChange)} m ÷ ${formatGateReading(lastResult.elapsedTime)} s = ${lastResult.averageSpeed.toFixed(2)} m/s`}
              </span>
            </div>
          </div>

          <div className="play-teaching-notes">
            <p>
              The gate positions determine Δs before the run. The crossing times
              — and so the measured value of Δt — are not shown until the ball
              reaches each gate.
            </p>
            <p>
              The delay between the two stamps represents the interval whose
              value is t<sub>B</sub> − t<sub>A</sub>.
            </p>
            <p>
              Both positions are measured from the same reference point. Δs is
              the difference between them.
            </p>
            <p>
              Because the ball moves only forward here, its average speed and
              average velocity have the same value.
            </p>
            <p>
              <a href={activeCalculusSectionOneOne}>Active Calculus §1.1</a>{' '}
              writes this without the Δ, as AV[a,b] = (s(b) − s(a)) / (b − a).
              Same subtraction over the same subtraction.
            </p>
          </div>

          <p className="mt-5 font-mono text-xs leading-5 text-[color:var(--play-muted)]">
            {resultNote(lastResult)}
          </p>

          <div className="mt-6 border-2 border-[color:var(--play-border)] bg-black/16 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="play-kicker text-[color:var(--play-text)]">
                Run log
              </h3>
              <span className="font-mono text-[0.65rem] text-[color:var(--play-muted)]">
                newest at bottom
              </span>
            </div>
            {runLog.length === 0 ? (
              <p className="mt-3 font-mono text-xs text-[color:var(--play-muted)]">
                No runs yet. Start wide, then squeeze the gates.
              </p>
            ) : (
              <ol className="mt-3 space-y-2 font-mono text-xs sm:text-sm">
                {runLog.map((result, index) => (
                  <li
                    key={`${index}-${result.gateA}-${result.gateB}`}
                    className="grid grid-cols-[2ch_1fr] gap-2 border-t border-[color:var(--play-border)] pt-2"
                  >
                    <span className="text-[color:var(--play-muted)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="run-log-entry">
                      <span>
                        {formatGateValue(result.gateA)} →{' '}
                        {formatGateValue(result.gateB)}
                      </span>
                      <span>
                        Δs {formatGateReading(result.distanceChange)} m
                      </span>
                      <span>Δt {formatGateReading(result.elapsedTime)} s</span>
                      <strong className="text-[color:var(--play-accent)]">
                        = {result.averageSpeed.toFixed(2)} m/s
                      </strong>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>
          <p className="sr-only">
            The currently configured run has Gate A at{' '}
            {formatGateValue(configuredRun.gateA)} metres and Gate B at{' '}
            {formatGateValue(configuredRun.gateB)} metres. The change in
            position is {formatGateValue(configuredRun.distanceChange)} metres.
            Crossing times are reported after the ball reaches each gate.
          </p>
        </div>
      </div>
    </section>
  );
}
