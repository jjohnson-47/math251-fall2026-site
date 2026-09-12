import type { Metadata } from 'next';

import IntermediateValueTheorem from '@/content/week4/ivt-openstax.mdx';

export const metadata: Metadata = {
  title: 'Continuity and the Intermediate Value Theorem',
  description:
    'One-sided limit notation, the Intermediate Value Theorem, and the three things the theorem does not tell you.',
};

export default function IntermediateValueTheoremEmbedPage() {
  return (
    <article className="embed-prose">
      <IntermediateValueTheorem />
    </article>
  );
}
