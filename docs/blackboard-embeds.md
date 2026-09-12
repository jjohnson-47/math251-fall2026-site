# Blackboard embeds

How a route in this repository becomes a reading panel inside a Blackboard Ultra
Document.

**This is a port, not a design.** The sibling course site `../stat253` solved
this problem over roughly a month, and most of what follows is already written,
tested and running there. Read it before you write anything here. Every
constraint below is the residue of something that broke in a live course shell,
and several of them are recorded as first attempts that were wrong.

Repository root for this work:

```
/Users/verlyn13/Repos/jjohnson-47/fall2026/math251
```

## Read these first

Absolute paths. Read them in this order; they are the accumulated wisdom and
they will save you from re-deriving it.

| File                                                                                                     | What it gives you                                                                                       |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/scripts/check_interactives.py`                       | The policy checker. Every rule, and the comments explaining which failure produced it.                  |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/scripts/measure_interactives.py`                     | The measurement harness. Read the docstring; it documents three wrong versions before the current one.  |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/scripts/validate.py`                                 | Artifact hygiene and link rules, run over the built output.                                             |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/tests/test_interactive_policy.py`                    | Mutation tests. The checker is fed deliberately broken markup to prove it still fails. Port this habit. |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/content/interactive/section-3-6-overview/index.html` | Reference page anatomy. Read it before authoring.                                                       |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/content/interactive/section-3-1-part-a/index.html`   | Second reference page.                                                                                  |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/docs/agent-workflow.md`                              | The authoring contract and the must-nots.                                                               |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/stat253/docs/verification.md`                                | What counts as evidence and what may not be claimed.                                                    |
| `/Users/verlyn13/Repos/jjohnson-47/fall2026/build/stat_assets.py`                                        | The Blackboard side: how a published slug becomes a paste block.                                        |

## Why routes instead of pasted HTML

Week 4's pages were hand-built as standalone HTML and pasted into Ultra
Documents as body markup. That works and it does not scale:

- A Blackboard Document runs **no JavaScript** by standing security choice in
  this course. Every "interactive" in a pasted page is a still picture of one.
- Nothing verifies a pasted page. No build, no test, no route check.
- A correction means re-pasting by hand, once per item, per section.

The iframe's child document is a real browser context: React, state, keyboard
handling, MathJax, canvas all work. The Blackboard side stays dumb — one link
and one frame, no script — which is exactly what the platform allows.

## Already solved here. Do not port these.

`../stat253` is plain static HTML built by Python. This is a Vinext/Next.js
repo, and four stat253 mechanisms already have a local equivalent:

| stat253                                                      | here                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `build.py` runtime allowlist, "never publish the checkout"   | `npm run build:pages` + `scripts/export-pages.mjs` emit `dist/client` only           |
| `validate.py` route existence checks                         | `routeChecks` in `scripts/verify-pages.mjs`                                          |
| MathML with an explicit `xmlns`, hand-written per expression | `remark-math` + `rehype-mathjax` render CHTML **and** assistive MathML at build time |
| Self-hosted fonts                                            | `next/font/google` downloads and self-hosts at build time                            |

Two cautions on that last row. `next/font` can emit a `preconnect` to
`fonts.gstatic.com` even though nothing loads from there at runtime. Before you
adopt stat253's banned-token regex wholesale, grep a **fresh** `dist/client` for
it and decide deliberately: either drop the preconnect (it is dead weight when
fonts are self-hosted) or allowlist it with a comment saying why. Do not weaken
the regex silently. And never add a `<link>` to `fonts.googleapis.com` or a
browser MathJax loader; both would be real violations.

## REVERSED 2026-09-12: the reading is not framed

The first version of this contract put each Week 4 section page behind a 720px
panel. **That was wrong and it was rejected on sight.** Jeffrey, looking at the
rendered Document:

> "it needs to render and be simple for students, and they shouldn't **have to**
> go to an external page for the primary content of the document."

