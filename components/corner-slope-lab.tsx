'use client';

import { useMemo, useState } from 'react';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  cornerFunction,
  cornerPoint,
  formatDecimal,
  readCorner,
} from '@/lib/corner';

// The two axes carry the SAME number of pixels per unit: the plot is 452 by
// 316 and the domains are 4 by 2.8, which is 113 and 112.9 pixels per unit.
// That is not a detail on this page. A slope of −1 and a slope of +1 have to
// come out as mirrored 45-degree lines, and a wider, flatter box would draw
// them shallower than they are on a page whose whole subject is slope. The
// room below zero is what makes the two lines visible at all: every line
// through the corner at (2, 0) leaves the top half of the plot immediately.
const WIDTH = 520;
const HEIGHT = 372;
const PADDING = { top: 18, right: 22, bottom: 38, left: 46 };
const X_DOMAIN = [0, 4] as const;
const Y_DOMAIN = [-0.8, 2] as const;

// Hand-written and stable, not `useId()`. The exported markup carried
// `_R_uqi_-x` and the hydrated DOM carried `_r_0_-x`, so the two render passes
// do not agree on generated ids, and an id that moves between them is one
// thing hydration cannot reconcile. Removing it did NOT clear React error #418
// on this page, so it was not the only mismatch here and may not have been a
// cause at all; fixed ids are simply the deterministic choice, and the
// explorer appears once per page so they cannot collide.
const ID = 'corner-lab';

const START_POINT = 2;
const START_GAP = 0.5;

// Stops at 0.01. Smaller gaps subtract two nearly equal numbers and divide by
// the gap, so the printed slope would start to wobble for reasons that have
// nothing to do with the corner. `tests/corner.test.ts` pins that boundary.
const GAP_CHOICES = [0.5, 0.1, 0.01] as const;

function sliderValue(value: number | readonly number[], fallback: number) {
  return typeof value === 'number' ? value : (value[0] ?? fallback);
}

type CornerSlopeLabProps = {
  /**
   * Widget mode: the explorer alone, sized to fit a Blackboard frame that does
   * not scroll. The heading, the standfirst and the standalone legend all come
   * off, because the block above the frame already says what this is and a
   * widget that scrolls is a failed widget.
   */
  compact?: boolean;
};

