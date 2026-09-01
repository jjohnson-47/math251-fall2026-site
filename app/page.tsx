import { ArrowDown, ArrowRight, Mail } from 'lucide-react';

import { BallGateLab } from '@/components/ball-gate-lab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import GateAbstraction from '@/content/gate-abstraction.mdx';
import { explainerRequestHref, siteHref } from '@/lib/site';

const questions = [
  {
    state: 'Available',
    question: 'What is calculus, and what will I be able to do?',
    provenance: 'From our Week 1 discussion · Approximately 6 minutes',
    href: '/explainers/what-is-calculus/',
  },
  {
    state: 'In preparation',
    question:
      '“How does finding the instantaneous slope of a curve lead down to spacetime being bent like water?”',
    provenance: 'Asked in MATH A251 · In preparation',
    href: null,
  },
] as const;

export default function Home() {
  return (
    <main id="top" className="min-h-screen overflow-hidden">
      <SiteHeader />

      <section className="course-grid relative border-b border-foreground/10">
        <div
          aria-hidden="true"
          className="absolute -top-36 right-[-16rem] size-[38rem] rounded-full bg-primary/8 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-5 pt-12 pb-10 sm:px-8 sm:pt-16 lg:px-10 lg:pt-18">
          <div className="max-w-4xl">
            <p className="section-kicker">Questions from this class</p>
            <h1 className="mt-4 max-w-4xl font-heading text-[clamp(3rem,8vw,6.7rem)] leading-[0.88] font-semibold tracking-[-0.055em] text-balance">
              What is calculus, and what will I be able to do?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              This came up more than once in our first week, and the syllabus
              does not answer it.
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              This notebook began in Week 1. Everything on it is here because
              someone in this class asked for it, so it starts small. That is
              the idea.
            </p>
            <a
              href="#playfield"
              className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_color-mix(in_oklch,var(--primary),transparent_72%)] outline-none hover:bg-primary/88 focus-visible:ring-3 focus-visible:ring-ring/45"
            >
              Begin with the experiment
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="playfield"
        aria-labelledby="playfield-heading"
        className="scroll-mt-24 border-b border-foreground/10 bg-card/38"
      >
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-18">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Begin with the experiment</p>
              <h2
                id="playfield-heading"
                className="mt-2 font-heading text-4xl leading-none font-semibold tracking-[-0.035em] text-balance sm:text-5xl"
              >
                Put two gates on the track.
              </h2>
            </div>
            <Badge
              variant="outline"
              className="h-7 border-accent/50 bg-accent/13 text-accent-foreground"
            >
              Optional practice · no submission required
            </Badge>
          </div>
          <p className="mb-8 max-w-2xl text-base leading-7 text-muted-foreground">
            This activity is not graded, and the site does not record your work.
            Experiment freely: run the ball, squeeze the gates, and watch the
            sequence in the log.
          </p>
          <BallGateLab />
          <div className="mt-7 text-right">
            <a
              className="text-link inline-flex min-h-11 items-center gap-2 px-1 font-semibold"
              href={siteHref('/play/')}
            >
              Open the full experiment
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <GateAbstraction />

      <section
        id="questions"
        aria-labelledby="questions-title"
        className="border-b border-foreground/10 bg-card/42"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14">
            <div>
              <p className="section-kicker">The question ledger</p>
              <h2
                id="questions-title"
                className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.035em] text-balance sm:text-5xl"
              >
                Questions from this course
              </h2>
              <p className="mt-5 max-w-md leading-7 text-muted-foreground">
                A row appears because a real question was asked. Questions may
                be paraphrased; they are never invented.
              </p>
            </div>

            <div className="question-ledger border-t-2 border-foreground/70">
              {questions.map((item, index) => (
                <article
                  key={item.question}
                  className="grid gap-3 border-b border-foreground/15 py-5 sm:grid-cols-[5.5rem_1fr] sm:gap-5"
                >
                  <div>
                    <Badge
                      variant={index === 0 ? 'default' : 'secondary'}
                      className="h-6"
                    >
                      {item.state}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl leading-tight font-semibold tracking-[-0.02em]">
                      {item.href ? (
                        <a
                          className="rounded-sm underline decoration-primary/35 decoration-2 underline-offset-4 outline-none hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                          href={siteHref(item.href)}
                        >
                          {item.question}
                        </a>
                      ) : (
                        item.question
                      )}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.provenance}
                    </p>
                  </div>
                </article>
              ))}
              <p className="py-5 text-sm leading-6 text-muted-foreground">
                There are {questions.length} entries so far. I will add to this
                list as questions arise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="ask" aria-labelledby="ask-title">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-10 lg:py-18">
          <div className="max-w-3xl">
            <p className="section-kicker">Request an explanation</p>
            <h2
              id="ask-title"
              className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.035em] text-balance sm:text-5xl"
            >
              Tell me which step is unclear.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
              This page exists because the question kept coming up. Send the
              next one and I can answer it once for everyone. Deadlines, grades,
              and submissions all stay in Blackboard.
            </p>
            <p className="mt-4 font-heading text-xl italic text-foreground/75">
              — Jeff
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
