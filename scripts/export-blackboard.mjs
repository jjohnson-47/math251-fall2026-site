/**
 * Emit one pasteable HTML fragment per Week 4 section.
 *
 * WHY THIS EXISTS
 * ---------------
 * The first version of the Week 4 build put each section page behind a 720px
 * Blackboard panel. That was rejected on sight, and correctly: those pages are
 * the week's ASSIGNED READING, and a reading behind a frame gives a student a
 * porthole, a nested scrollbar, and nothing at all when a deploy is a minute
 * behind. See docs/blackboard-embeds.md, "REVERSED 2026-09-12".
 *
 * So the prose is pasted natively and only the interaction keeps a frame. That
 * needs a second renderer over the same MDX: the routes render MathJax CHTML
 * and Tailwind classes, and a Document fragment can carry neither. Same words,
 * same source file, different output. The alternative was a second copy of the
 * content, which is how two versions of a sentence end up in a course.
 *
 * WHAT IT WRITES
 * --------------
 *   ../blackboard_content/math_a251_week4/<slug>__BB.html
 *
 * alongside the hand-built pages that shape it. Those are in live shells and
 * render; every style constant here is copied from them.
 *
 *   npm run export:bb            write the fragments
 *   npm run export:bb -- --check render and validate, write nothing
 */
import { readFile, writeFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { evaluate } from '@mdx-js/mdx';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as runtime from 'react/jsx-runtime';
import remarkMath from 'remark-math';
import { visit } from 'unist-util-visit';

import {
  ASSET_BASE,
  MATH_SLOTS,
  REVEAL,
  WIDGET_FRAME_PX,
  WIDGET_DEPLOYED,
  blackboardComponents,
} from './blackboard/components.mjs';
import { RENDER, assertAltSane } from './blackboard/math.mjs';
import { PANEL_PX, panel } from './blackboard/panel.mjs';

const projectRoot = new URL('../', import.meta.url);
const outputDirectory = new URL(
  '../blackboard_content/math_a251_week4/',
  projectRoot,
);

// Reading order. The overview students already have sends them to the IVT
// supplement straight after 1.7, so the Documents go in in this order.
const SECTIONS = [
  {
    slug: 'section-1-7',
    source: 'content/week4/section-1-7.mdx',
    file: 'section-1-7__BB.html',
    panelFile: 'section-1-7__IFRAME.html',
    title: 'Limits, Continuity, and Differentiability (Section 1.7)',
  },
  {
    slug: 'ivt-openstax',
    source: 'content/week4/ivt-openstax.mdx',
    file: 'ivt-openstax__BB.html',
    panelFile: 'ivt-openstax__IFRAME.html',
    title:
      'Continuity and the Intermediate Value Theorem (OpenStax supplement)',
  },
  {
    slug: 'section-1-8',
    source: 'content/week4/section-1-8.mdx',
    file: 'section-1-8__BB.html',
    panelFile: 'section-1-8__IFRAME.html',
    title: 'The Tangent Line Approximation (Section 1.8)',
  },
];

// The gradient border and white card the Week 4 pages already use in the shell.
const SHELL_OPEN =
  '<div style="background:linear-gradient(135deg,#005a9c 0%,#0066CC 50%,#FF6600 100%);' +
  'padding:3px;border-radius:10px;"><div style="background-color:#ffffff;padding:25px;' +
  'border-radius:8px;">';
const SHELL_CLOSE = '</div></div>';

/**
 * Two edits to the ported wording, both agreed: the weekday, and the three
 * pointers at Applied Assignment 1. Nothing else in the reading may change, so
 * the check runs over the rendered fragment rather than trusting the source.
 */
const BANNED_PHRASES = [
  [
    /\bby Friday\b/i,
    'a weekday. The LMS owns dates; this repository is public',
  ],
  [/Applied Assignment/i, 'a pointer at an assignment'],
  [/\bdue\b/i, 'a deadline'],
];

const BANNED_TOKENS =
  /fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|unpkg|polyfill/i;
const VIEWPORT_UNIT = /(?<=\d)(?:vh|vw|vmin|vmax|svh|lvh|dvh|svw|lvw|dvw)\b/;
const EMOJI_LEAD = /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

/**
 * Pull each math node out of the tree and leave a slot behind.
 *
 * The display case is the one to get right: remark-math renders `$$...$$` as a
 * `<code class="math-display">` inside a `<pre>`, so replacing the code element
 * alone leaves the `<pre>` wrapped around the formula and a Document shows a
 * tinted box inside a monospace block.
 */
function rehypeMathSlots() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === null) return;
      const raw = node.properties?.className ?? [];
      const classes = Array.isArray(raw) ? raw : [raw];
      const display = classes.includes('math-display');
      if (!display && !classes.includes('math-inline')) return;

      const tex = node.children.map((child) => child.value ?? '').join('');
      const key = String(MATH_SLOTS.push({ tex, display }) - 1);
      const slot = {
        type: 'element',
        tagName: 'mathslot',
        properties: { dataKey: key },
        children: [],
      };

      if (display && parent.type === 'element' && parent.tagName === 'pre') {
        return; // handled by the pre visitor below
      }
      parent.children[index] = slot;
    });

    // Second pass for display math, which arrives wrapped in a <pre>.
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === null || node.tagName !== 'pre') return;
      const child = node.children.find(
        (candidate) => candidate.type === 'element',
      );
      const raw = child?.properties?.className ?? [];
      const classes = Array.isArray(raw) ? raw : [raw];
      if (!classes.includes('math-display')) return;

      const tex = child.children.map((grand) => grand.value ?? '').join('');
      const key = String(MATH_SLOTS.push({ tex, display: true }) - 1);
      parent.children[index] = {
        type: 'element',
        tagName: 'mathslot',
        properties: { dataKey: key },
        children: [],
      };
    });
  };
}

