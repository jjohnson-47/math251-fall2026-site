import type { ReactNode } from 'react';

/**
 * The shell for a page that lives inside a Blackboard Ultra Document.
 *
 * `app/embed/<slug>/` and `app/bb/<slug>/` render the same MDX. The difference
 * is where each is read. The embed route is the full-screen page and keeps its
 * masthead and its h1; this one is what the Document's iframe points at, and
 * the goal is that a student cannot tell where Blackboard ends and the frame
 * begins.
 *
 * So: no masthead, no footer, no course label, and no h1 — the Document title
 * already carries the title, and repeating it spends the top of a 720px panel
 * saying nothing. The h1 is dropped at render by the page's own components map
 * rather than hidden with CSS, so it is genuinely absent from the markup and
 * the first heading on the page is a card's h2.
 *
 * Light, always, and not as a preference: it sits on a white Blackboard page.
 * See `.bb-shell` in globals.css for how the theme tokens are pinned.
 */
export default function BlackboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bb-shell">
      <main className="embed-main">{children}</main>
    </div>
  );
}
