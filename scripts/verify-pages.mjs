import { access, readFile, writeFile } from 'node:fs/promises';

const outputDirectory = new URL('../dist/client/', import.meta.url);
const indexFile = new URL('index.html', outputDirectory);
const noJekyllFile = new URL('.nojekyll', outputDirectory);
const mainMathFont = new URL(
  'mathjax/fonts/MathJax_Main-Regular.woff',
  outputDirectory,
);
const socialImage = new URL('og.png', outputDirectory);
const expectedBasePath = '/math251-fall2026-site/';

await Promise.all([
  access(indexFile),
  access(mainMathFont),
  access(socialImage),
]);

const html = await readFile(indexFile, 'utf8');

if (!html.includes(expectedBasePath)) {
  throw new Error(
    `Static export is missing the GitHub Pages base path ${expectedBasePath}`,
  );
}

for (const requiredMathMarkup of [
  '<mjx-container',
  '<mjx-assistive-mml',
  '<math xmlns="http://www.w3.org/1998/Math/MathML"',
  'href="#explore"',
  `${expectedBasePath}mathjax/fonts`,
]) {
  if (!html.includes(requiredMathMarkup)) {
    throw new Error(
      `Static export is missing required math markup: ${requiredMathMarkup}`,
    );
  }
}

await writeFile(noJekyllFile, '');
console.log('GitHub Pages export and build-time MathJax verified.');
