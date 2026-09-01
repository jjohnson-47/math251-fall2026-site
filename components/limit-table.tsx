'use client';

import { useState } from 'react';
import { ArrowDown, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { differenceQuotientAtTwo } from '@/lib/calculus';

const hSteps = [1, 0.5, 0.1, 0.01, 0.001, 0] as const;

function formatValue(value: number | undefined) {
  if (value === undefined) {
    return 'undefined';
  }

  return String(Math.round(value * 1000) / 1000);
}

function captionFor(step: number) {
  const h = hSteps[step];
  const value = differenceQuotientAtTwo(h);

  if (h === 0) {
    return 'At h = 0, the quotient is undefined because it divides zero by zero. The nearby values still settle toward 4.';
  }

  if (step === 0) {
    return `With h = ${h}, the average rate of change is ${formatValue(value)}. Shrink the interval and watch the digits settle.`;
  }

  if (step === hSteps.length - 2) {
    return `At h = ${h}, the quotient is ${formatValue(value)}. It is now only 0.001 away from 4, even though h is not zero.`;
  }

  return `At h = ${h}, the quotient is ${formatValue(value)}. Each smaller nonzero interval moves the result closer to 4.`;
}

export function LimitTable() {
  const [currentStep, setCurrentStep] = useState(0);
  const isComplete = currentStep === hSteps.length - 1;
  const visibleSteps = hSteps.slice(0, currentStep + 1);
  const caption = captionFor(currentStep);

  return (
    <section
      aria-labelledby="limit-table-title"
      className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-[0_18px_52px_rgb(27_38_54/6%)]"
    >
      <div className="border-b border-foreground/10 p-5 sm:p-6">
        <p className="section-kicker">One thing to try</p>
        <h3
          id="limit-table-title"
          className="mt-2 text-xl font-semibold tracking-[-0.02em]"
        >
          Watch the digits stop moving
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          For f(x) = x² at x = 2, q(h) is the average rate from x = 2 to x = 2 +
          h.
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <table className="limit-table w-full border-collapse font-mono text-sm">
          <caption className="sr-only">
            Difference quotient values as h approaches zero
          </caption>
          <thead>
            <tr>
              <th scope="col">h</th>
              <th scope="col">q(h)</th>
            </tr>
          </thead>
          <tbody>
            {visibleSteps.map((h, index) => {
              const value = differenceQuotientAtTwo(h);
              const isCurrent = index === currentStep;

              return (
                <tr
                  key={h}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={h === 0 ? 'limit-undefined' : undefined}
                >
                  <th scope="row">
                    {h}
                    {isCurrent ? (
                      <span className="sr-only">, current</span>
                    ) : null}
                  </th>
                  <td>
                    {formatValue(value)}
                    {isCurrent ? (
                      <span className="limit-current-label">current</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p
          className="mt-5 border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          {caption}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            type="button"
            size="lg"
            className="min-h-11 px-4"
            onClick={() =>
              setCurrentStep((current) =>
                Math.min(current + 1, hSteps.length - 1),
              )
            }
            disabled={isComplete}
          >
            <ArrowDown data-icon="inline-start" />
            {isComplete ? 'Reached h = 0' : 'Shrink h'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-h-11 px-4"
            onClick={() => setCurrentStep(0)}
          >
            <RotateCcw data-icon="inline-start" />
            Reset table
          </Button>
        </div>
      </div>
    </section>
  );
}
