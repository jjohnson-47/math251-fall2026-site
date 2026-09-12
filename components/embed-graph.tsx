import type { ReactNode } from 'react';

import { EmbedLink } from '@/components/embed-link';

type GraphEmbedProps = {
  /** Describes the graph, not the tool. It is the iframe's accessible name. */
  title: string;
  src: string;
  openHref: string;
  /** Pixels. No viewport units: this page is itself inside a fixed panel. */
  height?: number;
  children: ReactNode;
};

/**
 * A third-party graph, with the way out sitting above the frame.
 *
 * The bar is above the frame for the same reason the Blackboard paste block
 * puts its link above the panel: a phone reader should meet the way out before
 * the scroll region, not after it.
 */
export function GraphEmbed({
  title,
  src,
  openHref,
  height = 420,
  children,
}: GraphEmbedProps) {
  return (
    <figure className="embed-frame">
      <div className="embed-frame-bar">
        <EmbedLink className="embed-frame-bar-link" href={openHref}>
          Open this graph in Desmos
        </EmbedLink>
      </div>
      <iframe
        className="embed-frame-window"
        loading="lazy"
        src={src}
        style={{ height: `${height}px` }}
        title={title}
      />
      <figcaption className="embed-frame-caption">{children}</figcaption>
    </figure>
  );
}