The mistake was inheriting stat253's pattern without noticing what it frames.
Next door, the framed thing is a **supplement** — an explorer, a game, a section
overview that sits beside the LMS content. Here the framed thing was the week's
**assigned reading**. Put a 3122px reading page in a 720px frame and a student
gets a porthole, a nested scrollbar inside an already-scrolling Blackboard page,
a blank rectangle whenever the network hiccups, and no text at all if the deploy
is a minute behind. None of that is acceptable for primary content.

**The rule from here: prose is native Blackboard content; only an interaction is
framed.**

- The **words** students must read are pasted into the Document as inline-styled
  HTML. Full width, no nested scroll, no network dependency, no iframe.
- An **interaction** — something a student operates — is the only thing that gets
  a frame, and that frame is sized to fit so nothing scrolls inside it. A widget
  that scrolls is a failed widget; make it fit or cut it.
- The **full-screen route** still exists and is still linked, but as a
  convenience for someone who wants the page on its own, never as the way to
  reach the content.

This does not retire the panel. It scopes it: panel-plus-link is for a
supplement, not for the assignment.

### AMENDED 2026-09-12: the frame stays, and the page inside it is designed for it

The reversal above is right about the reading and wrong about one thing: it
treats "framed" and "site-styled page" as the same choice. They are not. What
was actually wrong with the framed Document was the page inside the frame, not
the frame.

Pasting the old block rendered a dark, site-chrome'd page floating inside
Blackboard's white shell, under a blurb repeating the page's own opening, over a
caption explaining how an iframe works, with the title showing three times:
Document title, masthead, page h1. It read as a foreign object dropped into the
CMS.

So `app/embed/` was split in two, and the same `content/week4/<slug>.mdx` now has
three presentations rather than three copies:

| Route                    | What it is                                                                                               | Who points at it             |
| ------------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `app/embed/<slug>/`      | Site-styled full screen. Masthead, h1.                                                                   | the bar's link, nothing else |
| `app/bb/<slug>/`         | Built for a 720px frame. Light, no masthead, no h1, full frame width, the pasted fragment's own palette. | the frame                    |
| the `__BB.html` fragment | Native Document content, inline styles only.                                                             | nothing; it IS the Document  |

Two mechanics make one source render three ways, and both are worth knowing
before touching this:

- **A component the MDX does not import resolves from `props.components`.** That
  is why `CornerSlopeLab` is not imported in `section-1-7.mdx`: the embed route
  passes the inline React explorer, the `/bb/` route passes a nested frame at the
  widget's measured height, and the fragment exporter passes a panel block. MDX
  throws `Expected component ... to be defined` when a name is missing, so a
  forgotten one fails loudly rather than rendering blank.
- **`components={{ h1: () => null }}` removes the h1 from the markup**, rather
  than hiding it with CSS. `display:none` would leave an h1 in the document for
  anything that reads structure; this leaves the first heading on the page as a
  card's h2, which is what the Document wants.

The light theme is pinned by redefining the custom properties on `.bb-shell`
rather than by fighting `prefers-color-scheme`: properties inherit from the
nearest defining ancestor, so nothing inside that scope can go dark whatever the
viewer's OS says. `body` needs its own rule because it is an ancestor of the
scope and paints its background from `:root`.

The paste block lost its prose. It is the navy bar carrying the full-screen link
and the 720px frame, and nothing else — 724 bytes for 1.7. The blurb duplicated
the page's opening paragraph and the caption was documentation about iframes;
neither belongs in front of a student. The bar stays: it is the escape hatch on
a phone, and it reads as a control rather than a note.

## The embed contract — the Blackboard side

Four constraints on the generated paste block. They govern the Document, not the
page in this repo.

1. **No script.** Not in the pasted block, ever.
2. **No viewport unit.** Blackboard sizes an HTML block to the height of its
   content. Content sized to the viewport feeds that measurement back into
   itself; a live item was reported as "fills the whole page and continues"
   under `85vh`. Pixels only. This ban does **not** apply inside the iframe: the
   frame has its own viewport, so `vh` in the child page cannot feed back.
