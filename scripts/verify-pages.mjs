import { access, readFile, writeFile } from 'node:fs/promises';

const outputDirectory = new URL('../dist/client/', import.meta.url);
const noJekyllFile = new URL('.nojekyll', outputDirectory);
const mainMathFont = new URL(
  'mathjax/fonts/MathJax_Main-Regular.woff',
  outputDirectory,
);
const socialImage = new URL('og.png', outputDirectory);
const expectedBasePath = '/math251-fall2026-site/';

const routeChecks = [
  {
    route: '/',
    file: 'index.html',
    required: [
      'THE BALL + THE GATES',
      'What is calculus, and what will I be able to do?',
      'aria-label="Gate A position"',
      'aria-live="polite"',
      'Average velocity',
      'Same subtraction over the same subtraction',
      '<mjx-container',
      '<mjx-assistive-mml',
    ],
  },
  {
    route: '/play/',
    file: 'play/index.html',
    required: [
      'Can two clocks measure one instant?',
      'THE BALL + THE GATES',
      'A · MEASURE ONE AVERAGE',
      'Average velocity',
      'Same subtraction over the same subtraction',
      '<mjx-assistive-mml',
    ],
  },
  {
    route: '/explainers/',
    file: 'explainers/index.html',
    required: [
      'Explanations based on questions from MATH A251.',
      'Available',
      'In preparation',
    ],
  },
  {
    route: '/explainers/what-is-calculus/',
    file: 'explainers/what-is-calculus/index.html',
    required: [
      'Calculus is one limiting idea used twice.',
      'id="the-one-move"',
      'id="adding-up-pieces"',
      'id="ftc"',
      'id="tooling"',
      'id="by-december"',
      'id="a-student-question"',
      'id="ask"',
      '<table',
      '<mjx-assistive-mml',
    ],
  },
  // The Blackboard embed routes. Their slugs are baked into an iframe `src` in
  // every section of the LMS, so a renamed route is an edit in every shell;
  // these entries fail the build instead. Each required string is something a
  // regression would actually take away: the ported sentence that carries the
  // section's claim, a digit the page states and `tests/week4.test.ts`
  // computes, the accessible name of the explorer's graph, and the
  // build-time math markup that proves no browser typesetting is involved.
  {
    route: '/embed/section-1-7/',
    file: 'embed/section-1-7/index.html',
    required: [
      'Limits, Continuity, and Differentiability (Section 1.7)',
      'Continuity, in three separate conditions',
      'A corner is\ncontinuous and not differentiable.',
      'Differentiable is stronger than continuous',
      'Read both slopes at once',
      'The graph of g of x equals the absolute value of x minus 2',
      'Slope from the left',
      'Slope from the right',
      'aria-live="polite"',
      'Predict, then check',
      'https://www.youtube.com/watch?v=cSXE_QpiWrY',
      '<mjx-container',
      '<mjx-assistive-mml',
    ],
  },
  {
    route: '/embed/ivt-openstax/',
    file: 'embed/ivt-openstax/index.html',
    required: [
      'Continuity and the Intermediate Value Theorem',
      'One-sided limits, and the notation for them',
      'Using it, and the three things it does not say',
      'the theorem is silent',
      // f(1) = 2 and f(2) = 10 for x³ + x, the bracket the page argues from.
      '<mn>10</mn>',
      'https://openstax.org/books/calculus-volume-1/pages/2-4-continuity',
      '<mjx-container',
      '<mjx-assistive-mml',
    ],
  },
  {
    route: '/embed/section-1-8/',
    file: 'embed/section-1-8/index.html',
    required: [
      'The Tangent Line Approximation (Section 1.8)',
      'Worked example: estimating ln(1.1)',
      'Concave down over-estimates; concave up under-estimates.',
      // ln(1.1), the estimate's error, and the error a whole unit away.
      '<mn>0.0953</mn>',
      '<mn>0.0047</mn>',
      '<mn>0.307</mn>',
      'https://www.desmos.com/calculator/bftunmngmt?embed',
      'https://www.desmos.com/calculator/3b8a97c288?embed',
      'Open this graph in Desmos',
      'https://www.youtube.com/watch?v=X0qVfMokn84',
      '<mjx-container',
      '<mjx-assistive-mml',
    ],
  },
  // The Blackboard-native presentation: same MDX as /embed/, designed to sit
  // inside a 720px frame in a Document. No masthead and no h1 by design, so the
  // markers below are the light scope and the content itself.
  {
    route: '/bb/section-1-7/',
    file: 'bb/section-1-7/index.html',
    required: [
      'bb-shell',
      'Continuity, in three separate conditions',
      'Differentiable is stronger than continuous',
      'A corner is\ncontinuous and not differentiable.',
      '/widget/corner-slopes/',
      'Open the slopes-at-a-corner graph on its own',
      '<mjx-container',
      '<mjx-assistive-mml',
    ],
  },
  {
    route: '/bb/ivt-openstax/',
    file: 'bb/ivt-openstax/index.html',
    required: [
      'bb-shell',
      'One-sided limits, and the notation for them',
      'Using it, and the three things it does not say',
      'the theorem is silent',
      '<mn>10</mn>',
      '<mjx-container',
      '<mjx-assistive-mml',
    ],
  },
  {
    route: '/bb/section-1-8/',
    file: 'bb/section-1-8/index.html',
    required: [
      'bb-shell',
      'Worked example: estimating ln(1.1)',
      'Concave down over-estimates; concave up under-estimates.',
      'https://www.desmos.com/calculator/bftunmngmt?embed',
      'https://www.desmos.com/calculator/3b8a97c288?embed',
      '<mn>0.0953</mn>',
      '<mjx-container',
      '<mjx-assistive-mml',
    ],
  },
  // The widget route. Its whole job is to be framed at a fixed pixel height
  // that does not scroll, so what a regression would take away is the controls
  // and the readouts, not the prose: there is no prose.
  {
    route: '/widget/corner-slopes/',
    file: 'widget/corner-slopes/index.html',
    required: [
      'Slopes at a corner',
      'The graph of g of x equals the absolute value of x minus 2',
      'Slope from the left',
      'Slope from the right',
      'Gap on each side',
      'aria-live="polite"',
      'embed-lab--compact',
    ],
  },
];

