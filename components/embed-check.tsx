import type { ReactNode } from 'react';

type PredictRevealProps = {
  /** The question itself. A student answers it before opening the body. */
  question: string;
  children: ReactNode;
};

/**
 * One predict-reveal. The body explains the reasoning rather than announcing
 * the answer, which is the whole reason the question is worth opening.
 */
export function PredictReveal({ question, children }: PredictRevealProps) {
  return (
    <details className="embed-check">
      <summary className="embed-check-summary">{question}</summary>
      <div className="embed-check-body">{children}</div>
    </details>
  );
}
