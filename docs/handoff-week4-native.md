# Handoff C — the reading is not framed

Work in `/Users/verlyn13/Repos/jjohnson-47/fall2026/math251`.

Read `docs/blackboard-embeds.md`, section **"REVERSED 2026-09-12: the reading is
not framed"**, before anything else. It explains the reversal you are
implementing and why the previous shape was rejected.

## What went wrong

The three Week 4 routes you built are correct as pages. Putting them behind a
720px Blackboard panel was wrong, and the instructor rejected it on sight:

> "it needs to render and be simple for students, and they shouldn't **have to**
> go to an external page for the primary content of the document."

Two separate faults, and the second is the one that matters.

1. Nothing was deployed, so the frame rendered Next's "This page could not be
   found". That is just the missing deploy.
2. Even deployed, framing is wrong here. stat253's panel frames a **supplement**.
   These pages are the week's **assigned reading**. A 3122px reading page in a
   720px frame gives a student a porthole, a nested scrollbar inside an
   already-scrolling Blackboard page, a blank rectangle when the network hiccups,
   and nothing at all if a deploy is a minute behind.

**The rule now: prose is native Blackboard content; only an interaction is
framed.**

## What to build

### 1. A fragment exporter

A build step that emits, per section, one HTML fragment that pastes directly into
a Blackboard Ultra Document and renders as native page content.

Output to `../blackboard_content/math_a251_week4/` as
`<slug>__BB.html`, alongside the hand-built pages already there — read those
first, they are the proven shape for this course's shells.

Hard requirements for the fragment:

- **Inline styles only.** No `<style>` block, no external stylesheet, no class
  names that depend on one. The existing pasted pages in that directory are
  entirely inline-styled and they work; that is the evidence.
- **No `<script>`, ever.** Blackboard strips it by standing security choice.
- **No viewport units.** Blackboard sizes an HTML block to its content, and
  content sized to the viewport feeds that measurement back and grows without
  converging.
- **No root-relative URLs.** Every link absolute or nothing.
- **Math renders without CSS or script.** MathJax CHTML depends on a stylesheet
  you cannot link from a fragment, so CHTML is not an option here. Emit
  **MathML** — `rehype-mathjax` can output it, and `../build/math_render.py`
  shows the shape this course settled on (2026-09-04, "best by far"), including
  the plain-language `alt` text for each expression. Keep that alt text in the
  markup so a stripped `<math>` still leaves something readable.
  **Test this before you do all three:** MathML has not yet been pasted into a
  live shell in this course. Emit one short fragment with two expressions in it,
  hand it to Jeffrey to paste into a throwaway Document, and confirm it survives
  the editor's sanitizer. If it does not, fall back to `rehype-mathjax`'s SVG
  output, which is self-contained inline SVG — each one needs a `<title>`.
- **Third-party iframes stay inline, at fixed pixel heights, each with a real
  `title`.** The two Desmos graphs on 1.8 belong in the fragment where they are
  now. That is fine: an iframe is not a script.
- **Both videos are plain links**, per the caption finding. Keep the duration and
  the "read this instead of watching" line next to each.
- Keep the wording of the ported content. The only deletions already agreed are
  the weekday line and the three Applied Assignment 1 pointers.

### 2. Widgets, and only widgets, get a frame

Split the corner-slope explorer out of `app/embed/section-1-7/` into its own
minimal route, e.g. `app/widget/corner-slopes/`, with no masthead, no nav, no
prose beyond its own labels — just the interaction and its readout.

- **It must FIT.** Nothing scrolls inside a widget frame. Measure it at 1100px
  and at 390px; the frame height is the measured height plus 40. If it cannot be
  made to fit in roughly 600px at 390px wide, cut it down until it does. A widget
  that scrolls is a failed widget.
- Its Blackboard block is the panel-plus-link shape from
  `../build/math_assets.py`: a one-line blurb, a navy bar carrying a full-screen
  link, then the fitted iframe. That file's `panel()` is now scoped to
  supplements only — this is what it is for.
- The widget block gets inserted into the 1.7 fragment at the point in the prose
  where the corner is discussed, not bolted on at the end.

### 3. The full-screen routes stay

`app/embed/section-1-7/`, `/section-1-8/`, `/ivt-openstax/` keep working as
standalone pages and each fragment ends with a plain link to its own — offered as
a convenience for a student who wants the page on its own, never as the way to
reach the content. Every word of the reading is already in the Document.

## Order

The Documents go into the module as **1.7, then the IVT supplement, then 1.8**.
The overview page students already have tells them to do the supplement right
after 1.7.

## Do not

- Do not put assigned reading behind an iframe.
- Do not nest a scroll region inside the Blackboard page.
- Do not make the prose depend on the network, on a deploy, or on JavaScript.
- Do not add a `<style>` block or a class-based stylesheet to a fragment.
- Do not deploy, push, or edit Blackboard. Produce the fragments and the widget
  route; Jeffrey pastes.

## Evidence

- Report the rendered height of each fragment's third-party iframes and of the
  widget, measured, at 1100px and 390px.
- Report whether the MathML paste test was actually run and what it showed. If it
  was not run, say so; do not assume it works.
- Open each fragment in a browser as a bare file and confirm it renders with no
  stylesheet and no script. That is the condition it will be under in Blackboard.
- State what you did not do, as before.
