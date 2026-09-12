import { EmbedLink } from '@/components/embed-link';

type ReadingLineProps = {
  href: string;
  /**
   * A prop, not children. MDX turns children that sit on their own line into a
   * paragraph, and a paragraph nested inside the anchor inside this paragraph
   * is invalid markup that a browser silently takes apart. A string cannot
   * become a block, whatever the formatter does to the source.
   */
  label: string;
};

/**
 * The assigned reading, named and linked.
 *
 * A component rather than a styled paragraph because this content renders
 * twice: once as a route and once as an inline-styled Blackboard fragment, and
 * a fragment cannot carry the stylesheet a class name would need.
 */
export function ReadingLine({ href, label }: ReadingLineProps) {
  return (
    <p className="embed-source">
      <strong>Reading:</strong> <EmbedLink href={href}>{label}</EmbedLink>
    </p>
  );
}
