import {
  CORNER_SLOPES_SLUG,
  CORNER_SLOPES_TITLE,
  WIDGET_FRAME_PX,
} from '@/lib/widget-frame';
import { siteHref } from '@/lib/site';

/**
 * The corner explorer as a nested frame, for the Blackboard-native page.
 *
 * On `app/embed/` the explorer renders inline as React, because that page is
 * read at full screen. Here the page is itself inside a 720px frame in a
 * Blackboard Document, and the explorer is a separate route at its own measured
 * height. Nesting is correct and is how this already works: the Document runs
 * no script, but everything inside the frame is a real browser context, and the
 * frame within it is another one.
 *
 * The bar above the frame is the escape hatch, and it goes above rather than
 * below so a phone reader meets the way out before the scroll region. Its
 * `target="_top"` is load-bearing twice over: this page sits in a frame inside
 * a frame, and without it the graph would open in the innermost one.
 */
export function BbWidgetFrame() {
  const src = siteHref(`/widget/${CORNER_SLOPES_SLUG}/`);

  return (
    <div className="bb-widget">
      <p className="bb-widget-blurb">
        Move the point along the graph and read the two slopes as numbers. Away
        from the corner they agree, and the gap between them closes as the gap
        you measure over shrinks. At x = 2 they stay at −1 and 1 however small
        that gap gets, which is what “no derivative here” means.
      </p>
      <div className="embed-frame">
        <div className="embed-frame-bar">
          <a
            className="embed-link embed-frame-bar-link"
            href={src}
            rel="noopener"
            target="_top"
          >
            Open the slopes-at-a-corner graph on its own
          </a>
        </div>
        <iframe
          className="embed-frame-window"
          loading="lazy"
          src={src}
          style={{ height: `${WIDGET_FRAME_PX}px` }}
          title={CORNER_SLOPES_TITLE}
        />
      </div>
    </div>
  );
}
