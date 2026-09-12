/**
 * The Week 4 content rendered as a Blackboard Ultra Document fragment.
 *
 * Every style here is inline and every value is copied from the hand-built
 * pages already sitting in ../blackboard_content/math_a251_week4/. Those pages
 * are in live shells and render, which is the only evidence that counts for
 * this target. A fragment cannot carry a `<style>` block or a class-based
 * stylesheet, so a class name in the output is a bug, not a style choice.
 *
 * Links here use `target="_blank"`, not the `target="_top"` the routes need.
 * Nothing is framed: the Document IS the page.
 */
import { createElement as h, Fragment } from 'react';

import { WIDGET_FRAME_PX } from '../../lib/widget-frame.ts';
import { escapeAttribute, mathFont, mathParts } from './math.mjs';

// Where a published route lives. `../build/math_assets.py` holds the authority
// for this value; changing it there without changing it here is the migration
// stat253 records going wrong, so it is written once and asserted against the
// working copy before anything is emitted.
export const ASSET_BASE = 'https://jjohnson-47.github.io/math251-fall2026-site';

/**
 * Set from a live paste test, not from a browser.
 *
 * `details`/`summary` need no script and no stylesheet, so they are the right
 * shape for a predict-reveal in a Document. What is unverified is whether
 * Blackboard's editor keeps them through a save. If it does not, flip this to
 * `visible` and every question renders above its own answer instead.
 */
export const REVEAL = 'details';

/**
 * The corner explorer is NOT DEPLOYED as of 2026-09-12.
 *
 * The frame is emitted either way, because the frame is what the block is for.
 * What this flag changes is how loudly the exporter says that the URL inside it
 * is currently a 404: until the Pages workflow has run for a commit containing
 * app/widget/corner-slopes/, pasting 1.7 puts an empty rectangle in the middle
 * of the reading. The reading itself does not depend on it, which is the whole
 * point of the reversal, and the line and the link above the frame still say
 * what the missing thing was. Open the URL yourself before pasting.
 */
export const WIDGET_DEPLOYED = true; // verified live 2026-09-12: widget renders "Slopes at a corner", gap 0.5/0.1/0.01, slopes -1 and 1

// The fitted frame height, measured rather than chosen. It lives in
// lib/widget-frame.ts because the React frame on app/bb/section-1-7/ needs
// the same number and cannot import a .mjs script; the provenance and the
// full width sweep are recorded there. Re-exported so the paste test and the
// notes keep importing it from here.
export { WIDGET_FRAME_PX };

const CARD = {
  note: 'background-color:#e6f3ff;padding:20px;border-radius:8px;margin-bottom:25px;',
  warn: 'background-color:#fff4e6;padding:20px;border-left:4px solid #FF6600;border-radius:8px;margin-bottom:25px;',
  quiet:
    'background-color:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:25px;',
  plain:
    'background-color:#ffffff;padding:20px;border:1px solid #e0e0e0;border-radius:8px;margin-bottom:25px;',
};
const CARD_HEADING = 'margin-top:0;color:#005a9c';
const FRAME_SHELL =
  'border:1px solid #cfd8e3;border-radius:8px;overflow:hidden';
const FRAME_BAR = 'background:#1f3864;padding:9px 13px';
const FRAME_BAR_LINK = 'color:#fff;text-decoration:underline';
const FRAME_NOTE = 'margin-bottom:0;color:#555;font-size:0.95rem';
const CARD_LINK =
  'display:block;max-width:480px;margin:14px 0;border:1px solid #cfd8e3;' +
  'border-radius:8px;overflow:hidden;background:#ffffff;text-decoration:none;' +
  'color:#202124';
const POSTER_WRAP = 'position:relative;display:block';
const POSTER_IMG =
  'display:block;width:100%;max-width:480px;height:auto;border:0';
// A play badge built from a border triangle inside a disc. No glyph, because a
// geometric-shape character renders as an emoji on some platforms and as a box
// on others; no inline SVG, because this is simpler and needs no title; no
// script, because a Document runs none. If the sanitiser strips `position` the
// two spans fall below the image as a disc and a triangle, which is odd but
// not broken.
const BADGE_DISC =
  // margin is half the LAID-OUT box: 54px wide plus a 2px border on each
  // side is 58, so -29 and not -27. At -27 the disc sat 2px low and 2px
  // right of the image centre.
  'position:absolute;top:50%;left:50%;margin:-29px 0 0 -29px;display:block;' +
  'width:54px;height:54px;border-radius:50%;background:#1f3864;' +
  'border:2px solid #ffffff';
