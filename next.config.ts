import type { NextConfig } from 'next';

const githubPagesBasePath = '/math251-fall2026-site';

const nextConfig: NextConfig =
  process.env.GITHUB_PAGES === 'true'
    ? {
        output: 'export',
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesBasePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {};

export default nextConfig;
