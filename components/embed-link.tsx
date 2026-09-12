import type { ReactNode } from 'react';

type EmbedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Any link that leaves the page.
 *
 * These routes are read inside a fixed 720px Blackboard panel. Without
 * `target="_top"` the destination loads inside that panel, which is how a
 * student ends up reading a whole external site through a letterbox.
 */
export function EmbedLink({ href, children, className }: EmbedLinkProps) {
  return (
    <a
      className={className ? `embed-link ${className}` : 'embed-link'}
      href={href}
      rel="noopener"
      target="_top"
    >
      {children}
    </a>
  );
}
