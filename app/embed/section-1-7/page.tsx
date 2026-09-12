import type { Metadata } from 'next';

import { CornerSlopeLab } from '@/components/corner-slope-lab';
import SectionOneSeven from '@/content/week4/section-1-7.mdx';

export const metadata: Metadata = {
  title: 'Limits, Continuity, and Differentiability (Section 1.7)',
  description:
    'The three conditions for continuity, the two ways continuity fails, and why a corner is continuous without being differentiable.',
};

/**
 * The full-screen page. This is the link target, and it keeps its h1.
 *
 * `CornerSlopeLab` arrives through the components map rather than through an
 * import in the MDX, because the same content renders three ways and the
 * explorer is the part that differs: inline React here, a nested frame on
 * `app/bb/section-1-7/`, and a panel-plus-link block in the pasted fragment.
 * MDX throws if the name is not provided, so a missing one fails loudly.
 */
export default function SectionOneSevenEmbedPage() {
  return (
    <article className="embed-prose">
      <SectionOneSeven components={{ CornerSlopeLab }} />
    </article>
  );
}