export function CornerSlopeLab({ compact = false }: CornerSlopeLabProps) {
  const [x, setX] = useState<number>(START_POINT);
  const [gap, setGap] = useState<number>(START_GAP);
  const reading = readCorner(x, gap);

  const plot = useMemo(() => {
    const plotWidth = WIDTH - PADDING.left - PADDING.right;
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const scaleX = (value: number) =>
      PADDING.left +
      ((value - X_DOMAIN[0]) / (X_DOMAIN[1] - X_DOMAIN[0])) * plotWidth;
    const scaleY = (value: number) =>
      PADDING.top +
      (1 - (value - Y_DOMAIN[0]) / (Y_DOMAIN[1] - Y_DOMAIN[0])) * plotHeight;

    // g is piecewise linear, so three points draw it exactly. Every one of
    // them comes from `cornerFunction`; nothing here is a hand-placed vertex.
    const curve = [X_DOMAIN[0], cornerPoint, X_DOMAIN[1]]
      .map(
        (value, index) =>
          `${index === 0 ? 'M' : 'L'} ${scaleX(value).toFixed(2)} ${scaleY(
            cornerFunction(value),
          ).toFixed(2)}`,
      )
      .join(' ');

    const lineThroughPoint = (slope: number) => {
      const height = (value: number) => cornerFunction(x) + slope * (value - x);

      return {
        x1: scaleX(X_DOMAIN[0]),
        y1: scaleY(height(X_DOMAIN[0])),
        x2: scaleX(X_DOMAIN[1]),
        y2: scaleY(height(X_DOMAIN[1])),
      };
    };

    return {
      scaleX,
      scaleY,
      curve,
      leftLine: lineThroughPoint(reading.leftSlope),
      rightLine: lineThroughPoint(reading.rightSlope),
    };
  }, [reading.leftSlope, reading.rightSlope, x]);

  const leftSlopeText = formatDecimal(reading.leftSlope);
  const rightSlopeText = formatDecimal(reading.rightSlope);
  const pointText = formatDecimal(x);

  const verdict = reading.slopesAgree
    ? `Both slopes are ${leftSlopeText}. They agree, so g has one slope at x = ${pointText} and is differentiable there.`
    : x === cornerPoint
      ? `They differ by ${formatDecimal(reading.slopeDifference)}. However small the gap gets the two numbers stay ${leftSlopeText} and ${rightSlopeText}, so there is no derivative at x = ${cornerPoint}.`
      : `They differ by ${formatDecimal(reading.slopeDifference)}: a gap of ${formatDecimal(gap)} reaches across the corner at x = ${cornerPoint}. Choose a smaller gap and they will agree.`;

  const reset = () => {
    setX(START_POINT);
    setGap(START_GAP);
  };

  return (
    <section
      aria-labelledby="corner-lab-title"
      className={compact ? 'embed-lab embed-lab--compact' : 'embed-lab'}
    >
      {compact ? (
        <h1 className="embed-lab-compact-title" id="corner-lab-title">
          Slopes at a corner
        </h1>
      ) : (
        <div className="embed-lab-head">
          <p className="section-kicker">Move the point</p>
          <h2 className="embed-lab-title" id="corner-lab-title">
            Read both slopes at once
          </h2>
          <p className="embed-lab-intro">
            The graph is g(x) = |x − 2|. The slope from the left uses the point
            a gap behind x; the slope from the right uses the point a gap ahead
            of it. Land on x = 2 and the two numbers stop agreeing.
          </p>
        </div>
      )}

      <div className="embed-lab-body">
        <div className="embed-lab-plot">
          <svg
            aria-labelledby={`${ID}-title ${ID}-desc`}
            className="embed-lab-svg"
            role="img"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          >
            <title id={`${ID}-title`}>
              The graph of g of x equals the absolute value of x minus 2, with
              the slope from the left and the slope from the right drawn at the
              chosen point
            </title>
            <desc id={`${ID}-desc`}>
              A V-shaped graph with its corner at x equals 2. At x equals{' '}
              {pointText}, with a gap of {formatDecimal(gap)}, the slope from
              the left is {leftSlopeText} and the slope from the right is{' '}
              {rightSlopeText}. {verdict}
            </desc>

            <rect
              fill="var(--card)"
              height={HEIGHT - PADDING.top - PADDING.bottom}
              rx="10"
              width={WIDTH - PADDING.left - PADDING.right}
              x={PADDING.left}
              y={PADDING.top}
            />

            {[0, 1, 2, 3, 4].map((tick) => (
              <g key={`x-${tick}`}>
                <line
                  stroke="var(--border)"
                  strokeWidth="1"
                  x1={plot.scaleX(tick)}
                  x2={plot.scaleX(tick)}
                  y1={PADDING.top}
                  y2={HEIGHT - PADDING.bottom}
                />
                <text
                  fill="var(--muted-foreground)"
                  fontSize="13"
                  textAnchor="middle"
                  x={plot.scaleX(tick)}
                  y={HEIGHT - 14}
                >
                  {tick}
                </text>
              </g>
            ))}
            {[0, 1, 2].map((tick) => (
              <g key={`y-${tick}`}>
                <line
                  stroke="var(--border)"
                  strokeWidth="1"
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={plot.scaleY(tick)}
                  y2={plot.scaleY(tick)}
                />
                <text
                  fill="var(--muted-foreground)"
                  fontSize="13"
                  textAnchor="end"
                  x={PADDING.left - 10}
                  y={plot.scaleY(tick) + 4}
                >
                  {tick}
                </text>
              </g>
            ))}

            <g clipPath={`url(#${ID}-clip)`}>
              <line
                stroke="var(--primary)"
                strokeLinecap="round"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                {...plot.leftLine}
              />
              <line
                stroke="var(--accent-strong)"
                strokeDasharray="9 7"
                strokeLinecap="round"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                {...plot.rightLine}
              />
              <path
                d={plot.curve}
                fill="none"
                stroke="var(--foreground)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <defs>
              <clipPath id={`${ID}-clip`}>
                <rect
                  height={HEIGHT - PADDING.top - PADDING.bottom}
                  rx="10"
                  width={WIDTH - PADDING.left - PADDING.right}
                  x={PADDING.left}
                  y={PADDING.top}
                />
              </clipPath>
            </defs>

            <rect
              fill="var(--primary)"
              height="11"
              width="11"
              x={plot.scaleX(x - gap) - 5.5}
              y={plot.scaleY(cornerFunction(x - gap)) - 5.5}
            />
            <rect
              fill="var(--accent-strong)"
              height="11"
              width="11"
              x={plot.scaleX(x + gap) - 5.5}
              y={plot.scaleY(cornerFunction(x + gap)) - 5.5}
            />
            <circle
              cx={plot.scaleX(x)}
              cy={plot.scaleY(cornerFunction(x))}
              fill="var(--card)"
              r="8"
              stroke="var(--foreground)"
              strokeWidth="5"
            />
          </svg>

          {compact ? null : (
            <ul className="embed-lab-legend">
              <li>
                <span
                  aria-hidden="true"
                  className="embed-lab-swatch embed-lab-swatch--left"
                />
                Solid line: slope from the left
              </li>
              <li>
                <span
                  aria-hidden="true"
                  className="embed-lab-swatch embed-lab-swatch--right"
                />
                Dashed line: slope from the right
              </li>
            </ul>
          )}
        </div>

        <div className="embed-lab-controls">
          <div className="embed-lab-control">
            <div className="embed-lab-control-head">
              <span className="embed-lab-control-label" id={`${ID}-x`}>
                Point x
              </span>
              <output className="embed-lab-output">{pointText}</output>
            </div>
            <Slider
              aria-labelledby={`${ID}-x`}
              max={3.5}
              min={0.5}
              step={0.25}
              value={[x]}
              onValueChange={(value) => setX(sliderValue(value, x))}
            />
          </div>

          <fieldset className="embed-lab-fieldset">
            <legend className="embed-lab-control-label">
              Gap on each side
            </legend>
            <div className="embed-lab-choices">
              {GAP_CHOICES.map((choice) => (
                <label className="embed-lab-choice" key={choice}>
                  <input
                    checked={gap === choice}
                    name={`${ID}-gap`}
                    onChange={() => setGap(choice)}
                    type="radio"
                    value={choice}
                  />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <dl className="embed-lab-readout">
            <div className="embed-lab-reading embed-lab-reading--left">
              <dt>
                {compact ? (
                  <span
                    aria-hidden="true"
                    className="embed-lab-swatch embed-lab-swatch--left"
                  />
                ) : null}
                Slope from the left
              </dt>
              <dd>{leftSlopeText}</dd>
            </div>
            <div className="embed-lab-reading embed-lab-reading--right">
              <dt>
                {compact ? (
                  <span
                    aria-hidden="true"
                    className="embed-lab-swatch embed-lab-swatch--right"
                  />
                ) : null}
                Slope from the right
              </dt>
              <dd>{rightSlopeText}</dd>
            </div>
          </dl>

          <p
            aria-atomic="true"
            aria-live="polite"
            className="embed-lab-verdict"
          >
            {verdict}
          </p>

          {/* No icon. The policy checker requires a nonempty <title> on every
              inline SVG, and a decorative icon carrying a title it also hides
              from assistive technology satisfies the letter of that rule while
              making the markup worse. The graph above is the page's only
              inline SVG, and it is titled and described. */}
          <Button
            className="embed-lab-reset"
            onClick={reset}
            size="sm"
            type="button"
            variant="ghost"
          >
            Reset to the corner
          </Button>
        </div>
      </div>
    </section>
  );
}
