/**
 * The fitted height of the corner-slopes widget frame, in one place.
 *
 * Three things need this number: the React frame on `app/bb/section-1-7/`, the
 * inline-styled frame the Blackboard fragment emits, and the paste test. It
 * lived in `scripts/blackboard/components.mjs`, which the TSX cannot import, so
 * it lives here and that file re-exports it.
 *
 * MEASURED, not chosen. Chromium 148.0.7778.96, over HTTP at the production
 * subpath, taking the tallest state reachable by sweeping all 13 slider
 * positions against all 3 gap settings, at thirteen widths from 280px to
 * 1026px. The width sweep is the part that matters: a fixed-height frame sits
 * in a Blackboard column of any width, and the first version of this widget was
 * 503px tall at 1026px and 667px tall at 500px, so a frame sized on the wide
 * measurement would have scrolled through the whole middle of the range. It is
 * now 573px to 621px across that entire span.
 *
 *   280 / 300 / 316 px .. 573      430 px .............. 617
 *   350 px .............. 595      480 / 520 / 559 px ... 621
 *   390 px .............. 604      620 / 700 / 900 / 1026 px .. 621
 *
 * Frame is the tallest measurement plus 40, per the Blackboard contract. A
 * widget that scrolls inside its own frame is a failed widget.
 */
export const WIDGET_FRAME_PX = 661;

/** The route the frame points at. Slugs are permanent. */
export const CORNER_SLOPES_SLUG = 'corner-slopes';

/** The iframe's accessible name. Describes the graph, not the tool. */
export const CORNER_SLOPES_TITLE =
  'Slopes at a corner: move a point along g(x) = |x − 2|';
