import type { Metadata } from 'next';

import SectionOneEight from '@/content/week4/section-1-8.mdx';

export const metadata: Metadata = {
  title: 'The Tangent Line Approximation (Section 1.8)',
  description:
    'Building the linearization from f(a) and f prime of a, estimating with it, and reading the direction of the error off the concavity.',
};

/**
 * The same MDX as `app/embed/section-1-8/`, presented for a Blackboard frame.
 *
 * The two Desmos graphs stay inline here, at fixed pixel heights with real
 * titles. They are third-party frames nested inside this one, which is fine:
 * nothing they need runs in the Blackboard Document, only inside the frame.
 */
export default function SectionOneEightBlackboardPage() {
  return (
    <article className="embed-prose">
      <SectionOneEight components={{ h1: () => null }} />
    </article>
  );
}