/**
 * Strip the MDX imports.
 *
 * A component import is dropped: the name then resolves from the components map
 * passed at render time, which is the whole mechanism that lets one MDX file
 * render two ways. A library import is turned into a `const` holding the real
 * value, so a URL the routes use and a URL the fragment uses cannot drift.
 */
async function rewriteImports(source) {
  const pattern = /^import\s*\{([^}]*)\}\s*from\s*'([^']+)';[^\S\n]*\n?/gm;
  const declarations = [];
  let body = source;

  for (const match of source.matchAll(pattern)) {
    const [statement, names, specifier] = match;
    body = body.replace(statement, '');
    if (specifier.startsWith('@/components/')) continue;
    if (!specifier.startsWith('@/lib/')) {
      throw new Error(`Unexpected import in MDX: ${statement.trim()}`);
    }

    const moduleUrl = new URL(specifier.replace('@/', './'), projectRoot);
    const loaded = await import(`${moduleUrl.href}.ts`);
    for (const name of names.split(',').map((value) => value.trim())) {
      if (!name) continue;
      if (!(name in loaded)) {
        throw new Error(`${specifier} does not export ${name}`);
      }
      // `export const`, not `const`: MDX lifts ESM statements into the document
      // scope and drops a bare declaration silently.
      declarations.push(
        `export const ${name} = ${JSON.stringify(loaded[name])};`,
      );
    }
  }

  // The blank line matters. Without it the ESM block runs on into the first
  // markdown heading and acorn is handed `# Continuity` to parse.
  const prelude = declarations.length ? `${declarations.join('\n')}\n\n` : '';
  return prelude + body.replace(/^\s*\n+/, '');
}

async function renderSection(section) {
  MATH_SLOTS.length = 0;
  const source = await readFile(new URL(section.source, projectRoot), 'utf8');
  const { default: Content } = await evaluate(await rewriteImports(source), {
    ...runtime,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathSlots],
  });

  const components = blackboardComponents({
    slug: section.slug,
    routeUrl: `${ASSET_BASE}/embed/${section.slug}/`,
  });
  const body = renderToStaticMarkup(createElement(Content, { components }));
  return `${SHELL_OPEN}\n${body}\n${SHELL_CLOSE}\n`;
}

/**
 * Everything a Blackboard Document forbids, checked over the emitted markup
 * rather than over the source. The artifact is what gets pasted.
 *
 * Both outputs go through this. What differs between a native fragment and a
 * panel block is checked separately below.
 */
