# Architecture

The site begins as a small course notebook with one experiment and one explainer, but its boundaries support independent labs, content collections, practice sets, and API-backed tools without a rewrite.

## Runtime shape

```text
app/                    Routes, metadata, server handlers
  api/                  Worker-only JSON/API boundaries
components/             Student-facing interactions
  ui/                   Installed accessible primitives
lib/                    Tested math and integration logic
content/                Instructor-owned source material
public/                 Downloadable and social assets
tests/                  Deterministic domain checks
```

The public deployment is a Vinext static export on GitHub Pages. The normal Vinext build also produces a Cloudflare Worker-compatible server bundle, so future tools can add route handlers, server-side data fetching, and external APIs without changing the front-end framework.

## Current routes

- `/`: notebook front, ball-and-gates experiment, first abstraction, question ledger, and request entry point.
- `/play`: a shareable full-size copy of the experiment and its guided A/B/C sequence.
- `/explainers`: a deliberately small, manually maintained question index.
- `/explainers/what-is-calculus`: the first long-form MDX explainer with stable, hand-authored anchors and a numeric limit table.

`components/site-header.tsx` and `components/site-footer.tsx` carry the common shell. `components/ball-gate-lab.tsx` and `components/limit-table.tsx` own local interaction state; their mathematics stays in `lib/calculus.ts`. `lib/site.ts` centralizes deploy-path-aware internal URLs and verified external reading links.

Course narrative can be authored in MDX. `remark-math` identifies TeX and `rehype-mathjax` renders CHTML during the build; the build also enables MathJax's assistive MathML handler. MathJax fonts are copied into `public/mathjax/fonts` before development or production builds, so the student page does not load a runtime typesetter or depend on a font CDN.

The Pages build keeps the framework's route-aware `basePath`. Vinext 1.0.0-beta.8 currently skips a base-path home route during its export pass and nests client assets one prefix too deep for a Pages artifact. `scripts/export-pages.mjs` renders only missing discovered routes through the completed worker bundle and mirrors those client assets to the artifact root. Remove that bridge once the upstream export handles both paths directly; `scripts/verify-pages.mjs` checks every local asset referenced by the generated HTML so a partially working publication cannot pass CI.

## Growth rules

1. Add one coherent student task at a time.
2. Put reusable mathematics or data transformations in `lib/` with deterministic tests.
3. Keep the route responsible for narrative and sequencing; keep the interaction responsible for local state.
4. Add a new route when the activity has its own learning objective or shareable URL, not merely to shorten a file.
5. If a tool needs persistence, identity, or a remote API, document its data boundary and privacy behavior before implementation.
6. Keep the GitHub Pages version useful even when a server capability is unavailable.

## Likely next slices

- `/labs`: an index once there are at least two complete interactions.
- `/practice`: short, feedback-rich practice sets with no student data stored by default.
- `/concepts/[slug]`: focused visual explanations when content volume justifies routes.
- `app/api/*`: narrowly scoped, cacheable integrations for public data or generated practice.

These are extension points, not committed features. Build them only when the course needs them.
