import { EmbedLink } from '@/components/embed-link';
import { embedRoutesByWeek } from '@/lib/embed-routes';
import { siteHref } from '@/lib/site';

type EmbedNavProps = {
  /** Slug of the page rendering this nav. Slugs are permanent. */
  current: string;
};

export function EmbedNav({ current }: EmbedNavProps) {
  const routes =
    embedRoutesByWeek.find((candidate) =>
      candidate.some((route) => route.slug === current),
    ) ?? embedRoutesByWeek[0];
  const position = routes.findIndex((route) => route.slug === current);
  const pageCount = routes.length;
  const pageWord = pageCount === 1 ? 'page' : 'pages';

  return (
    <nav aria-labelledby="embed-nav-title" className="embed-nav">
      <h2 className="embed-card-title" id="embed-nav-title">
        Where to go next
      </h2>
      <p>
        These {pageCount} {pageWord} are written to be read in this order. This
        is page {position + 1} of {pageCount}.
      </p>
      <ol className="embed-nav-list">
        {routes.map((route) => (
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
