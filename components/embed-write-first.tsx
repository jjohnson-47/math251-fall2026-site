import type { ReactNode } from 'react';

type WriteFirstProps = {
  /** Prefix for the textarea and its description, unique on the page. */
  anchor: string;
  /** The instruction, rendered as the textarea's own label. */
  prompt: string;
  /** A question about the student's own sentence, not about the material. */
  selfCheck: string;
  children: ReactNode;
};

/**
 * Write before you read the model answer.
 *
 * Deliberately plain HTML: a textarea and a details element both work with
 * JavaScript switched off, and nothing here is stored, submitted or graded.
 */
export function WriteFirst({
  anchor,
  prompt,
  selfCheck,
  children,
}: WriteFirstProps) {
  return (
    <div className="embed-writing">
      <label className="embed-writing-label" htmlFor={`${anchor}-answer`}>
        {prompt}
      </label>
      <textarea
        aria-describedby={`${anchor}-note`}
        autoComplete="off"
        className="embed-writing-input"
        id={`${anchor}-answer`}
        name={`${anchor}-answer`}
        rows={3}
        spellCheck={false}
      />
      <p className="embed-writing-note" id={`${anchor}-note`}>
        Write here or in your notes before you open the check. This is ungraded
        practice; nothing you type is saved, submitted or seen by anyone.
      </p>
      <details className="embed-check">
        <summary className="embed-check-summary">{selfCheck}</summary>
        <div className="embed-check-body">{children}</div>
      </details>
    </div>
  );
}
