import type { Metadata } from 'next';

import { BbWidgetFrame } from '@/components/bb-widget-frame';
import SectionOneSeven from '@/content/week4/section-1-7.mdx';

export const metadata: Metadata = {
  title: 'Limits, Continuity, and Differentiability (Section 1.7)',
  description:
    'The three conditions for continuity, the two ways continuity fails, and why a corner is continuous without being differentiable.',
};

/**
 * The same MDX as `app/embed/section-1-7/`, presented for a Blackboard frame.
 *
 * Two things come from the components map rather than from the MDX's imports,
 * which is the whole reason `CornerSlopeLab` is not imported in the content
 * file: a name MDX cannot resolve locally is looked up here, so one source
 * renders three ways. The h1 is dropped because the Document title carries it,
 * and the explorer becomes a nested frame at its own measured height because
 * this page is already inside one.
 */
export default function SectionOneSevenBlackboardPage() {
  return (
    <article className="embed-prose">
      <SectionOneSeven
        components={{ h1: () => null, CornerSlopeLab: BbWidgetFrame }}
      />
    </article>
  );
}
