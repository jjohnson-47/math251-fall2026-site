'use client';

import { useId, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { quadratic, quadraticDerivative, secantSlope } from '@/lib/calculus';

const WIDTH = 640;
const HEIGHT = 360;
const PADDING = { top: 24, right: 26, bottom: 42, left: 48 };
const X_DOMAIN = [-4, 5] as const;
const Y_DOMAIN = [-1, 13] as const;

function formatNumber(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function sliderValue(value: number | readonly number[], fallback: number) {
  return typeof value === 'number' ? value : (value[0] ?? fallback);
}

export function DerivativeLab() {
  const [x, setX] = useState(1);
  const [deltaX, setDeltaX] = useState(2);
  const clipId = useId();

  const plot = useMemo(() => {
    const plotWidth = WIDTH - PADDING.left - PADDING.right;
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const scaleX = (value: number) =>
      PADDING.left +
      ((value - X_DOMAIN[0]) / (X_DOMAIN[1] - X_DOMAIN[0])) * plotWidth;
    const scaleY = (value: number) =>
      PADDING.top +
      (1 - (value - Y_DOMAIN[0]) / (Y_DOMAIN[1] - Y_DOMAIN[0])) * plotHeight;

    const curve = Array.from({ length: 181 }, (_, index) => {
      const value = X_DOMAIN[0] + (index / 180) * (X_DOMAIN[1] - X_DOMAIN[0]);
      return `${index === 0 ? 'M' : 'L'} ${scaleX(value).toFixed(2)} ${scaleY(quadratic(value)).toFixed(2)}`;
    }).join(' ');

    const secondX = x + deltaX;
    const currentSecantSlope = secantSlope(quadratic, x, deltaX);
    const tangentSlope = quadraticDerivative(x);
    const lineY = (value: number, slope: number) =>
      quadratic(x) + slope * (value - x);

    return {
      scaleX,
      scaleY,
      curve,
      secondX,
      secantSlope: currentSecantSlope,
      tangentSlope,
      secant: {
        x1: scaleX(X_DOMAIN[0]),
        y1: scaleY(lineY(X_DOMAIN[0], currentSecantSlope)),
        x2: scaleX(X_DOMAIN[1]),
        y2: scaleY(lineY(X_DOMAIN[1], currentSecantSlope)),
      },
      tangent: {
        x1: scaleX(X_DOMAIN[0]),
        y1: scaleY(lineY(X_DOMAIN[0], tangentSlope)),
        x2: scaleX(X_DOMAIN[1]),
        y2: scaleY(lineY(X_DOMAIN[1], tangentSlope)),
      },
    };
  }, [deltaX, x]);

  const reset = () => {
    setX(1);
    setDeltaX(2);
  };

  return (
    <section
      aria-labelledby="derivative-lab-title"
      className="overflow-hidden rounded-[1.6rem] border border-foreground/12 bg-card shadow-[0_28px_80px_rgb(30_53_78/14%)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-foreground/10 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-primary uppercase">
            Interactive 01
          </p>
          <h2
            id="derivative-lab-title"
            className="mt-1 text-lg font-semibold tracking-[-0.02em]"
          >
            Chase the tangent line
          </h2>
        </div>
        <Badge variant="secondary">f(x) = ½x²</Badge>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="relative min-w-0 bg-[color-mix(in_oklch,var(--secondary),white_54%)] p-3 sm:p-4">
          <svg
            className="h-auto w-full"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-labelledby={`${clipId}-title ${clipId}-description`}
          >
            <title id={`${clipId}-title`}>
              Secant and tangent lines on the graph of one-half x squared
            </title>
            <desc id={`${clipId}-description`}>
              The blue secant line passes through x equals {formatNumber(x)} and
              x equals {formatNumber(plot.secondX)}. Its slope is{' '}
              {formatNumber(plot.secantSlope)}. The gold tangent line has slope{' '}
              {formatNumber(plot.tangentSlope)}.
            </desc>
            <defs>
              <clipPath id={clipId}>
                <rect
                  x={PADDING.left}
                  y={PADDING.top}
                  width={WIDTH - PADDING.left - PADDING.right}
                  height={HEIGHT - PADDING.top - PADDING.bottom}
                  rx="12"
                />
              </clipPath>
            </defs>

            <rect
              x={PADDING.left}
              y={PADDING.top}
              width={WIDTH - PADDING.left - PADDING.right}
              height={HEIGHT - PADDING.top - PADDING.bottom}
              rx="12"
              fill="var(--card)"
            />

            {[-4, -2, 0, 2, 4].map((tick) => (
              <g key={`x-${tick}`}>
                <line
                  x1={plot.scaleX(tick)}
                  y1={PADDING.top}
                  x2={plot.scaleX(tick)}
                  y2={HEIGHT - PADDING.bottom}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
                <text
                  x={plot.scaleX(tick)}
                  y={HEIGHT - 17}
                  fill="var(--muted-foreground)"
                  fontSize="13"
                  textAnchor="middle"
                >
                  {tick}
                </text>
              </g>
            ))}
            {[0, 4, 8, 12].map((tick) => (
              <g key={`y-${tick}`}>
                <line
                  x1={PADDING.left}
                  y1={plot.scaleY(tick)}
                  x2={WIDTH - PADDING.right}
                  y2={plot.scaleY(tick)}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
                <text
                  x={PADDING.left - 12}
                  y={plot.scaleY(tick) + 4}
                  fill="var(--muted-foreground)"
                  fontSize="13"
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            ))}

            <g clipPath={`url(#${clipId})`}>
              <line
                x1={plot.scaleX(0)}
                y1={PADDING.top}
                x2={plot.scaleX(0)}
                y2={HEIGHT - PADDING.bottom}
                stroke="var(--foreground)"
                strokeOpacity="0.34"
                strokeWidth="1.5"
              />
              <line
                x1={PADDING.left}
                y1={plot.scaleY(0)}
                x2={WIDTH - PADDING.right}
                y2={plot.scaleY(0)}
                stroke="var(--foreground)"
                strokeOpacity="0.34"
                strokeWidth="1.5"
              />
              <path
                d={plot.curve}
                fill="none"
                stroke="var(--foreground)"
                strokeLinecap="round"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
              <line
                {...plot.tangent}
                stroke="var(--accent-strong)"
                strokeDasharray="8 7"
                strokeLinecap="round"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <line
                {...plot.secant}
                stroke="var(--primary)"
                strokeLinecap="round"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <circle
              cx={plot.scaleX(x)}
              cy={plot.scaleY(quadratic(x))}
              r="8"
              fill="var(--card)"
              stroke="var(--primary)"
              strokeWidth="5"
            />
            <circle
              cx={plot.scaleX(plot.secondX)}
              cy={plot.scaleY(quadratic(plot.secondX))}
              r="8"
              fill="var(--card)"
              stroke="var(--primary)"
              strokeWidth="5"
            />
          </svg>

          <div className="pointer-events-none absolute top-6 left-6 flex flex-wrap gap-2 text-[0.68rem] font-semibold sm:top-7 sm:left-8">
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-primary shadow-sm backdrop-blur">
              — secant
            </span>
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-[color:var(--accent-strong)] shadow-sm backdrop-blur">
              -- tangent
            </span>
          </div>
        </div>

        <div className="border-t border-foreground/10 p-5 lg:border-t-0 lg:border-l">
          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span
                  id={`${clipId}-x-label`}
                  className="text-sm font-semibold"
                >
                  Starting x
                </span>
                <output className="font-mono text-xs font-semibold text-primary">
                  {formatNumber(x)}
                </output>
              </div>
              <Slider
                aria-labelledby={`${clipId}-x-label`}
                min={-2.5}
                max={2.5}
                step={0.25}
                value={[x]}
                onValueChange={(value) => setX(sliderValue(value, x))}
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span
                  id={`${clipId}-dx-label`}
                  className="text-sm font-semibold"
                >
                  Gap Δx
                </span>
                <output className="font-mono text-xs font-semibold text-primary">
                  {formatNumber(deltaX)}
                </output>
              </div>
              <Slider
                aria-labelledby={`${clipId}-dx-label`}
                min={0.2}
                max={2}
                step={0.1}
                value={[deltaX]}
                onValueChange={(value) => setDeltaX(sliderValue(value, deltaX))}
              />
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-2 lg:grid-cols-1">
            <div className="rounded-xl bg-secondary/70 p-3">
              <dt className="text-[0.64rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Secant slope
              </dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-primary">
                {formatNumber(plot.secantSlope)}
              </dd>
            </div>
            <div className="rounded-xl bg-accent/16 p-3">
              <dt className="text-[0.64rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                Tangent slope
              </dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-[color:var(--accent-strong)]">
                {formatNumber(plot.tangentSlope)}
              </dd>
            </div>
          </dl>

          <p
            aria-live="polite"
            className="mt-5 text-sm leading-6 text-muted-foreground"
          >
            Shrink Δx. The blue secant slope approaches the gold tangent slope.
          </p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-4 -ml-2 text-muted-foreground"
            onClick={reset}
          >
            <RotateCcw data-icon="inline-start" />
            Reset lab
          </Button>
        </div>
      </div>
    </section>
  );
}
