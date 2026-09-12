/**
 * The STAT panel block, reproduced from `../build/math_assets.py`.
 *
 * WHY IT IS BUILT BY STRING TEMPLATE AND NOT THROUGH REACT
 * -------------------------------------------------------
 * Because it is a reproduction, not a design. The shape is `panel()` in
 * math_assets.py and the point is to match it, so the template reads next to
 * that function line for line and a drift between the two is visible. Every
 * constant below is copied from there; none of it is re-derived.
 *
 * WHAT THE SHAPE IS FOR
 * ---------------------
 * A blurb Blackboard renders itself, then a navy bar carrying the way out, then
 * a fixed-pixel frame, then the line about scrolling inside the frame. The
 * order is load-bearing: a link alone and a frame alone were each rejected in
 * STAT, and both in this order is what was accepted, because a phone reader
 * meets the way out before the scroll region.
 *
 * This is the SECOND output for each section. The native fragment is the first.
 * Neither is preferred and neither replaces the other: Jeffrey picks per
 * Document at paste time. The reversal of 2026-09-12 scoped the panel away from
 * assigned reading as the DEFAULT, not away from existing.
 */

// math_assets.PANEL_PX. 720px for a lesson page.
export const PANEL_PX = 720;

// math_assets._PROSE. Blackboard's own body font is not guaranteed, and the
// blurb has to look like the page it sits on.
const PROSE = 'font-family:Arial,Helvetica,sans-serif;';

// math_assets._CAPTION_PAGE, verbatim.
const CAPTION_PAGE =
  'The panel above holds the whole page and scrolls inside its own frame. ' +
  'If you would rather read it on the full screen, or you are on a phone, ' +
  "use the link in the panel's blue bar.";

// math_assets.TITLE. These are the titles in math_week4_titles.SPEC and they
// must stay in step with it.
export const TITLE = {
  'section-1-7': 'Limits, Continuity, and Differentiability (Section 1.7)',
  'section-1-8': 'The Tangent Line Approximation (Section 1.8)',
  'ivt-openstax':
    'Continuity and the Intermediate Value Theorem (OpenStax supplement)',
};

// math_assets.BLURB. One line of framing above each panel.
const BLURB = {
  'section-1-7':
    'The three conditions for continuity, and why a function can be continuous ' +
    'at a point and still have no derivative there. The graph lets you move a ' +
    'point and watch the slopes from the left and from the right disagree at ' +
    'the corner.',
  'section-1-8':
    'The tangent line approximation, and the part students skip: concavity is ' +
    'what tells you whether your estimate came out too big or too small.',
  'ivt-openstax':
    'One-sided limit notation and the Intermediate Value Theorem. Active ' +
    'Calculus does not cover either one and our course outline needs both, so ' +
    'this short supplement sits alongside Section 1.7.',
};

// math_assets.LINK_LABEL.
const LINK_LABEL = {
  'section-1-7': 'Open Section 1.7 on the full screen',
  'section-1-8': 'Open Section 1.8 on the full screen',
  'ivt-openstax': 'Open the continuity and IVT supplement on the full screen',
};

/** math_assets.embed(): one frame, sized in PIXELS, no viewport unit anywhere. */
function frame(src, title) {
  if (!title || title.endsWith('.')) {
    throw new Error(
      `give the iframe a real title, got ${JSON.stringify(title)}`,
    );
  }
  const height = `${PANEL_PX}px`;
  if (!/^\d+px$/.test(height)) {
    throw new Error('a frame height is a whole number of pixels');
  }
  return (
    `<iframe src="${src}"\n` +
    `          title="${title}"\n` +
    `          style="width:100%;height:${height};border:0;display:block;"\n` +
    `          loading="lazy"></iframe>`
  );
}

/** math_assets.panel(): content ON the page, with the full page one click away. */
export function panel(slug, assetBase) {
  const blurb = BLURB[slug];
  if (!blurb) {
    throw new Error(`${slug}: every panel needs a line saying what is in it`);
  }
  const src = `${assetBase}/embed/${slug}/`;
  return (
    `<p style="${PROSE}">${blurb}</p>\n` +
    `<div style="border:1px solid #c7d0dd;border-radius:8px;overflow:hidden;margin:18px 0;">\n` +
    `  <div style="background:#1f3864;padding:0.5rem 0.9rem;${PROSE}` +
    `font-size:0.92rem;color:#ffffff;">\n` +
    `    <a href="${src}" target="_blank" rel="noopener noreferrer" ` +
    `style="color:#ffffff;font-weight:700;text-decoration:underline;">${LINK_LABEL[slug]}</a>\n` +
    `  </div>\n` +
    `  ${frame(src, TITLE[slug])}\n` +
    `</div>\n` +
    `<p style="${PROSE}color:#5f6368;font-size:0.9rem;">${CAPTION_PAGE}</p>\n`
  );
}
