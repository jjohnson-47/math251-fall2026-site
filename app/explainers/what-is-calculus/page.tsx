import type { Metadata } from 'next';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import WhatIsCalculus from '@/content/what-is-calculus.mdx';
import { siteHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'What is calculus?',
  description:
    'Calculus is one limiting idea used twice: to make instantaneous change precise and to add changing pieces exactly.',
};

export default function WhatIsCalculusPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      <article>
        <header className="course-grid border-b border-foreground/10">
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
            <a
              className="text-link text-sm font-semibold"
              href={siteHref('/explainers/')}
            >
              ← All explainers
            </a>
            <p className="section-kicker mt-8">
              Explainer 01 · Came up in Week 1
            </p>
            <p className="mt-4 font-heading text-2xl italic text-muted-foreground sm:text-3xl">
              “What is calculus, and what will I be able to do?”
            </p>
            <h1 className="mt-6 max-w-5xl font-heading text-[clamp(3.4rem,8vw,7rem)] leading-[0.86] font-semibold tracking-[-0.055em] text-balance">
              Calculus is one limiting idea used twice.
            </h1>
            <p className="mt-7 text-sm font-semibold tracking-[0.02em] text-muted-foreground">
              Answered by Jeff · About 6 minutes
            </p>
          </div>
        </header>

        <div className="explainer-prose mx-auto max-w-3xl px-5 sm:px-8">
          <WhatIsCalculus />
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
