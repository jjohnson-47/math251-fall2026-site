import { access, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const basePath = '/math251-fall2026-site';
const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const clientDirectory = join(projectDirectory, 'dist/client');
const nestedAssetDirectory = join(clientDirectory, basePath.slice(1), '_next');
const publicAssetDirectory = join(clientDirectory, '_next');
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

// GitHub Pages mounts the artifact root at `basePath`. Vinext currently emits
// its base-path client assets under that prefix inside the artifact too, which
// would double the path in production. Mirror them to the artifact root.
await access(nestedAssetDirectory);
await cp(nestedAssetDirectory, publicAssetDirectory, {
  recursive: true,
  force: true,
});

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
  let requestUrl = new URL(requestPath, 'http://localhost');
  let response;

  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    response = await worker.fetch(
      new Request(requestUrl),
      {},
      executionContext,
    );

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      break;
    }

    const location = response.headers.get('location');
    if (!location) {
      break;
    }

    const nextUrl = new URL(location, requestUrl);
    if (
      nextUrl.origin !== 'http://localhost' ||
      !nextUrl.pathname.startsWith(basePath)
    ) {
      throw new Error(`Unsafe static render redirect: ${nextUrl}`);
    }

    requestUrl = nextUrl;
  }

  if (!response?.ok) {
    throw new Error(
      `Static render failed for ${requestPath}: ${response?.status} ${response?.statusText}`,
    );
  }

  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, await response.text());
  renderedCount += 1;
}

await Promise.all(waitUntilPromises);
console.log(`Completed ${renderedCount} missing GitHub Pages route(s).`);
