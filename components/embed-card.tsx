import type { ReactNode } from 'react';

type EmbedCardProps = {
  /** Id for the card heading, so the section is labelled by its own title. */
  anchor: string;
  /** Headings start with a word. Never an emoji: a screen reader reads it. */
  title: string;
  tone?: 'plain' | 'note' | 'warn';
  children: ReactNode;
};

export function EmbedCard({
  anchor,
  title,
  tone = 'plain',
  children,
}: EmbedCardProps) {
  return (
    <section
      className={`embed-card embed-card--${tone}`}
      aria-labelledby={anchor}
    >
      <h2 className="embed-card-title" id={anchor}>
        {title}
      </h2>
      {children}
    </section>
  );
}
