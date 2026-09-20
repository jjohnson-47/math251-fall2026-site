/**
 * The published embed slugs, in reading order.
 *
 * A slug is baked into an iframe `src` in every section of the LMS, so
 * renaming one is an edit in every shell rather than an edit here. They carry
 * no term and no date for the same reason. Adding a route means adding a
 * `routeChecks` entry in `scripts/verify-pages.mjs` as well.
 */
export type EmbedRoute = {
  slug: string;
  title: string;
};

export const week4EmbedRoutes: readonly EmbedRoute[] = [
  {
    slug: 'section-1-7',
    title: 'Limits, Continuity, and Differentiability (Section 1.7)',
  },
  {
    slug: 'ivt-openstax',
    title: 'Continuity and the Intermediate Value Theorem',
  },
  {
    slug: 'section-1-8',
    title: 'The Tangent Line Approximation (Section 1.8)',
  },
];

export const week5EmbedRoutes: readonly EmbedRoute[] = [
  {
    slug: 'section-2-1',
    title: 'Elementary Derivative Rules (Section 2.1)',
  },
  {
    slug: 'section-2-2',
    title: 'The Sine and Cosine Functions (Section 2.2)',
  },
];

export const embedRoutesByWeek: readonly (readonly EmbedRoute[])[] = [
  week4EmbedRoutes,
  week5EmbedRoutes,
];

export const activeCalculusSectionOneSeven =
  'https://activecalculus.org/single2e/sec-1-7-lim-cont-diff.html';

export const activeCalculusSectionOneEight =
  'https://activecalculus.org/single2e/sec-1-8-tan-line-approx.html';

export const openStaxContinuity =
  'https://openstax.org/books/calculus-volume-1/pages/2-4-continuity';

export const activeCalculusSectionTwoOne =
  'https://activecalculus.org/single2e/sec-2-1-elem-rules.html';

export const activeCalculusSectionTwoTwo =
  'https://activecalculus.org/single2e/sec-2-2-sin-cos.html';