3. **Fixed pixel frame height.** `720px` for a lesson page; a widget small
   enough to fit gets its measured height plus 40. No aspect-ratio box —
   `padding-bottom:75%` forces one shape of window whatever the screen.
4. **The link sits in a bar ABOVE the frame.** A link alone was rejected by the
   instructor ("students will not like this"); a frame alone was rejected twice
   for its height. Both, in that order, so a phone reader meets the way out
   before the scroll region.

The limit, stated so nobody goes looking for a better answer: **an iframe cannot
size itself to its content without JavaScript on both the parent and the child,
and the parent is a Blackboard Document.** A lesson page scrolls inside the
panel. The link is the way out of it, not a way around it.

**Never hand-type an embed URL into Blackboard.** `build/stat_assets.py` is the
working generator for STAT and the file a MATH equivalent must be written
against: it holds the base, asserts the slug is actually published, and emits
the block. Until `build/math_assets.py` exists a new route is a page, not an
embed. That file is out of scope for this repo's agent; do not create it here.

## The published base

```
https://jjohnson-47.github.io/math251-fall2026-site
```

Set in two places that must agree: `githubPagesBasePath` in `lib/site.ts` and
`basePath` in `scripts/export-pages.mjs`. Changing the base is a migration, not
an edit: every live Blackboard embed points at the old one and nothing looks
broken until someone redeploys. stat253 records exactly this happening — two
Pages sites serving simultaneously, with no way to tell which one students were
actually loading.

**Slugs are term-independent and permanent.** The semester lives in the
repository name, never in a slug. A slug is baked into an iframe `src` in every
section of the LMS, so renaming one is an LMS edit in every shell. Slug form is
`[a-z0-9]+(?:-[a-z0-9]+)*`; the families in use next door are
`section-<chapter>-<section>-<role>`, `week<N>-overview`, and plain kebab names
for labs.

## The page contract — the route side

### Shape

```text
app/embed/layout.tsx              no SiteHeader, no SiteFooter, compact masthead
app/embed/section-1-7/page.tsx
app/embed/section-1-8/page.tsx
app/embed/ivt-openstax/page.tsx
content/week4/section-1-7.mdx     the narrative
content/week4/section-1-8.mdx
content/week4/ivt-openstax.mdx
```

The root layout keeps `<html>`/`<body>` and the MathJax font preloads.
`app/embed/layout.tsx` owns everything else and must not render the site shell:
a header and footer inside a 720px panel spend the budget on chrome.

Published URL: `https://jjohnson-47.github.io/math251-fall2026-site/embed/section-1-7/`

- **Static export only.** These prerender into `dist/client`. No dependence on a
  route handler; the panel must render with the Worker cold.
- **The link target is the same URL.** A student clicking out of the panel lands
  on this page at full width, so it must read well full-screen too. One page,
  two widths — not an embed variant and a real variant.
- Any link that leaves the page needs `target="_top"`, or it opens inside the
  panel. stat253's scaffold bakes this in.

### Anatomy, ported from the reference pages

Follow this order. It is what `section-3-6-overview/index.html` does and what
the checker and the metrics harness both assume.

1. One `<h1>` carrying the full item title. **Headings start with a word**, never
   an emoji.
2. **A lead paragraph of real prose, immediately.** This is structural, not
   decorative: it is the block that must precede any video, and it is the
   element the metrics harness records as `first_prose`.
3. Content blocks, each led by an `<h2>`. Worked examples, definitions, callouts.
4. Optional video, **never first**, with its duration and caption status stated
   in prose before the player.
5. **Three predict-reveal questions** near the end, in a `<section>` with an
   `aria-labelledby` heading. Each `<summary>` is a question; each body explains
   the reasoning, not just the answer. Three is the house quantity.
