# MATH A251 · Calculus I · Fall 2026

A student-facing, practice-first course companion for interactive calculus learning.

The live site is published at <https://jjohnson-47.github.io/math251-fall2026-site/>. The first learning surface is a derivative lab that lets students move a secant line toward a tangent line and compare their slopes.

This is a companion site. The course LMS remains the authority for announcements, deadlines, submissions, and grades.

## What is in the foundation

- A mobile-first React course home with a keyboard-accessible calculus interaction.
- MDX course content with build-time MathJax CHTML, semantic assistive MathML, local fonts, and linked equation regions.
- A typed math layer with tests, ready for more simulations and visualizations.
- Vinext and Vite for React Server Components, route handlers, and library integrations.
- Tailwind CSS and reusable shadcn interface primitives.
- Two build targets: a static GitHub Pages publication and a worker-capable build for future APIs.
- Formatting, linting, type checking, math tests, dependency updates, and automatic deployment.
- Agent instructions that protect course truth, student privacy, accessibility, and mathematical correctness.

## Local development

Use Node.js 24 and npm.

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run check       # format, lint, types, and math tests
npm run build       # worker-capable production build
npm run ci          # checks plus the GitHub Pages export
```

## Publishing model

Every push to `main` runs the verification suite and publishes `dist/client` to GitHub Pages. Pull requests run the same checks and static build without deploying.

The normal `npm run build` keeps the server runtime available for route handlers such as `app/api/health/route.ts`. The `npm run build:pages` target intentionally exports a static student site; server-only routes are not included in that artifact. This keeps the public course page fast and durable while preserving a clean path to API-backed learning tools on a worker host.

## Where new work belongs

- `app/`: pages, layouts, metadata, and server route handlers.
- `components/`: course interactions and shared interface composition.
- `components/ui/`: installed interface primitives; compose these before creating replacements.
- `lib/`: tested math, data, and integration logic with no presentation concerns.
- `content/`: source material and content-authoring notes.
- `public/`: downloadable student artifacts and share assets.
- `tests/`: deterministic checks for mathematical and content logic.

Read [AGENTS.md](AGENTS.md) before agentic work and [docs/architecture.md](docs/architecture.md) before adding a new route, API, or learning-tool family.
