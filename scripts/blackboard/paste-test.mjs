/**
 * The one thing a browser cannot settle: does Blackboard's editor KEEP this?
 *
 * Every Week 4 fragment rests on four constructs that have never been pasted
 * into a live shell in this course. A browser render proves they work in a
 * browser; it says nothing about what the Ultra Document editor's sanitizer
 * does to them on save. So: one short fragment carrying exactly those four,
 * each labelled, pasted into a throwaway Document, saved, reopened.
 *
 *   1. MathML, display and inline. If it is stripped, `RENDER = 'svg'` in
 *      math.mjs re-emits every expression as self-contained inline SVG.
 *   2. `<details>`/`<summary>`. If it is stripped, `REVEAL = 'visible'` in
 *      components.mjs renders every question above its own answer instead.
 *   3. An inline-styled `<iframe>` at a fixed pixel height.
 *   4. The `role="math"` + `aria-label` wrapper that carries the plain-language
 *      sentence, which is what a student is left with if 1 fails silently.
 *
 * Run: node scripts/blackboard/paste-test.mjs
 */
import { writeFile } from 'node:fs/promises';

import { ASSET_BASE, WIDGET_FRAME_PX, parseStyle } from './components.mjs';
import { RENDER, mathParts } from './math.mjs';

const target = new URL(
  '../../../blackboard_content/math_a251_week4/MATH_A251_PASTE_TEST__BB.html',
  import.meta.url,
);

const attrs = (style) =>
  Object.entries(parseStyle(style))
    .map(
      ([property, value]) =>
        `${property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value}`,
    )
    .join(';');

function expression(tex, display) {
  const { markup, alt, style, tag } = mathParts(tex, display);
  return `<${tag} style="${attrs(style)}" role="math" aria-label="${alt}">${markup}</${tag}>`;
}

const CHECK = (n, what, expected) =>
  `<p style="margin:18px 0 4px"><b>Check ${n}: ${what}</b><br>` +
  `<span style="color:#555;font-size:0.95rem">${expected}</span></p>`;

const body = [
  '<div style="background:linear-gradient(135deg,#005a9c 0%,#0066CC 50%,#FF6600 100%);padding:3px;border-radius:10px;"><div style="background-color:#ffffff;padding:25px;border-radius:8px;">',
  '<h2 style="color:#005a9c;margin-top:0">Paste test — delete this Document afterwards</h2>',
  '<p>Nothing here is for students. Paste this into a throwaway Document, <b>save it</b>, ' +
    'then close and reopen it. Each check below says what it should look like. Anything that ' +
    'does not match is a thing the editor stripped, and there is a one-line switch for it.</p>',

  CHECK(
    1,
    'a display formula',
    'A centred formula in a pale blue box, reading L of x equals f of a plus f prime of a, ' +
      'times the quantity x minus a. Not a line of code, and not blank.',
  ),
  expression("L(x) = f(a) + f'(a)(x - a)", true),

  CHECK(
    2,
    'an inline formula inside a sentence',
    'The expression sits on the text line at the size of the words around it.',
  ),
  `<p>A corner: ${expression('g(x) = |x - 2|', false)} has no derivative at ${expression('x = 2', false)}, because the one-sided slopes are ${expression('-1', false)} and ${expression('+1', false)}.</p>`,

  CHECK(
    3,
    'a fraction and a limit, the two shapes plain text cannot do',
    'A stacked fraction with a horizontal bar, and lim with its condition underneath or beside it.',
  ),
  expression('\\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}', true),

  CHECK(
    4,
    'a collapsed question',
    'A closed grey bar with a triangle. Clicking it opens the answer. If the answer is ' +
      'already showing, or the bar is gone and only loose text is left, details did not survive.',
  ),
  '<details style="margin:12px 0;border:1px solid #cfd8e3;border-radius:6px;background:#ffffff">' +
    '<summary style="padding:10px 14px;cursor:pointer;font-weight:700;color:#1f3864">Does this question start out closed?</summary>' +
    '<div style="padding:2px 14px 8px;border-top:1px solid #e6ebf2"><p>If you had to click to see this sentence, ' +
    'details survived the editor and the predict-reveals on the Week 4 pages will work.</p></div></details>',

  CHECK(
    5,
    'an inline iframe at a fixed pixel height',
    'A graph, about the height of a postcard, with a navy bar above it. An empty white box ' +
      'means the frame survived but the page behind it is not deployed yet, which is a different problem.',
  ),
  '<div style="border:1px solid #cfd8e3;border-radius:8px;overflow:hidden;margin:18px 0">' +
    '<div style="background:#1f3864;padding:9px 13px">' +
    `<a href="https://www.desmos.com/calculator/bftunmngmt" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;font-weight:700">Open this graph in Desmos</a></div>` +
    '<iframe src="https://www.desmos.com/calculator/bftunmngmt?embed" title="Desmos graph: the natural logarithm with its tangent line at x equals 1" width="100%" height="420" style="border:0;display:block"></iframe></div>',

  CHECK(
    6,
    'the frame the Week 4 widget will use',
    `A ${WIDGET_FRAME_PX} pixel tall frame holding a movable graph. If the page behind it is not ` +
      'deployed this will be blank or say the page could not be found; that is expected today, ' +
      'and what is being tested here is only that the frame itself is not stripped.',
  ),
  '<div style="border:1px solid #cfd8e3;border-radius:8px;overflow:hidden;margin:18px 0">' +
    '<div style="background:#1f3864;padding:9px 13px">' +
    `<a href="${ASSET_BASE}/widget/corner-slopes/" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;font-weight:700">Open the slopes-at-a-corner graph in a new tab</a></div>` +
    `<iframe src="${ASSET_BASE}/widget/corner-slopes/" title="Slopes at a corner: move a point along g(x) = |x − 2|" width="100%" height="${WIDGET_FRAME_PX}" style="border:0;display:block" loading="lazy"></iframe></div>`,

  `<p style="color:#555;font-size:0.95rem;margin-bottom:0">Generated by scripts/blackboard/paste-test.mjs with RENDER = ${RENDER}. ` +
    'If check 1, 2 or 3 fails, set RENDER to "svg" in scripts/blackboard/math.mjs and re-run the exporter. ' +
    'If check 4 fails, set REVEAL to "visible" in scripts/blackboard/components.mjs. Either is one line and a rebuild.</p>',
  '</div></div>',
].join('\n');

await writeFile(target, `${body}\n`, 'utf8');
console.log(`wrote ${target.pathname.split('/').pop()} (RENDER = ${RENDER})`);