function validateCommon(name, html) {
  const fail = (message) => {
    throw new Error(`${name}: ${message}`);
  };

  if (/<script/i.test(html))
    fail('a Document strips script, and must never carry one');
  if (/<style/i.test(html)) fail('a fragment cannot carry a style block');
  if (/\sclass=/i.test(html)) {
    fail('a class name needs a stylesheet the fragment cannot carry');
  }
  if (VIEWPORT_UNIT.test(html)) {
    fail(
      'a viewport unit. Blackboard sizes an HTML block to its content, so ' +
        'content sized to the viewport feeds that back and grows without ' +
        'converging. Pixels only',
    );
  }
  if (/(?:src|href)="\//.test(html)) {
    fail(
      'a root-relative URL resolves against blackboard.alaska.edu, not this site',
    );
  }
  if (BANNED_TOKENS.test(html)) fail('a banned dependency token');
  if (/padding-bottom:\s*\d+%/.test(html)) {
    fail('an aspect-ratio box forces one shape of window whatever the screen');
  }

  for (const [pattern, description] of BANNED_PHRASES) {
    if (pattern.test(html)) fail(`${description}: ${pattern.source}`);
  }

  // A block element inside a paragraph is invalid, and a browser does not
  // report it: it silently closes the paragraph and reopens one after, which is
  // how the reading line came out as two lines and a Desmos caption came out
  // as a paragraph inside a paragraph. Both shipped once before this check.
  for (const match of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
    const nested = match[1].match(/<(p|div|ul|ol|details|table|h[1-6])\b/);
    if (nested) {
      fail(
        `a <${nested[1]}> inside a <p>. MDX wraps children that sit on their ` +
          `own line in a paragraph; pass that text as a prop, or make the ` +
          `wrapper a <div>: ${match[0].slice(0, 110)}`,
      );
    }
  }

  for (const [tag] of html.matchAll(/<iframe\b[^>]*>/g)) {
    if (!/\stitle="[^"]*[^\s"][^"]*"/.test(tag)) {
      fail(`an iframe with no title: ${tag.slice(0, 90)}`);
    }
    // A fixed pixel height, in EITHER form. The fragment's own frames carry a
    // height attribute; the panel block reproduced from math_assets.panel()
    // puts it in the style instead. The rule is that the height is a whole
    // number of pixels and never a viewport unit, not which spelling it uses.
    const attributeHeight = /\sheight="\d+"/.test(tag);
    const styleHeight = /height:\s*\d+px/.test(tag);
    if (!attributeHeight && !styleHeight) {
      fail(`an iframe with no fixed pixel height: ${tag.slice(0, 90)}`);
    }
  }

  for (const [, attributes] of html.matchAll(/<math\b([^>]*)>/g)) {
    if (!attributes.includes('xmlns="http://www.w3.org/1998/Math/MathML"')) {
      fail('a math element without its explicit MathML namespace');
    }
  }

  // Every expression carries its sentence, whichever renderer produced it.
  const mathWrappers = [...html.matchAll(/role="math"[^>]*>/g)];
  for (const [wrapper] of mathWrappers) {
    // Non-empty is the bar here. Whether the sentence is a good one is
    // `assertAltSane`'s job; this only checks it survived into the markup, and
    // an atomic alt is legitimately as short as "f."
    if (!/aria-label="[^"]+"/.test(wrapper)) {
      fail(`a math wrapper with no aria-label: ${wrapper.slice(0, 90)}`);
    }
  }
  // One wrapper per rendered expression, and the renderer decides which element
  // to count. Getting this wrong is how a silently empty expression ships: the
  // sentence would still be on the wrapper and nothing would look missing.
  const rendered = (
    html.match(RENDER === 'mathml' ? /<math\b/g : /<svg\b/g) ?? []
  ).length;
  if (mathWrappers.length !== rendered) {
    fail(
      `${mathWrappers.length} math wrappers but ${rendered} rendered expressions`,
    );
  }

  for (const [, , text] of html.matchAll(/<(h[1-6])\b[^>]*>(.*?)<\/\1>/gs)) {
    if (EMOJI_LEAD.test(text.replace(/<[^>]+>/g, '').trim())) {
      fail(`a heading starting with an emoji: ${text.slice(0, 60)}`);
    }
  }

  // An image needs an alt key, and a real one. Empty alt is correct for a
  // decorative image; the thumbnails are not decorative, they are the only
  // thing on the card that says "this is a video", so each carries a sentence.
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(tag)) {
      fail(`an image with no alt attribute: ${tag.slice(0, 90)}`);
    }
    if (/\salt="\s*(?:video )?thumbnail\s*"/i.test(tag)) {
      fail(
        `an image whose alt names the element instead of the content: ` +
          `${tag.slice(0, 90)}`,
      );
    }
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) {
      fail(
        `an image with no fixed pixel dimensions. Blackboard reserves space ` +
          `from the attributes: ${tag.slice(0, 90)}`,
      );
    }
  }

  if (RENDER === 'svg' && /<svg\b(?![^>]*>[\s\S]*?<title)/.test(html)) {
    fail('an inline SVG with no title');
  }
}

