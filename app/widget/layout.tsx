import type { ReactNode } from 'react';

/**
 * The shell for a route that exists only to be framed.
 *
 * No masthead, no navigation, no prose beyond the widget's own labels. A widget
 * frame is sized to the widget and does not scroll, so every pixel spent here
 * is a pixel the interaction does not get. The words that explain what the
 * thing is live in the Blackboard block above the frame, where they render
 * natively and are readable before the frame loads.
 */
export default function WidgetLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <main className="widget-shell">{children}</main>;
}
