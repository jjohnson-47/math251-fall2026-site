import type { Metadata } from 'next';

import SectionOneEight from '@/content/week4/section-1-8.mdx';

export const metadata: Metadata = {
  title: 'The Tangent Line Approximation (Section 1.8)',
  description:
    'Building the linearization from f(a) and f prime of a, estimating with it, and reading the direction of the error off the concavity.',
};

export default function SectionOneEightEmbedPage() {
  return (
    <article className="embed-prose">
      <SectionOneEight />
    </article>
  );
}