await Promise.all([access(mainMathFont), access(socialImage)]);

const pages = await Promise.all(
  routeChecks.map(async (check) => {
    const fileUrl = new URL(check.file, outputDirectory);
    await access(fileUrl);
    return { ...check, html: await readFile(fileUrl, 'utf8') };
  }),
);

for (const { route, required, html } of pages) {
  if (!html.includes(expectedBasePath)) {
    throw new Error(
      `${route} is missing the GitHub Pages base path ${expectedBasePath}`,
    );
  }

  for (const marker of required) {
    if (!html.includes(marker)) {
      throw new Error(`${route} is missing required markup: ${marker}`);
    }
  }

  for (const { pattern, description } of [
    {
      pattern:
        /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+) students?\b/i,
      description: 'a public class-member count',
    },
    {
      pattern:
        /asked by (?:one|two|three|four|five|six|seven|eight|nine|ten|\d+) of you/i,
      description: 'counted question provenance',
    },
  ]) {
    if (pattern.test(html)) {
      throw new Error(`${route} contains ${description}`);
    }
  }
}

// Embed-route policy, checked over the exported artifact because the artifact
// is what a student loads. This is a narrow subset of the rules in
// `docs/blackboard-embeds.md`, kept here because each one has a live failure
// behind it; the full checker over `dist/client/embed/*/index.html` is a
// separate piece of work and should absorb these.
const videoReviews = JSON.parse(
  await readFile(
    new URL('../docs/video-reviews.json', import.meta.url),
    'utf8',
  ),
);