/** The native fragment: the whole reading, inside the Week 4 card shell. */
function validateFragment(name, html) {
  validateCommon(name, html);
  if (!html.startsWith('<div style="background:linear-gradient')) {
    throw new Error(
      `${name}: the fragment must open with the Week 4 card shell`,
    );
  }
}

/**
 * The panel block: that block and nothing else, so the file is
 * open-select-all-copy.
 */
function validatePanel(name, html) {
  validateCommon(name, html);
  const fail = (message) => {
    throw new Error(`${name}: ${message}`);
  };

  const frames = (html.match(/<iframe\b/g) ?? []).length;
  const anchors = (html.match(/<a\b/g) ?? []).length;
  if (frames !== 1) fail(`${frames} iframes; a panel block holds exactly one`);
  if (anchors !== 1)
    fail(`${anchors} anchors; a panel block holds exactly one`);

  // The link goes ABOVE the frame so a phone reader meets the way out before
  // the scroll region. math_assets.assert_assets() checks the same thing.
  if (html.indexOf('<a href=') > html.indexOf('<iframe')) {
    fail('the link must sit above the frame, not below it');
  }
  if (!html.includes(`height:${PANEL_PX}px`)) {
    fail(`the frame must be ${PANEL_PX}px, the height a lesson page takes`);
  }
  if (html.includes('linear-gradient')) {
    fail('a panel block carries the block alone, not the fragment card shell');
  }

  const bytes = Buffer.byteLength(html);
  if (bytes >= 2048) {
    fail(`${bytes} bytes; a panel block is a paste block, not a page`);
  }
}

async function main() {
  const check = process.argv.includes('--check');
  assertAltSane();

  // The widget frame points at a route; if it is not in the working copy the
  // URL is a guess. Same guarantee math_assets.published() gives.
  await access(new URL('app/widget/corner-slopes/page.tsx', projectRoot));
  for (const section of SECTIONS) {
    await access(new URL(`app/embed/${section.slug}/page.tsx`, projectRoot));
  }

  const written = [];
  for (const section of SECTIONS) {
    // Two outputs per section, both correct, neither preferred. The fragment
    // pastes the reading in as native page content; the panel block frames the
    // route instead. Jeffrey picks per Document at paste time.
    const fragment = await renderSection(section);
    validateFragment(section.file, fragment);

    const block = panel(section.slug, ASSET_BASE);
    validatePanel(section.panelFile, block);

    if (!check) {
      await writeFile(new URL(section.file, outputDirectory), fragment, 'utf8');
      await writeFile(
        new URL(section.panelFile, outputDirectory),
        block,
        'utf8',
      );
    }
    written.push({
      ...section,
      bytes: Buffer.byteLength(fragment),
      panelBytes: Buffer.byteLength(block),
    });
  }

  console.log(
    `Math renderer: ${RENDER}. Predict-reveals: ${REVEAL}. ` +
      `Widget frame: ${WIDGET_FRAME_PX}px, deployed=${WIDGET_DEPLOYED}.`,
  );
  const verb = check ? 'checked' : 'wrote';
  for (const section of written) {
    console.log(
      `  ${verb} ${section.file.padEnd(26)} ${String(section.bytes).padStart(7)}` +
        ` bytes  ${section.title}`,
    );
    console.log(
      `  ${verb} ${section.panelFile.padEnd(26)} ${String(
        section.panelBytes,
      ).padStart(7)} bytes  the same page as a ${PANEL_PX}px panel block`,
    );
  }
  console.log(
    '\n  Two outputs per section. The __BB fragment pastes the reading in as\n' +
      '  native page content; the __IFRAME block frames the route instead. Both\n' +
      '  are correct and each file is open-select-all-copy; pick per Document.',
  );
  if (!WIDGET_DEPLOYED) {
    console.log(
      '\n  The corner-slopes widget route is NOT DEPLOYED. The frame in the 1.7\n' +
        '  fragment resolves to a 404 until the Pages workflow has run for a commit\n' +
        `  containing it. Open ${ASSET_BASE}/widget/corner-slopes/ yourself before\n` +
        '  pasting 1.7, then set WIDGET_DEPLOYED = true in scripts/blackboard/components.mjs.',
    );
  }
  console.log(
    `\n  Output: ${fileURLToPath(outputDirectory)}\n` +
      '  Paste order: 1.7, then the IVT supplement, then 1.8.',
  );
}

await main();