const BADGE_TRIANGLE =
  'position:absolute;top:50%;left:50%;margin:-13px 0 0 -7px;display:block;' +
  'width:0;height:0;border-top:13px solid transparent;' +
  'border-bottom:13px solid transparent;border-left:20px solid #ffffff';
const CARD_BODY = 'display:block;padding:10px 12px';
const CARD_TITLE =
  'display:block;font-weight:700;color:#1f3864;text-decoration:underline';
const CARD_NOTE = 'display:block;margin-top:3px;color:#555;font-size:0.95rem';

const REVEAL_SHELL =
  'margin:12px 0;border:1px solid #cfd8e3;border-radius:6px;background:#ffffff';
const REVEAL_SUMMARY =
  'padding:10px 14px;cursor:pointer;font-weight:700;color:#1f3864';
const REVEAL_BODY = 'padding:2px 14px 8px;border-top:1px solid #e6ebf2';

/** CSS text to a React style object, so the constants above stay readable. */
export function parseStyle(css) {
  const style = {};
  for (const rule of css.split(';')) {
    const split = rule.indexOf(':');
    if (split === -1) continue;
    const property = rule.slice(0, split).trim();
    const value = rule.slice(split + 1).trim();
    if (!property || !value) continue;
    style[property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] =
      value;
  }
  return style;
}

const styled = (tag, css, extra) => (props) =>
  h(tag, { ...extra, ...props, style: parseStyle(css) });

const raw = (html) => ({ dangerouslySetInnerHTML: { __html: html } });

function Reveal({ question, children }) {
  if (REVEAL === 'details') {
    return h(
      'details',
      { style: parseStyle(REVEAL_SHELL) },
      h('summary', { style: parseStyle(REVEAL_SUMMARY) }, question),
      h('div', { style: parseStyle(REVEAL_BODY) }, children),
    );
  }
  return h(
    'div',
    { style: parseStyle(REVEAL_SHELL) },
    h('p', { style: parseStyle(`margin:0;${REVEAL_SUMMARY}`) }, question),
    h('div', { style: parseStyle(REVEAL_BODY) }, children),
  );
}

/**
 * The panel-plus-link block, the shape in `../build/math_assets.py`.
 *
 * The order is load-bearing: one line saying what the thing is, then a bar
 * carrying the way out, then the frame. A phone reader meets the link before
 * the frame, and the line above it means a student who never loads the frame
 * still knows what they missed.
 */
function widgetPanel({ slug, blurb, linkLabel, title, framePx }) {
  const src = `${ASSET_BASE}/widget/${slug}/`;
  return h(
    Fragment,
    null,
    h('p', null, blurb),
    h(
      'div',
      { style: parseStyle(`${FRAME_SHELL};margin:18px 0`) },
      h(
        'div',
        { style: parseStyle(FRAME_BAR) },
        h(
          'a',
          {
            href: src,
            target: '_blank',
            rel: 'noopener',
            style: parseStyle(`${FRAME_BAR_LINK};font-weight:700`),
          },
          linkLabel,
        ),
      ),
      h('iframe', {
        src,
        title,
        width: '100%',
        height: String(framePx),
        style: parseStyle('border:0;display:block'),
        loading: 'lazy',
      }),
    ),
  );
}

