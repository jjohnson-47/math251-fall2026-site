import { EmbedLink } from '@/components/embed-link';
import { week4EmbedRoutes } from '@/lib/embed-routes';
import { siteHref } from '@/lib/site';

type EmbedNavProps = {
  /** Slug of the page rendering this nav. Slugs are permanent. */
  current: string;
};

export function EmbedNav({ current }: EmbedNavProps) {
  const position = week4EmbedRoutes.findIndex(
    (route) => route.slug === current,
  );

  return (
    <nav aria-labelledby="embed-nav-title" className="embed-nav">
      <h2 className="embed-card-title" id="embed-nav-title">
        Where to go next
      </h2>
      <p>
        These three pages carry one idea between them, and they are written to
        be read in this order. This is page {position + 1} of{' '}
        {week4EmbedRoutes.length}.
      </p>
      <ol className="embed-nav-list">
        {week4EmbedRoutes.map((route) => (
          <li
            aria-current={route.slug === current ? 'page' : undefined}
            key={route.slug}
          >
            {route.slug === current ? (
              <span className="embed-nav-current">
                {route.title}{' '}
                <span className="embed-nav-tag">you are here</span>
              </span>
            ) : (
              <EmbedLink href={siteHref(`/embed/${route.slug}/`)}>
                {route.title}
              </EmbedLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