for (const { route, file, html } of pages.filter(
  ({ route: path }) => path.startsWith('/embed/') || path.startsWith('/bb/'),
)) {
  const slug = file.split('/')[1];

  // A video may not be embedded until someone has confirmed an English caption
  // track that is not labelled auto-generated, recorded per id in
  // docs/video-reviews.json. Neither Week 4 video has one, so both are links.
  for (const [, videoId] of html.matchAll(
    /youtube-nocookie\.com\/embed\/([\w-]+)/g,
  )) {
    const review = videoReviews.retained_embeds?.[videoId];
    if (!review || review.asset !== slug) {
      throw new Error(
        `${route} embeds the YouTube video ${videoId} with no matching caption review for this page in docs/video-reviews.json. Confirm an English caption track that is not labelled auto-generated, record it under retained_embeds, or offer the video as a plain link.`,
      );
    }
  }

  if (/(?:www\.)?youtube\.com\/embed/.test(html)) {
    throw new Error(
      `${route} uses a youtube.com player. Embeds must use youtube-nocookie.com.`,
    );
  }

  for (const [tag] of html.matchAll(/<iframe\b[^>]*>/g)) {
    if (!/\stitle="[^"]*[^\s"][^"]*"/.test(tag)) {
      throw new Error(
        `${route} has an iframe with no descriptive title: ${tag.slice(0, 120)}`,
      );
    }
  }

  // Inside a 720px Blackboard panel a link without target="_top" opens in the
  // panel, and the student reads the destination through a letterbox.
  for (const [tag] of html.matchAll(/<a\b[^>]*\shref="[^"#][^"]*"[^>]*>/g)) {
    if (!tag.includes('target="_top"')) {
      throw new Error(
        `${route} has a link that would open inside the Blackboard panel; it needs target="_top": ${tag.slice(0, 120)}`,
      );
    }
  }

  // No hero heading: the first block of real prose has to begin within 288px
  // of the top at 1100px width, and the public site's display heading spends
  // that whole budget on its own. Measuring the offset needs a browser; this
  // catches the one construction known to blow it.
  if (/clamp\(3\.4rem/.test(html)) {
    throw new Error(`${route} carries the public site's hero heading size.`);
  }
}

for (const { route, html } of pages.filter(({ route: path }) =>
  path.startsWith('/bb/'),
)) {
  // The whole point of this presentation is that a student cannot tell where
  // Blackboard ends and the frame begins. A masthead, a footer or a repeated
  // title is the tell, and the title is already on the Document.
  //
  // Tested against VISIBLE markup: <body>, with inline scripts removed. Both
  // exclusions are load-bearing and each one failed first.
  //
  // The course label legitimately appears in <head> — the root layout sets an
  // OpenGraph title and a title template, and a page is entitled to a name in
  // the tab. Scoping to <body> is not enough on its own either, because the RSC
  // flight payload is an inline script inside <body> and it serialises that
  // same metadata, so the string is in the body twice while no chrome is
  // rendered at all. docs/blackboard-embeds.md records the identical trap for
  // the "no http(s) URL in a script body" rule. Match the thing where a student
  // could actually see it.
  const visible = html
    .slice(html.indexOf('<body'))
    .replace(/<script\b[\s\S]*?<\/script>/g, ' ');

  for (const [marker, description] of [
    ['embed-masthead', 'the embed masthead'],
    ['Course notebook', 'the course-notebook link'],
    ['MATH A251 · Calculus I', 'the course label'],
    ['<h1', 'an h1; the Blackboard Document title already carries it'],
    ['SiteHeader', 'the site header'],
  ]) {
    if (visible.includes(marker)) {
      throw new Error(
        `${route} carries ${description}; /bb/ is the page designed for a frame`,
      );
    }
  }
}

for (const { route, html } of pages.filter(({ route: path }) =>
  path.startsWith('/widget/'),
)) {
  // A widget frame is sized to fit and never scrolls, so anything that is not
  // the interaction is height the interaction does not get.
  for (const [marker, description] of [
    ['embed-masthead', 'the embed masthead'],
    ['embed-nav', 'navigation'],
    ['SiteHeader', 'the site header'],
  ]) {
    if (html.includes(marker)) {
      throw new Error(
        `${route} carries ${description}; a widget is the interaction alone`,
      );
    }
  }
}

const allHtml = pages.map(({ html }) => html).join('\n');

for (const requiredMathMarkup of [
  '<math xmlns="http://www.w3.org/1998/Math/MathML"',
  `${expectedBasePath}mathjax/fonts`,
]) {
  if (!allHtml.includes(requiredMathMarkup)) {
    throw new Error(
      `Static export is missing required math markup: ${requiredMathMarkup}`,
    );
  }
}

if (/mathjax[^"']*(?:\.js|cdn)/i.test(allHtml)) {
  throw new Error('Static export appears to load MathJax in the browser');
}

const localAssetPaths = new Set(
  [...allHtml.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((assetPath) => assetPath.startsWith(expectedBasePath))
    .map((assetPath) => assetPath.slice(expectedBasePath.length)),
);

await Promise.all(
  [...localAssetPaths].map(async (assetPath) => {
    try {
      await access(new URL(assetPath, outputDirectory));
    } catch {
      throw new Error(
        `Static export references a missing GitHub Pages asset: ${assetPath}`,
      );
    }
  }),
);

await writeFile(noJekyllFile, '');
console.log(
  `Verified ${pages.length} routes, ${localAssetPaths.size} local paths, and build-time accessible MathJax.`,
);