export function blackboardComponents({ slug, routeUrl }) {
  return {
    // The page title. An h1 belongs to the Document, which supplies its own, so
    // the top heading here is an h2 exactly as the hand-built pages do it.
    h1: styled('h2', `color:#005a9c;${CARD_HEADING}`),
    h2: styled('h3', CARD_HEADING),
    h3: styled('h4', CARD_HEADING),
    strong: (props) => h('b', props),
    em: (props) => h('i', props),
    a: ({ href, children, ...rest }) =>
      h('a', { ...rest, href, target: '_blank', rel: 'noopener' }, children),
    code: styled('code', 'font-family:Consolas,Menlo,monospace'),

    mathslot: (props) => {
      const index = Number(props['data-key'] ?? props.dataKey);
      const { tex, display } = MATH_SLOTS[index];
      const { markup, alt, style, tag } = mathParts(tex, display);
      return h(tag, {
        style: parseStyle(style),
        role: 'math',
        'aria-label': alt,
        ...raw(markup),
      });
    },

    EmbedCard: ({ title, tone = 'plain', children }) =>
      h(
        'div',
        { style: parseStyle(CARD[tone] ?? CARD.plain) },
        h('h3', { style: parseStyle(CARD_HEADING) }, title),
        children,
      ),

    PredictReveal: ({ question, children }) =>
      h(Reveal, { question }, children),

    WriteFirst: ({ prompt, selfCheck, children }) =>
      h(
        Fragment,
        null,
        // No textarea. A form control in a Document submits nowhere, and the
        // instruction is the part that matters; the full-screen route keeps the
        // box for anyone who wants to type into it.
        h('p', null, h('b', null, prompt)),
        h(
          'p',
          { style: parseStyle('color:#555;font-size:0.95rem') },
          'Write it in your notes before you open the check. This is ungraded ' +
            'practice; nothing here is collected.',
        ),
        h(Reveal, { question: selfCheck }, children),
      ),

    EmbedLink: ({ href, children }) =>
      h('a', { href, target: '_blank', rel: 'noopener' }, children),

    ReadingLine: ({ href, label }) =>
      h(
        'p',
        null,
        h('b', null, 'Reading:'),
        ' ',
        h('a', { href, target: '_blank', rel: 'noopener' }, label),
      ),

    // One card, one link. The thumbnail is served from this site, never from
    // i.ytimg.com: a Document that hotlinks Google makes every page view a
    // request to Google, which is the thing the youtube-nocookie rule exists
    // to stop and the reason these two videos are not embedded at all.
    VideoResource: ({
      title,
      duration,
      watchHref,
      captionStatus,
      videoId,
      posterAlt,
    }) =>
      h(
        'a',
        {
          href: watchHref,
          target: '_blank',
          rel: 'noopener',
          style: parseStyle(CARD_LINK),
        },
        h(
          'span',
          { style: parseStyle(POSTER_WRAP) },
          h('img', {
            src: `${ASSET_BASE}/media/video/${videoId}.jpg`,
            alt: posterAlt,
            width: '480',
            height: '270',
            style: parseStyle(POSTER_IMG),
          }),
          h('span', {
            'aria-hidden': 'true',
            style: parseStyle(BADGE_DISC),
          }),
          h('span', {
            'aria-hidden': 'true',
            style: parseStyle(BADGE_TRIANGLE),
          }),
        ),
        h(
          'span',
          { style: parseStyle(CARD_BODY) },
          h(
            'span',
            { style: parseStyle(CARD_TITLE) },
            `Watch ${title} on YouTube`,
          ),
          h(
            'span',
            { style: parseStyle(CARD_NOTE) },
            `${duration}. ${captionStatus} The video opens in a new tab; this page does not load YouTube on its own.`,
          ),
        ),
      ),

    GraphEmbed: ({ title, src, openHref, height = 420, children }) =>
      h(
        'div',
        { style: parseStyle('margin-bottom:18px') },
        h(
          'div',
          { style: parseStyle(FRAME_SHELL) },
          h(
            'div',
            { style: parseStyle(FRAME_BAR) },
            h(
              'a',
              {
                href: openHref,
                target: '_blank',
                rel: 'noopener',
                style: parseStyle(FRAME_BAR_LINK),
              },
              'Open this graph in Desmos',
            ),
          ),
          h('iframe', {
            src,
            title,
            width: '100%',
            height: String(height),
            style: parseStyle('border:0;display:block'),
          }),
        ),
        h('div', { style: parseStyle(FRAME_NOTE) }, children),
      ),

    // The explorer becomes the one framed thing on the page, placed where the
    // prose reaches the corner rather than bolted on at the end.
    CornerSlopeLab: () =>
      widgetPanel({
        slug: 'corner-slopes',
        blurb:
          'Move the point along the graph and read the two slopes as numbers. ' +
          'Away from the corner they agree and the gap between them closes as ' +
          'the gap you measure over shrinks. At x = 2 they stay at −1 and 1 ' +
          'however small that gap gets, which is what “no derivative here” means.',
        linkLabel: 'Open the slopes-at-a-corner graph in a new tab',
        title: 'Slopes at a corner: move a point along g(x) = |x − 2|',
        framePx: WIDGET_FRAME_PX,
      }),

    // The route is a convenience, never the way to the content. Every word of
    // the reading is already above this line.
    EmbedNav: () =>
      h(
        'p',
        { style: parseStyle('color:#555;font-size:0.95rem;margin-bottom:0') },
        'Everything above is the whole of this reading. If you would rather ' +
          'read it on its own page, or keep it open next to something else, ',
        h(
          'a',
          { href: routeUrl, target: '_blank', rel: 'noopener' },
          'open it on the course site',
        ),
        `. The page and this document carry the same text.`,
      ),

    // Anything the MDX uses that is not mapped above should fail loudly rather
    // than render as an unstyled mystery.
    WriteFirstTextarea: () => {
      throw new Error(`${slug}: unexpected component in a Blackboard fragment`);
    },
  };
}

/** Filled by the exporter before rendering; see the rehype plugin there. */
export const MATH_SLOTS = [];

export { escapeAttribute, mathFont };