6. **One write-first production task** last: a labelled `<textarea>`, ungraded,
   not submitted, works with JavaScript off, followed by a `<details>` whose
   summary is a self-check question about the student's own sentence and whose
   body opens with a hedged model answer ("One possible explanation:"), names
   common misreadings, and ends by telling them to revise.
7. Forward navigation.

Do not duplicate an asset's prompts in the Blackboard Document that frames it.

### The 288px budget

720px minus the page's own masthead is how much reading a student sees before
scrolling. Cap the masthead at 40 percent: **the first block of real prose must
begin within 288px of the top at 1100px width.**

Both ways to blow it have already been paid for once next door:

- **A tall hero.** `app/explainers/what-is-calculus/page.tsx` opens with
  `clamp(3.4rem,8vw,7rem)`. Right for the public site, wrong in a panel. Three
  stat253 pages with a 50px-padded header and a 3rem formula showcase put their
  first paragraph past the entire panel — 799px measured, fixed to 254px.
- **A video first.** Four of nine Week 3 assets opened with an optional video, so
  the panel's first screen was a video player. That was a template habit, not
  four accidents.

### Which height

- **Lesson page** — prose and worked examples, over 2500px tall. Takes the 720px
  panel and scrolls. **Every Week 4 item below is a lesson page.**
- **Widget** — a single interaction that fits. Needs a real measured height. Do
  not emit a widget frame until the harness below exists; use the panel.

**The threshold is not settled, and MATH is the first course to test it.**
stat253 splits at 2500px, but its 21 assets are all either small tools (267px,
881px) or long lesson pages — every other one is over 2500px. **Nothing has ever
landed between 881 and 2500, so that rule has never actually been exercised.**
`ivt-openstax` measures 1843px and is the first asset in that band. Read
literally, the rule calls it a widget and emits an 1883px Blackboard block,
which is an enormous amount of LMS page for a short reading. The classification
that holds up is **what the asset is, not how tall it is**: a tool gets a fitted
frame, a page to be read gets the 720px panel however short it is. Encode that
in `build/math_assets.py` rather than inheriting the bare pixel test.

## What must be ported

Three gaps. Build them in this order; each one makes the next trustworthy.

### 1. A policy checker over the built output

stat253 checks its source HTML because its source _is_ HTML. Here the source is
TSX and MDX, so **check `dist/client/embed/*/index.html` after `build:pages`** —
the artifact, which is what students load. Port these rules from
`check_interactives.py`, keeping the failure messages, which are written to
teach:

- Banned dependency tokens `fonts.googleapis.com|fonts.gstatic.com|cdn.jsdelivr.net|unpkg|polyfill`,
  matched against the raw source **including comments** — a comment naming a
  banned host fails, and next door the fix was to reword the comment, not to
  weaken the gate. Run it over built HTML and over any local `.js`/`.css` you
  ship.
- No external `<script src>`, no external `<link rel=stylesheet>`, and **no
  `http(s)://` URL inside any script body** except the SVG and MathML namespace
  URIs. That last one is the anti-dynamic-loader rule.
- YouTube embeds must use `youtube-nocookie.com`; plain `youtube.com/embed`
  fails.
- Every YouTube id must have a matching caption review recorded in a JSON file,
  keyed by id, with the asset slug it belongs to. Next door that is
  `docs/video-reviews.json`, and the rule is that a video may not be embedded
  until someone has confirmed **an English caption track not labelled
  auto-generated**. One stat253 video failed that check and became a plain link.
- `<img>` needs an `alt` key (empty is fine — that is correct for decorative).
- Every `<iframe>` needs a non-whitespace `title`.
- Every inline `<svg>` needs a non-empty `<title>`. One titled SVG does not
  launder an untitled sibling; there is a test named exactly that.
- No heading or `<title>` starts with an emoji, including emoji nested in spans
  and written as HTML entities. Parse with `convert_charrefs=True` or the entity
  form slips through.
- **A video may not sit in the opening block.**

