import { EmbedLink } from '@/components/embed-link';

type VideoResourceProps = {
  /** The video title as it appears on its watch page. */
  title: string;
  /** Running time, stated before a student decides to open it. */
  duration: string;
  watchHref: string;
  /** What was actually confirmed about the caption track, in plain words. */
  captionStatus: string;
};

/**
 * A video offered as a link rather than a player.
 *
 * House policy is that a video may not be embedded until someone has confirmed
 * an English caption track that is not labelled auto-generated. Both Week 4
 * videos serve exactly one caption track and it is the automatic one, so both
 * are links. `docs/video-reviews.json` records what was checked and how.
 */
export function VideoResource({
  title,
  duration,
  watchHref,
  captionStatus,
}: VideoResourceProps) {
  return (
    <div className="embed-resource">
      <EmbedLink className="embed-resource-link" href={watchHref}>
        Watch {title} on YouTube
      </EmbedLink>
      <p className="embed-resource-note">
        {duration}. {captionStatus} The link opens YouTube in place of this
        page; nothing on this page loads YouTube on its own.
      </p>
    </div>
  );
}
