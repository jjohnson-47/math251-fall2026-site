import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const basePath = '/math251-fall2026-site';
const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const clientDirectory = join(projectDirectory, 'dist/client');
const pathManifest = JSON.parse(
  await readFile(
    join(projectDirectory, 'dist/server/vinext-prerender-paths.json'),
    'utf8',
  ),
);

const worker = (await import('../dist/server/index.js')).default;
const waitUntilPromises = [];
const executionContext = {
  passThroughOnException() {},
  waitUntil(promise) {
    waitUntilPromises.push(promise);
  },
};

let renderedCount = 0;

for (const routePath of pathManifest.paths) {
  if (
    typeof routePath !== 'string' ||
    !routePath.startsWith('/') ||
    routePath.includes('..')
  ) {
    throw new Error(`Unsafe static route path: ${String(routePath)}`);
  }

  const routeSegments = routePath.split('/').filter(Boolean);
  const outputFile =
    routeSegments.length === 0
      ? join(clientDirectory, 'index.html')
      : join(clientDirectory, ...routeSegments, 'index.html');

  try {
    await access(outputFile);
    continue;
  } catch {
    // Vinext 1.0.0-beta.8 skips base-path routes during its export pass. Render
    // only missing pages through the already-built worker as a bounded bridge.
  }

  const requestPath =
    routePath === '/' ? `${basePath}/` : `${basePath}${routePath}`;
  const response = await worker.fetch(
    new Request(`http://localhost${requestPath}`),
    {},
    executionContext,
  );

  if (!response.ok) {
    throw new Error(
      `Static render failed for ${requestPath}: ${response.status} ${response.statusText}`,
    );
  }

  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, await response.text());
  renderedCount += 1;
}

await Promise.all(waitUntilPromises);
console.log(`Completed ${renderedCount} missing GitHub Pages route(s).`);