That last rule is the one to port most carefully, because **the first version of
it was wrong**. Comparing source positions passes on pages that are broken: the
video card's own caption line ("15:10 — English captions available") is prose,
and it does precede the iframe, so a positional check called three broken pages
clean. The defect was never the ordering inside the card; it was that the card
was the first thing on the page. Work in **blocks**: find the content root as
the first depth inside `<body>` holding more than one element (this defeats a
single wrapper `<div>`), then require some earlier top-level block to contain
≥60 characters of prose. Pages with no `<body>` are fragments and are exempt.

**Mutation-test the checker.** Feed it deliberately broken markup and assert it
still fails. A checker nobody has tried to fool is not evidence.

### 2. A measurement harness

Port `measure_interactives.py`. It renders with Playwright and writes a JSON
manifest; `--verify` re-checks it with the standard library only, so the normal
`npm run check` never needs a browser. The details that matter, each of which
was a bug first:

- **Widths 1100 / 768 / 390** for height, plus a separate overflow pass at
  **350 and 390** (Blackboard's phone column). Zero horizontal overflow is the
  standard.
- **Height is the maximum bottom edge of every laid-out descendant of `<body>`**,
  skipping zero-height boxes and `offsetParent === null`. Not `scrollHeight`:
  pages carrying `min-height:100vh` make `scrollHeight` return
  `max(viewport, content)`, which is how one asset came to be recorded at 900px
  at all three widths — the harness, not the page.
- **Render at a 200px-tall viewport** on purpose, so a regression in the method
  shows up as an obviously wrong number rather than a plausible one.
- **Detect first prose by computed display and text length, never by tag name.**
  Three bugs here: a `<div>` opening sentence was walked past; enumerating block
  values treated a grid child as inline and credited its text to the wrapper, so
  every Chapter 4 page reported 15px; and `<noscript>` reports `display:inline`
  in the headless shell, so its 138 characters were credited to `<main>` and one
  page reported first prose at 0px. Anything not inline is block; skip headings
  (a heading is a label for reading, not reading) and anything inside a closed
  `<details>`; require ≥60 characters of the element's **own** text so a wrapper
  cannot qualify on behalf of the paragraph inside it.
- **Every entry is stamped with the SHA-256 of the page it describes**, and
  `--verify` fails when the page has changed since it was measured. The failure
  message next door is the model: "index.html has changed since it was measured,
  so every height and offset recorded for it describes a different version of
  the page." A recorded number that cannot be tied to a specific version of a
  page is a number nobody can trust — two hand-run measurements of one stat253
  page once disagreed by a thousand pixels with no way to adjudicate.
- stat253 hashes only `index.html`, so editing a sibling `script.js` does not
  invalidate the metrics. **That is a known gap. Close it here** by hashing every
  file the route emits.

One porting difference: stat253 measures over `file://` because its assets are
self-contained with relative paths. This site is exported under the
`/math251-fall2026-site/` prefix, so `file://` will break its asset paths. Serve
`dist/client` at that subpath and measure over HTTP. stat253's
`scripts/preview.py` does the same thing for the same reason, and its preview
deliberately mirrors the production subpath.

### 3. Route checks for the new pages

Add each embed route to `routeChecks` in `scripts/verify-pages.mjs` with
required strings that would actually change if the page regressed: a distinctive
sentence, `<mjx-container`, and `<mjx-assistive-mml` where the page carries math.

### Three rules that do not port literally

Found by the first build, 2026-09-12. Do not rediscover these.

- **"No `http(s)://` URL inside any script body" cannot be ported as written.**
  The RSC flight payload is an inline `<script>`, so every link href on every
  page appears inside one, including the routes that predate this work. Reframe
  the rule around _dynamic loading_ — a URL passed to `import()`, `fetch`, or an
  injected `<script src>` — or scope it to emitted `.js` assets. Do not delete
  it; it is the anti-CDN-smuggling rule.
- **"Every inline SVG needs a non-empty `<title>`" collides with icon sets.**
  Lucide icons carry `aria-hidden="true"`, which is the correct treatment for a
  decorative icon; adding a title it also hides satisfies the letter of the rule
  and makes the markup worse. The rule is: an inline SVG needs a non-empty
  `<title>` **or** `aria-hidden="true"`. stat253 never hit this because it has
  no icon library.
- **`npm run build:pages` is not byte-reproducible.** Three chunk names
  (`index-*`, `layout-segment-context-*`, `vinext-*`) change on every build and
  are embedded in every page, so a SHA-256 stamp taken over
  `dist/client/embed/*/index.html` goes stale on every rebuild and the freshness
  check cries wolf. Hash the route's **inputs** — its MDX, its `page.tsx`, and
  the components and `lib/` modules it imports — or normalise the chunk hashes
  before hashing the output. This is the one place the stat253 design does not
  transfer, and getting it wrong produces a check nobody trusts, which is worse
  than no check.

### Two more, from the native-fragment build

- **Sizing a frame over a fluid column takes a width sweep, not two samples.** The
  corner-slopes widget measured 604px at 390px and 503px at 1100px and was set to
  644px. At a **500px column it was 667px** and would have scrolled inside its own
  frame — invisible to anyone who checked a laptop and a phone. Sweep the whole
  width range, take the maximum, add 40. A widget that scrolls inside its frame is
  a failed widget.
- ~~**A class rule must see MathJax's own output.**~~ **WITHDRAWN 2026-09-12,
  and it is worth reading why.** The entry claimed the fragment validator
  reported zero class attributes on pages carrying ten, because MathJax's
  MathML emits `class="ORD"`, `class="OP"`, `class="NONE"`. It does not. Those
  strings are the tails of `data-mjx-texclass="ORD"` and friends — a data
  attribute, which needs no stylesheet and is not a class. The finding came from
  `grep -o 'class="[^"]*"'`, which happily matches the middle of an attribute
  name. Measured: `section-1-8__BB.html` has **0** matches for
  `/(?:^|\s)class\s*=/` and **10** for `data-mjx-texclass=`; the other fragments
  are 0 and 2, and 0 and 4. The validator's `/\sclass=/i` is correct and has no
  hole. Closing this "hole" would have meant allowlisting tokens that never
  appear, which is how a rule quietly stops catching the thing it is for. Same
  lesson as the date grep two sections down: match the shape of the thing, with
  its boundaries, not a substring of it.

## Evidence rules

Ported from `stat253/docs/verification.md`, and not optional.

- **Evidence is a number someone else can reproduce.** "Verified working" is not
  evidence. "First prose at 254px at 1100px width" is.
- **State the negative inventory.** What you did _not_ do is part of the report:
  no deployment performed, no Blackboard edit made, no browser check run.
- **A static policy check is not a screen-reader audit.** Say so, every time.
- **Do not claim a browser or LMS check you did not perform.** Do not treat a
  passing local build as a deployment, or a pushed commit as a completed one.
- **Fixing a real defect found while investigating a report does not close the
  report.** stat253 records exactly this: scoring defects were found and fixed
  while chasing a rendering symptom, and the document still says the original
  symptom "remains unconfirmed."
- **Correct the brief.** stat253's agent was told 17 pages were CDN-dependent;
  there were 16, and it said so. Numbers in an assignment are claims to verify.
- Never fabricate content, data, or a lockfile to make a build pass.

## Privacy and scope

This is a **public** repository.

- **No dates, deadlines, or assignment problems.** The LMS is authoritative for
  anything time-sensitive. The Week 4 _overview_ page is nothing but dates and
  what is due, so it stays a Blackboard paste and does not become a route.
  **The first version of this contract claimed the three section pages carried
  no dates. That was wrong** — a grep for date formats missed "What to be able
  to do by Friday." on 1.7 and 1.8, and all three pointed at Applied Assignment
  1 by problem number. The weekday and the three assignment pointers were
  dropped in the port. Grep for the _shape_ of a course fact, not for date
  formats: a weekday, an assignment name, a problem number, a point value, a
  platform name.
- No student names, messages, grades, identifiers, quotes, or analytics ids.
- Keep everything here ungraded. Anything graded is an LMS item, without
  exception.

## Week 4 work order

Source material is written and instructor-reviewed. **Port the content, do not
rewrite it.** Convert the markup to MDX and components; keep the wording.

Source directory:
`/Users/verlyn13/Repos/jjohnson-47/fall2026/blackboard_content/math_a251_week4/`

| Slug           | Source file                                                      | Carries                                                                                                                          |
| -------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `section-1-7`  | `MATH_A251_Section_1_7_Limits_Continuity_Differentiability.html` | Three conditions for continuity; continuous but not differentiable; YouTube `cSXE_QpiWrY`                                        |
| `section-1-8`  | `MATH_A251_Section_1_8_The_Tangent_Line_Approximation.html`      | Linearization; concavity decides over or under; YouTube `X0qVfMokn84`; Desmos `bftunmngmt` and `3b8a97c288`                      |
| `ivt-openstax` | `MATH_A251_Continuity_and_the_IVT_OpenStax.html`                 | One-sided limit notation and the Intermediate Value Theorem; required by the syllabus Week 4 row and absent from Active Calculus |

Reading source, verified by the instructor:

- Active Calculus 1.7: `https://activecalculus.org/single2e/sec-1-7-lim-cont-diff.html`
- Active Calculus 1.8: `https://activecalculus.org/single2e/sec-1-8-tan-line-approx.html`

Note the 1.7 URL. An earlier guess at `sec-1-7-limits-cont.html` was wrong. Do
not reconstruct an Active Calculus URL from a section title.

**Neither video can be embedded, as of 2026-09-12.** Both were checked against
their `ytInitialPlayerResponse`: `cSXE_QpiWrY` ("Math 251 - Activity 1.7.3 -
Limits and Continuity", 444s) and `X0qVfMokn84` ("Math 251 - Linear
Approximations", 485s) each carry exactly one caption track, English
auto-generated, `kind: "asr"`. Both are therefore plain links. Both sit on the
instructor's own channel, so corrected captions uploaded there would clear this
and the embeds could return.

### Where the interactivity should go

The pasted pages are static because they had no choice. As routes they do not.
Ranked by value:

1. **1.7 — the corner.** One graph, a movable point, and the secant slopes from
   the left and from the right both shown as numbers. The entire section is the
   claim that those two numbers disagree at a corner, and a student currently
   reads that sentence next to a still picture of it.
2. **1.8 — the linearization.** Drag the centre `a`, watch `L(x)` follow, and
   read the error `f(x) - L(x)` as a number that grows with distance. The two
   Desmos graphs approximate this; a local component can put the error on screen.
3. **1.7 — which condition failed.** Three functions, three different failures,
   and the student names the one that broke before revealing it. This is what
   quiz question WQ04N-001 asks, so the page and the assessment would finally be
   testing the same skill.

Keep the mathematics in `lib/` and tested. Never infer a value from a rendered
graph; next door, a poker evaluator inherited three real correctness bugs and
was fixed by exhaustive enumeration over all 2,598,960 hands.

## Definition of done

```bash
npm run check
npm run build
npm run build:pages
npm run verify:pages
```

Plus, per route:

1. A `routeChecks` entry in `scripts/verify-pages.mjs`.
2. A test in `tests/` for any numeric claim on the page.
3. The measured first-prose offset at 1100px, reported as a number. If you could
   not measure it, say so; do not claim it.
4. Confirmed readable at 390px with no horizontal overflow.
5. A caption review recorded for every YouTube id on the page.

If parallel agents are used, **one agent owns integration**. Others get disjoint
files and return diffs plus evidence; they do not publish, do not change Pages
configuration, and do not edit Blackboard.
