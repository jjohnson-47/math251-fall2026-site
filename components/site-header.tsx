import { Badge } from '@/components/ui/badge';
import { siteHref } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="site-header relative z-30 border-b border-foreground/10 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <a
            href={siteHref('/')}
            className="group flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center border border-primary/20 bg-primary text-lg font-semibold text-primary-foreground shadow-[0_8px_24px_color-mix(in_oklch,var(--primary),transparent_72%)] transition-transform group-hover:-rotate-2"
            >
              ∫
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold tracking-[0.01em]">
                MATH A251 Course Notebook
              </span>
              <span className="block text-[0.66rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
                Calculus I · Fall 2026
              </span>
            </span>
          </a>

          <Badge
            variant="outline"
            className="hidden border-primary/20 bg-primary/6 text-primary sm:inline-flex"
          >
            Ungraded companion
          </Badge>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex min-h-11 items-center gap-5 overflow-x-auto border-t border-foreground/8 py-2 sm:absolute sm:top-0 sm:left-1/2 sm:h-16 sm:-translate-x-1/2 sm:border-0 sm:py-0"
        >
          <a className="nav-link shrink-0" href={siteHref('/play/')}>
            Play
          </a>
          <a className="nav-link shrink-0" href={siteHref('/explainers/')}>
            Explainers
          </a>
          <a
            className="nav-link shrink-0"
            href={siteHref('/explainers/what-is-calculus/#ask')}
          >
            Ask
          </a>
        </nav>
      </div>
    </header>
  );
}
