import type { Metadata } from 'next';

import SectionTwoTwo from '@/content/week5/section-2-2.mdx';

export const metadata: Metadata = {
  title: 'The Sine and Cosine Functions (Section 2.2)',
  description:
    'Derivative rules for sine and cosine, radians, signs, and periodic motion.',
};

export default function SectionTwoTwoEmbedPage() {
  return (
    <article className="embed-prose">
      <SectionTwoTwo />
    </article>
  );
}
