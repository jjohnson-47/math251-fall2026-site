import type { Metadata } from 'next';

import { CornerSlopeLab } from '@/components/corner-slope-lab';

export const metadata: Metadata = {
  title: 'Slopes at a corner',
  description:
    'Move a point along g(x) = |x − 2| and read the slope from the left and the slope from the right as two numbers that disagree at the corner.',
};

export default function CornerSlopesWidgetPage() {
  return <CornerSlopeLab compact />;
}
