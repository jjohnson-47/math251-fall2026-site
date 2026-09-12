import type { Metadata } from 'next';

import SectionOneSeven from '@/content/week4/section-1-7.mdx';

export const metadata: Metadata = {
  title: 'Limits, Continuity, and Differentiability (Section 1.7)',
  description:
    'The three conditions for continuity, the two ways continuity fails, and why a corner is continuous without being differentiable.',
};

export default function SectionOneSevenEmbedPage() {
  return (
    <article className="embed-prose">
      <SectionOneSeven />
    </article>
  );
}
