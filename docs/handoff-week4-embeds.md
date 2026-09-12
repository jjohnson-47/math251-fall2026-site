# Handoff messages — Week 4 embeds

Two briefs. A is the content work and owns integration. B is the verification
harness and can run in parallel on disjoint files; if both run, A commits.

Working directory for both:

```
/Users/verlyn13/Repos/jjohnson-47/fall2026/math251
```

---

## Handoff A — build the three Week 4 embed routes

Work in `/Users/verlyn13/Repos/jjohnson-47/fall2026/math251`.

Read these before writing anything, in this order:

1. `AGENTS.md` in that repo.
2. `docs/blackboard-embeds.md` in that repo. This is the build contract for the
   task and it is not optional context.
3. The sibling implementation it lists by absolute path, under
   `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253`. Actually open them.
   That system solved this exact problem over a month, and the comments in
   `scripts/check_interactives.py` and `scripts/measure_interactives.py` record
   which version of each rule was wrong and why. Read at least
   `content/interactive/section-3-6-overview/index.html` before you author a
   page; it is the reference anatomy.

**Task.** Build three statically exported routes under `app/embed/`, each
published to be read inside a 720px Blackboard panel and to stand on its own at
full width:

| Route                     | Slug           |
| ------------------------- | -------------- |
| `app/embed/section-1-7/`  | `section-1-7`  |
| `app/embed/section-1-8/`  | `section-1-8`  |
| `app/embed/ivt-openstax/` | `ivt-openstax` |

Content already exists, is instructor-reviewed, and is final. **Port it; do not
rewrite it.** Convert the markup to MDX plus components, keep the wording.
Source directory:

```
/Users/verlyn13/Repos/jjohnson-47/fall2026/blackboard_content/math_a251_week4/
  MATH_A251_Section_1_7_Limits_Continuity_Differentiability.html   -> section-1-7
  MATH_A251_Section_1_8_The_Tangent_Line_Approximation.html        -> section-1-8
  MATH_A251_Continuity_and_the_IVT_OpenStax.html                   -> ivt-openstax
```

Also add `app/embed/layout.tsx`: no `SiteHeader`, no `SiteFooter`, compact
masthead. A header and footer inside a 720px panel spend the reading budget on
chrome.

**Hard constraints.** Each has a live failure behind it; the contract says which.

- The first block of real prose must begin **within 288px of the top at 1100px
  width**. No hero heading in an embed route — `clamp(3.4rem,8vw,7rem)` is for
  the public site.
- **A video is never the opening block.** Put it after the material it
  re-explains. Its own caption line does not count as the page's prose.
- YouTube only via `youtube-nocookie.com/embed/<id>`. The two ids are
  `cSXE_QpiWrY` (1.7) and `X0qVfMokn84` (1.8). Neither has a caption review
  recorded yet — create `docs/video-reviews.json` on the model of stat253's,
  record what you can actually verify, and if you cannot confirm a non
  auto-generated English caption track, say so and leave the video as a plain
  link rather than an embed.
- No CDN, no web font link, no browser MathJax loader. Math is authored in MDX
  with `$...$` / `$$...$$` and rendered at build time.
- Every iframe gets a real `title`. Every inline `<svg>` gets a non-empty
  `<title>`. Every `<img>` gets an `alt` key. No heading starts with an emoji.
- Any link that leaves the page needs `target="_top"` or it opens inside the
  panel.
- Static export only. No dependence on a route handler.
- **No dates, no deadlines, no assignment problems.** This repository is public
  and the LMS is authoritative for anything time-sensitive. The three source
  pages carry no dates, which is why they can move; keep it that way.
- Slugs are permanent. They get baked into iframe `src` attributes in every LMS
  section.

**Then, if there is room.** The pages are static because a pasted Blackboard
document cannot run scripts. As routes they can. The highest-value interaction
is on 1.7: one graph, a movable point, and the secant slopes from the left and
from the right shown as two numbers that disagree at a corner. That is the whole
claim of the section and it is currently a still picture. Keep the mathematics
in `lib/` with tests; never infer a value from a rendered graph. Ungraded, no
persistence, no accounts.

