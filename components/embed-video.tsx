import { siteHref } from '@/lib/site';

type VideoResourceProps = {
  /** The video title as it appears on its watch page. */
  title: string;
  /** Running time, stated before a student decides to open it. */
  duration: string;
  watchHref: string;
  /** What was actually confirmed about the caption track, in plain words. */
  captionStatus: string;
  /** YouTube id, which is also the filename of the self-hosted thumbnail. */
  videoId: string;
  /**
   * What the thumbnail shows and what the video covers. Never "video
   * thumbnail": that names the element, not the content.
   */
  posterAlt: string;
};

/**
 * A video offered as a card rather than a player.
 *
 * House policy is that a video may not be embedded until someone has confirmed
 * an English caption track that is not labelled auto-generated. Both Week 4
 * videos serve exactly one caption track and it is the automatic one, so both
 * are links. `docs/video-reviews.json` records what was checked and how. A bare
 * link does not read as a video, hence the thumbnail.
 *
 * The thumbnail is SELF-HOSTED, under public/media/video/. Hotlinking
 * i.ytimg.com would make every page view a request to Google, which is the same
 * thing the youtube-nocookie rule exists to prevent and the reason these two
 * videos are links in the first place.
 */
export function VideoResource({
  title,
  duration,
  watchHref,
  captionStatus,
  videoId,
  posterAlt,
}: VideoResourceProps) {
  return (
    <div className="embed-resource">
      {/* target="_top", not "_blank": these routes can be read inside a frame,
          and a link without it opens the destination in the panel. */}
      <a
        className="embed-resource-card"
        href={watchHref}
        rel="noopener"
        target="_top"
      >
        <span className="embed-resource-poster">
          {/* Not next/image. This site is a static export with
              images.unoptimized, so next/image would add a component and
              optimise nothing, and the same card has to render as a plain
              inline-styled <img> inside a Blackboard fragment. One <img> that
              both surfaces can emit is the point. */}
          {/* eslint-disable-next-line next/no-img-element */}
          <img
            alt={posterAlt}
            height={270}
            src={siteHref(`/media/video/${videoId}.jpg`)}
            width={480}
          />
          <span aria-hidden="true" className="embed-resource-badge" />
        </span>
        <span className="embed-resource-body">
          <span className="embed-resource-title">Watch {title} on YouTube</span>
          <span className="embed-resource-note">
            {duration}. {captionStatus} The link opens YouTube in place of this
            page; nothing on this page loads YouTube on its own.
          </span>
        </span>
      </a>
    </div>
  );
}
