import {
  ArrowDown,
  BookOpen,
  CheckCircle2,
  Compass,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

import { DerivativeLab } from '@/components/derivative-lab';
import { Badge } from '@/components/ui/badge';
import HomeMath from '@/content/home-math.mdx';

const studyLoop = [
  {
    step: '01',
    title: 'Notice',
    text: 'Name what is changing and what stays fixed.',
  },
  {
    step: '02',
    title: 'Try',
    text: 'Move a control, sketch a prediction, or test a value.',
  },
  {
    step: '03',
    title: 'Explain',
    text: 'Connect the graph, formula, units, and meaning.',
  },
  {
    step: '04',
    title: 'Check',
    text: 'Use a nearby case to see whether the idea still holds.',
  },
];

const learningPaths = [
  {
    icon: Compass,
    eyebrow: 'Explore',
    title: 'Interactive labs',
    text: 'Build intuition by changing one mathematical idea at a time.',
    status: 'Open now',
  },
  {
    icon: BookOpen,
    eyebrow: 'Practice',
    title: 'Worked examples',
    text: 'Follow the reasoning, then finish a nearby problem yourself.',
    status: 'Growing next',
  },
  {
    icon: CheckCircle2,
    eyebrow: 'Prepare',
    title: 'Short checks',
    text: 'Find the exact step that needs another look before class or an exam.',
    status: 'Growing next',
  },
];

export default function Home() {
  return (
    <main id="top" className="min-h-screen overflow-hidden">
      <header className="relative z-20 border-b border-foreground/10 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a
            href="#top"
            className="group flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-[0_8px_24px_color-mix(in_oklch,var(--primary),transparent_72%)] transition-transform group-hover:-rotate-2"
            >
              ∫
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.01em]">
                MATH A251
              </span>
              <span className="block text-[0.68rem] font-medium tracking-[0.11em] text-muted-foreground uppercase">
                Calculus I · Fall 2026
              </span>
            </span>
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 sm:flex"
          >
            <a className="nav-link" href="#explore">
              Explore
            </a>
            <a className="nav-link" href="#math-in-focus">
              Math
            </a>
            <a className="nav-link" href="#study-loop">
              Study loop
            </a>
            <a className="nav-link" href="#resources">
              Resources
            </a>
          </nav>

          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/6 text-primary"
          >
            Student home
          </Badge>
        </div>
      </header>

      <section className="course-grid relative border-b border-foreground/10">
        <div
          aria-hidden="true"
          className="absolute -top-28 right-[-12rem] size-[34rem] rounded-full bg-primary/9 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 left-[-10rem] size-[30rem] rounded-full bg-accent/12 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:px-10 lg:py-20">
          <div className="max-w-xl">
            <Badge className="mb-5 bg-accent text-accent-foreground shadow-sm">
              <Sparkles data-icon="inline-start" /> Practice first
            </Badge>
            <p className="mb-3 text-sm font-semibold tracking-[0.14em] text-primary uppercase">
              A home for mathematical experiments
            </p>
            <h1 className="font-heading text-[clamp(3.25rem,8vw,6.5rem)] leading-[0.86] font-semibold tracking-[-0.055em] text-balance">
              Calculus starts with{' '}
              <span className="relative inline-block text-primary">
                change.
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-2 left-0 h-3 w-full overflow-visible text-accent"
                  viewBox="0 0 220 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 C 42 2, 82 11, 120 5 S 184 4, 218 2"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="5"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Explore a graph, make a prediction, and connect the picture to the
              symbols. This course space will grow around the ideas we are
              learning together.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#explore"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_color-mix(in_oklch,var(--primary),transparent_72%)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/45"
              >
                Try the derivative lab
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
              <span className="text-sm leading-6 text-muted-foreground">
                No sign-in. No score. Just explore.
              </span>
            </div>
          </div>

          <div id="explore" className="scroll-mt-24">
            <DerivativeLab />
          </div>
        </div>
      </section>

      <HomeMath />

      <section
        id="study-loop"
        className="scroll-mt-20 border-b border-foreground/10 bg-card/52"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
            <div>
              <p className="section-kicker">A repeatable study loop</p>
              <h2 className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
                Do the math, then tell its story.
              </h2>
              <p className="mt-5 max-w-md leading-7 text-muted-foreground">
                Calculus gets more manageable when every new idea has a picture,
                a computation, and an explanation in plain language.
              </p>
            </div>

            <ol className="grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2">
              {studyLoop.map((item) => (
                <li key={item.step} className="bg-background p-6 sm:p-7">
                  <span className="font-mono text-xs font-semibold tracking-[0.12em] text-primary">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 max-w-xs leading-6 text-muted-foreground">
                    {item.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="resources" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent-foreground">
              <Lightbulb className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="section-kicker">Built around how you learn</p>
              <h2 className="mt-2 font-heading text-4xl leading-none font-semibold tracking-[-0.035em] sm:text-5xl">
                More than a list of links.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {learningPaths.map((path, index) => {
              const Icon = path.icon;

              return (
                <article
                  key={path.title}
                  className="group rounded-2xl border border-foreground/10 bg-card p-6 shadow-[0_16px_48px_rgb(27_38_54/5%)] transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_22px_56px_rgb(27_38_54/9%)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      {path.status}
                    </Badge>
                  </div>
                  <p className="mt-8 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                    {path.eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
                    {path.title}
                  </h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {path.text}
                  </p>
                </article>
              );
            })}
          </div>

          <aside className="mt-10 rounded-2xl border border-primary/15 bg-primary/[0.055] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <p className="font-semibold">
                Keep the official course space nearby.
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Announcements, deadlines, submissions, and grades remain in the
                course LMS. This site is the place to explore and practice.
              </p>
            </div>
            <Badge
              variant="outline"
              className="mt-4 border-primary/20 bg-background/75 text-primary sm:mt-0"
            >
              Practice companion
            </Badge>
          </aside>
        </div>
      </section>

      <footer className="border-t border-foreground/10 bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p className="font-semibold tracking-[0.02em]">
            MATH A251 · Calculus I · Fall 2026
          </p>
          <p className="text-background/65">
            Curiosity first. Clear reasoning always.
          </p>
        </div>
      </footer>
    </main>
  );
}
