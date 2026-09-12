/**
 * Mathematics for a Blackboard fragment: MathML, or self-contained inline SVG.
 *
 * WHY NOT THE SITE'S RENDERER
 * ---------------------------
 * The routes render MathJax CHTML, which is glyph boxes positioned by a
 * stylesheet. A fragment cannot carry a stylesheet, so CHTML pasted into a
 * Document would arrive as a pile of unpositioned characters. Neither output is
 * wrong; they answer different questions.
 *
 * WHICH ONE
 * ---------
 * `RENDER` is set from a live Blackboard paste test, never from a browser
 * render: a browser proves MathML works, it does not prove Blackboard's editor
 * keeps `<math>` through a save. `../build/math_render.py` carries the same
 * switch for the same reason, and records that Jeffrey picked MathML on
 * 2026-09-04 after seeing five candidates side by side. What has NOT been done
 * in this course is pasting MathML into a live shell and saving it. Until that
 * has happened, this value is an expectation and not a finding.
 *
 * The fallback is SVG rather than the CSS-stacked fractions math_render.py
 * falls back to, because rehype-mathjax's SVG output is already available here
 * and is self-contained: one `<svg>` with a `<title>`, no stylesheet.
 */
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax-full/js/input/tex/configmacros/ConfigMacrosConfiguration.js';

import { MATH_ALT } from './math-alt.mjs';

/** "mathml" or "svg". See the note above before changing this. */
export const RENDER = 'mathml';

/**
 * The serif stack from math_render.py, and the reason inline math here is
 * wrapped rather than left bare: `&Prime;` in Arial is a near-vertical tick
 * that reads as a quotation mark, and in Cambria Math it reads as a double
 * prime. The win is independent of RENDER.
 */
export const MATHFONT =
  "'Cambria Math','Latin Modern Math','STIX Two Math',Cambria,Georgia,'Times New Roman',serif";

// The tinted display box from math_render.py, so a formula looks the same on a
// Week 4 Document as it does on the Week 3 ones already in the shell.
const DISPLAY_BOX =
  'margin:0.7rem 0;padding:1rem;border-radius:5px;background:#eef3f8;' +
  'text-align:center;color:#1f3864;';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

// The same TeX package list the site build uses, minus the ones that need an
// output jax. `AllPackages` pulls in bussproofs, which throws without a
// getBBox(), so the list is explicit.
const input = new TeX({
  packages: ['base', 'ams', 'newcommand', 'configmacros'],
  macros: { R: '\\mathbb{R}' },
});
const mmlDocument = mathjax.document('', { InputJax: input });
const svgDocument = mathjax.document('', {
  InputJax: input,
  OutputJax: new SVG({ fontCache: 'local' }),
});
const visitor = new SerializedMmlVisitor();

export function normalizeTex(tex) {
  return tex.replace(/\s+/g, ' ').trim();
}

function altEntry(tex, display) {
  const key = normalizeTex(tex);
  return MATH_ALT[display ? `DISPLAY:${key}` : key] ?? MATH_ALT[key];
}

function toMathml(tex, display) {
  const node = mmlDocument.convert(tex, { display });
  return visitor.visitTree(node).replace(/\n\s*/g, '');
}

function toSvg(tex, display, alt) {
  const node = svgDocument.convert(tex, { display });
  const markup = adaptor.outerHTML(node);

  // MathJax wraps its SVG in `<mjx-container class="MathJax">`. The class needs
  // a stylesheet a fragment cannot carry, and for SVG output the container
  // carries nothing else the expression needs, so it comes off and the bare
  // `<svg>` is what gets pasted.
  const svg = markup.match(/<svg[\s\S]*<\/svg>/)?.[0];
  if (!svg) {
    throw new Error(`MathJax produced no SVG for ${JSON.stringify(tex)}`);
  }

  // Every inline SVG needs a nonempty title. MathJax emits one from its own
  // speech text only sometimes, so the alt sentence is inserted unconditionally
  // and any generated aria-label is dropped to avoid two competing names.
  return svg
    .replace(/ aria-label="[^"]*"/g, '')
    .replace(/<svg([^>]*)>/, `<svg$1><title>${escapeAttribute(alt)}</title>`);
}

export function escapeAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * One expression, wrapped so the sentence survives even if the markup does not.
 *
 * `role="math"` plus `aria-label` on the wrapper is harmless over MathML and
 * load-bearing over anything else, which is exactly the arrangement
 * math_render.py arrived at.
 */
export function mathParts(tex, display) {
  const entry = altEntry(tex, display);
  if (!entry) {
    throw new Error(
      `No alt text for ${display ? 'display ' : ''}expression ${JSON.stringify(
        normalizeTex(tex),
      )}. Add it to scripts/blackboard/math-alt.mjs. An expression without a ` +
        `sentence is unreadable to anyone using a screen reader, and unreadable ` +
        `to everyone if Blackboard strips the markup.`,
    );
  }

  return {
    // The wrapper is built by the caller as a real element rather than being
    // pasted in as markup, so an expression is one element and not a span
    // inside a span.
    markup:
      RENDER === 'mathml'
        ? toMathml(tex, display)
        : toSvg(tex, display, entry.alt),
    alt: entry.alt,
    // MathML renders smaller than the prose around it inside a list item or a
    // table cell; 1.15em brings it back to the weight of the sentence it sits
    // in. A display formula gets math_render.py's tinted box.
    style: display
      ? `${DISPLAY_BOX}font-size:1.35rem;font-family:${MATHFONT}`
      : `font-family:${MATHFONT};font-size:1.15em;vertical-align:middle`,
    tag: display ? 'p' : 'span',
  };
}

/** Short entity expressions in the math font, math_render.py's `m()`. */
export function mathFont(text) {
  return `<span style="font-family:${MATHFONT};font-style:normal">${text}</span>`;
}

/**
 * Every alt entry is a real sentence, and every atomic exemption is declared.
 * The same assertions math_render.assert_render_sane makes, for the same
 * reason: an alt that is too short to describe a formula is worse than useless.
 */
export function assertAltSane() {
  if (!['mathml', 'svg'].includes(RENDER)) {
    throw new Error(`RENDER is ${JSON.stringify(RENDER)}`);
  }

  for (const [key, entry] of Object.entries(MATH_ALT)) {
    if (!entry.alt?.trim()) {
      throw new Error(`${key}: missing alt`);
    }
    if (!entry.alt.trimEnd().endsWith('.')) {
      throw new Error(`${key}: alt is not a sentence`);
    }
    if (!entry.atomic && entry.alt.length < 25) {
      throw new Error(
        `${key}: alt is too short to describe a formula. If this is a single ` +
          `symbol rather than a statement, mark it atomic.`,
      );
    }
  }

  return Object.keys(MATH_ALT).length;
}
