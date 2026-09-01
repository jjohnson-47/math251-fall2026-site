import type { Metadata } from 'next';

import { BallGateLab } from '@/components/ball-gate-lab';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import GateAbstraction from '@/content/gate-abstraction.mdx';
import { activeCalculusSectionOneOne, siteHref } from '@/lib/site';

export const metadata: Metadata = {
  title: 'The ball and the gates',
  description:
    'Measure average velocity, squeeze two timing gates together, and discover an instantaneous rate of change.',
};

export default function PlayPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      <header className="course-grid border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          <a className="text-link text-sm font-semibold" href={siteHref('/')}>
            ← Back to the notebook
          </a>
          <p className="section-kicker mt-8">Play · Stage A / B / C</p>
          <h1 className="mt-3 max-w-4xl font-heading text-[clamp(3.2rem,8vw,6.6rem)] leading-[0.88] font-semibold tracking-[-0.055em] text-balance">
            Can two clocks measure one instant?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Put down two gates and run the ball. Change the gap before you read
            the explanation below it.
          </p>
        </div>
      </header>

      <section className="border-b border-foreground/10 bg-card/38">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          <BallGateLab />

          <ol className="mt-8 grid gap-px overflow-hidden border border-foreground/12 bg-foreground/12 md:grid-cols-3">
            <li className="bg-background p-5 sm:p-6">
              <p className="font-mono text-xs font-bold tracking-[0.12em] text-primary">
                A · MEASURE ONE AVERAGE
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                Start at 25 → 100. The answer describes the whole interval,
                honestly, but not any one moment.
              </p>
            </li>
            <li className="bg-background p-5 sm:p-6">
              <p className="font-mono text-xs font-bold tracking-[0.12em] text-primary">
                B · SQUEEZE THE GATES
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                Try 25 → 36, then 25 → 30.25. Every gap gives a different
                average.
              </p>
            </li>
            <li className="bg-background p-5 sm:p-6">
              <p className="font-mono text-xs font-bold tracking-[0.12em] text-primary">
                C · CLOSE IN
              </p>
              <p className="mt-3 leading-7 text-muted-foreground">
                Keep narrowing. The gates never meet, but the readout settles
                near one number.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <GateAbstraction />

      <section className="border-b border-foreground/10 bg-card/42">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="section-kicker">Keep going</p>
          <h2 className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.035em] text-balance">
            The book begins with this question too.
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Read{' '}
            <a className="text-link" href={activeCalculusSectionOneOne}>
              Active Calculus §1.1, “How do we measure velocity?”
            </a>{' '}
            for the same move with position functions, tables, and graphs.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
