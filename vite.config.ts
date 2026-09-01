import mdx from '@mdx-js/rollup';
import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import { AssistiveMmlHandler } from 'mathjax-full/js/a11y/assistive-mml.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import rehypeMathjax from 'rehype-mathjax/chtml';
import remarkMath from 'remark-math';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import hostingConfig from './.openai/hosting.json' with { type: 'json' };

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  '00000000-0000-4000-8000-000000000000';
const githubPagesBasePath = '/math251-fall2026-site';

const { d1, r2 } = hostingConfig;

// rehype-mathjax renders CHTML at build time. Its current server renderer does
// not register MathJax's assistive-MathML handler, so add it once before any
// MDX is compiled. The resulting document contains one visual tree and one
// visually hidden semantic MathML tree, with no client-side typesetting pass.
const handlerList = mathjax.handlers as typeof mathjax.handlers & {
  math251AssistiveMmlEnabled?: boolean;
};

if (!handlerList.math251AssistiveMmlEnabled) {
  const register = handlerList.register.bind(handlerList);
  handlerList.register = (handler) => register(AssistiveMmlHandler(handler));
  Object.defineProperty(handlerList, 'math251AssistiveMmlEnabled', {
    value: true,
  });
}

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

const localBindingConfig = {
  main: 'vinext/server/fetch-handler',
  compatibility_flags: ['nodejs_compat'],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: 'site-creator-d1',
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: 'site-creator-r2',
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');
  const publicBasePath =
    process.env.GITHUB_PAGES === 'true' ? githubPagesBasePath : '';
  const mdxPlugin = mdx({
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeMathjax,
        {
          tex: {
            packages: [
              'base',
              'ams',
              'boldsymbol',
              'html',
              'newcommand',
              'configmacros',
            ],
            tags: 'ams',
            useLabelIds: true,
            macros: {
              R: '\\mathbb{R}',
              bold: ['\\boldsymbol{#1}', 1],
            },
          },
          chtml: {
            adaptiveCSS: true,
            fontURL: `${publicBasePath}/mathjax/fonts`,
            matchFontHeight: false,
          },
        },
      ],
    ],
  });

  return {
    css: { postcss: { plugins: [tailwindcss()] } },
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      // MDX must run before Vinext's React transform.
      { enforce: 'pre', ...mdxPlugin },
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: localBindingConfig,
      }),
    ],
  };
});
