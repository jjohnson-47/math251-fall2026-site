import { siteHref } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10 bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-9 text-sm sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-10">
        <div>
          <p className="font-semibold tracking-[0.02em]">
            MATH A251 Course Notebook · Calculus I · Fall 2026
          </p>
          <p className="mt-2 max-w-2xl leading-6 text-background/68">
            Blackboard remains the authority for announcements, dates,
            deadlines, submissions, grades, and accommodations.
          </p>
        </div>
        <a
          href={siteHref('/explainers/')}
          className="w-fit rounded-sm font-semibold text-background/78 underline decoration-accent decoration-2 underline-offset-4 outline-none hover:text-background focus-visible:ring-3 focus-visible:ring-accent/45"
        >
          Read the notebook
        </a>
      </div>
    </footer>
  );
}
