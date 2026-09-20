import type { Metadata } from 'next';

import SectionTwoOne from '@/content/week5/section-2-1.mdx';

export const metadata: Metadata = {
  title: 'Elementary Derivative Rules (Section 2.1)',
  description:
    'Constant, power, constant multiple, sum, difference, and exponential derivative rules.',
};

export default function SectionTwoOneEmbedPage() {
  return (
    <article className="embed-prose">
      <SectionTwoOne />
    </article>
  );
}
