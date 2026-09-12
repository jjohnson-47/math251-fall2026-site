import type { ReactNode } from 'react';

import { siteHref } from '@/lib/site';

/**
 * The shell for routes published into a Blackboard Ultra Document.
 *
 * No `SiteHeader`, no `SiteFooter`. These pages are read inside a fixed 720px
 * panel, and a header and a footer inside that panel spend the reading budget
 * on chrome: the first block of real prose has to begin within 288px of the
 * top at 1100px width, which a site header alone can exhaust. The masthead
 * below is one line, and the same page has to read well at full width because
 * the link out of the panel lands on this exact URL.
 */
export default function EmbedLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="embed-shell">
      <div className="embed-masthead">
        <span className="embed-masthead-course">MATH A251 · Calculus I</span>
        <a
          className="embed-masthead-link"
          href={siteHref('/')}
          rel="noopener"
          target="_top"
        >
          Course notebook
        </a>
      </div>
      <main className="embed-main">{children}</main>
    </div>
  );
}
