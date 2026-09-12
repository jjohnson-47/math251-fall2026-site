import type { Metadata } from 'next';

import IntermediateValueTheorem from '@/content/week4/ivt-openstax.mdx';

export const metadata: Metadata = {
  title: 'Continuity and the Intermediate Value Theorem',
  description:
    'One-sided limit notation, the Intermediate Value Theorem, and the three things the theorem does not tell you.',
};

/**
 * The same MDX as `app/embed/ivt-openstax/`, presented for a Blackboard frame.
 * The h1 is dropped: the Document title already carries it.
 */
export default function IntermediateValueTheoremBlackboardPage() {
  return (
    <article className="embed-prose">
      <IntermediateValueTheorem components={{ h1: () => null }} />
    </article>
  );
}
