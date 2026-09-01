import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const sourceDirectory = fileURLToPath(
  new URL(
    '../node_modules/mathjax-full/es5/output/chtml/fonts/woff-v2/',
    import.meta.url,
  ),
);
const destinationDirectory = fileURLToPath(
  new URL('../public/mathjax/fonts/', import.meta.url),
);

await mkdir(destinationDirectory, { recursive: true });

const fontFiles = (await readdir(sourceDirectory)).filter((fileName) =>
  fileName.endsWith('.woff'),
);

await Promise.all(
  fontFiles.map((fileName) =>
    copyFile(
      new URL(fileName, `file://${sourceDirectory}/`),
      new URL(fileName, `file://${destinationDirectory}/`),
    ),
  ),
);

console.log(`Prepared ${fontFiles.length} local MathJax fonts.`);
