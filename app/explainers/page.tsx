import type { Metadata } from 'next';
import { Mail } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { explainerRequestHref, siteHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Explainers',
  description:
    'Short MATH A251 explanations that begin with questions from this class.',
};

const explainers = [
  {
    number: '01',
    status: 'Available',
    question: 'What is calculus, and what will I be able to do?',
    summary:
      'How one limiting idea becomes instantaneous change, accumulation, and the Fundamental Theorems.',
    provenance: 'From our Week 1 discussion · Approximately 6 minutes',
    href: '/explainers/what-is-calculus/',
  },
  {
    number: '02',
    status: 'In preparation',
    question:
      '“How does finding the instantaneous slope of a curve lead down to spacetime being bent like water?”',
    summary:
      'The path from local change to geometry, and where calculus is only the beginning of the answer.',
    provenance: 'Asked in MATH A251 · In preparation',
    href: null,
  },
] as const;

export default function ExplainersPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      <header className="course-grid border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-18">
          <p className="section-kicker">Explainers</p>
          <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3.4rem,9vw,7rem)] leading-[0.86] font-semibold tracking-[-0.055em] text-balance">
            Explanations based on questions from MATH A251.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            These notes respond to questions raised in MATH A251. Each one
            develops a single idea and connects it to our course and textbook.
          </p>
        </div>
      </header>

      <section aria-labelledby="explainer-list-title">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <h2 id="explainer-list-title" className="sr-only">
            Explainer list
          </h2>
          <div className="border-t-2 border-foreground/70">
            {explainers.map((item, index) => (
              <article
                key={item.number}
                className="grid gap-4 border-b border-foreground/15 py-7 sm:grid-cols-[4rem_7rem_1fr] sm:gap-6 sm:py-9"
              >
                <p className="font-mono text-sm font-bold text-muted-foreground">
                  {item.number}
                </p>
                <div>
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
                <div className="max-w-3xl">
                  <h2 className="font-heading text-3xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-4xl">
                    {item.href ? (
                      <a
                        className="rounded-sm underline decoration-primary/30 decoration-2 underline-offset-4 outline-none hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                        href={siteHref(item.href)}
                      >
                        {item.question}
                      </a>
                    ) : (
                      item.question
                    )}
                  </h2>
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {item.summary}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.provenance}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="ask"
        className="border-t border-foreground/10 bg-card/45"
        aria-labelledby="explainer-ask-title"
      >
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:px-10 lg:py-16">
          <div className="max-w-2xl">
            <p className="section-kicker">Request an explanation</p>
            <h2
              id="explainer-ask-title"
              className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.035em]"
            >
              Tell me which step is unclear.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              I will add explanations as questions arise. If a question affects
              work that is currently due, please say so in your message.
              Deadlines, grades, and submissions all stay in Blackboard.
            </p>
          </div>
          <a
            href={explainerRequestHref}
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-primary px-5 font-semibold text-primary-foreground outline-none hover:bg-primary/88 focus-visible:ring-3 focus-visible:ring-ring/45"
          >
            <Mail className="size-4" aria-hidden="true" />
            Email me a question
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