**Definition of done.**

```bash
npm run check
npm run build
npm run build:pages
npm run verify:pages
```

Plus, per route: a `routeChecks` entry in `scripts/verify-pages.mjs` with
required strings that would actually change if the page regressed (a distinctive
sentence, `<mjx-container`, `<mjx-assistive-mml`); a test in `tests/` for any
numeric claim; the measured first-prose offset at 1100px reported as a number;
and confirmation it reads at 390px with no horizontal overflow.

**Reporting.** Evidence is a number someone else can reproduce — "verified
working" is not evidence. State the negative inventory too: what you did not do.
You are not deploying, not editing Blackboard, and not creating
`build/math_assets.py`. If you could not measure the first-prose offset because
the harness does not exist yet, say that rather than estimating it. If anything
in this brief turns out to be wrong, correct it in your report; the numbers here
are claims, not facts.

---

## Handoff B — port the verification harness

Work in `/Users/verlyn13/Repos/jjohnson-47/fall2026/math251`. Disjoint from
Handoff A: you touch `scripts/` and `tests/` and no route files.

Read `docs/blackboard-embeds.md` in that repo, section "What must be ported",
then read the two stat253 scripts it names in full — including the comments,
which are the actual specification:

```
/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/scripts/check_interactives.py
/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/scripts/measure_interactives.py
/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/tests/test_interactive_policy.py
```

**Task 1 — a policy checker over the built output.** stat253 checks source HTML
because its source is HTML. Here the source is TSX and MDX, so check
`dist/client/embed/*/index.html` after `npm run build:pages` — the artifact,
which is what students actually load. Port the rule set listed in the contract,
keeping the failure messages, which are written to teach rather than to label.

Port the video-leads-page rule carefully. **The first version of it was wrong**:
comparing source positions passes on pages that are broken, because the video
card's own caption line is prose and does precede the iframe. Work in blocks —
content root is the first depth inside `<body>` holding more than one element,
which defeats a single wrapper `<div>` — and require some earlier top-level
block to hold at least 60 characters of prose.

Before adopting the banned-token regex, grep a fresh `dist/client` for
`fonts.gstatic.com`: `next/font` self-hosts at build time but can still emit a
preconnect. Decide deliberately — drop the preconnect or allowlist it with a
comment — and do not weaken the regex silently.

**Mutation-test it.** Feed the checker deliberately broken markup and assert it
still fails. A checker nobody has tried to fool is not evidence.

**Task 2 — a measurement harness.** Port `measure_interactives.py`. Heights at
1100 / 768 / 390, overflow at 350 / 390, first-prose offset at 1100 only. Height
is the maximum bottom edge of every laid-out descendant of `<body>`, not
`scrollHeight` — `min-height:100vh` makes `scrollHeight` return the viewport and
that is how one asset came to be recorded at 900px at all three widths. Render
at a 200px-tall viewport on purpose. Detect first prose by computed display and
own-text length, never by tag name; skip headings, closed `<details>`, and
`UNRENDERED` elements including `<noscript>`. Stamp every entry with the SHA-256
of what it measured, and make `--verify` stdlib-only so `npm run check` never
needs a browser.

Two deliberate differences from stat253:

- stat253 hashes only `index.html`, so editing a sibling script does not
  invalidate its metrics. That is a known gap. **Close it here** — hash every
  file the route emits.
- stat253 measures over `file://`. This site exports under the
  `/math251-fall2026-site/` prefix, so `file://` breaks its asset paths. Serve
  `dist/client` at that subpath and measure over HTTP.

Wire both into `npm run check` in the same order stat253 uses: policy check,
then metrics freshness, then tests, then build.

**Reporting.** Same evidence rules as Handoff A. Report the measured numbers for
the three Week 4 routes if they exist by the time you run; if they do not, say
so. Do not deploy and do not edit any route file.
