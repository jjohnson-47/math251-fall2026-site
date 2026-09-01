const githubPagesBasePath = '/math251-fall2026-site';

export const activeCalculusSectionOneOne =
  'https://activecalculus.org/single2e/sec-1-1-vel.html';
export const activeCalculusSectionOneThree =
  'https://activecalculus.org/single2e/sec-1-3-derivative-pt.html';

export const explainerRequestHref =
  'mailto:?subject=MATH%20A251%20explainer%20request&body=I%27d%20like%20an%20explainer%20about%3A%0A%0AThe%20part%20I%27m%20stuck%20on%20is%3A%0A';

export function siteHref(path: string) {
  if (!path.startsWith('/')) {
    return path;
  }

  if (process.env.GITHUB_PAGES === 'true') {
    return `${githubPagesBasePath}${path}`;
  }

  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex);
  const normalizedPath =
    pathname === '/' ? pathname : pathname.replace(/\/$/, '');

  return `${normalizedPath}${suffix}`;
}
