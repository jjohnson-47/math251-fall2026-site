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
