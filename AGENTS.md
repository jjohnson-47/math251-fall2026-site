# Agent operating contract

This repository publishes a public learning companion for MATH A251 Calculus I, Fall 2026. Optimize for student understanding, mathematical correctness, accessibility, and small reversible changes.

## Authority and safety

- The course LMS is authoritative for announcements, dates, submissions, grades, accommodations, rosters, and student-specific information.
- Do not invent or copy time-sensitive course facts into this site. Add them only from a current, explicit instructor-provided source and record that source in the change description.
- This is a public repository. Never add student names, messages, grades, identifiers, analytics identifiers, credentials, secrets, private links, or copyrighted course-platform exports.
- Keep exploratory tools ungraded unless the instructor explicitly changes that contract.

## Product and content

- Lead with a useful learning action. Do not turn the home page into a marketing page or a link dump.
- Every interaction needs a concise learning purpose, usable initial state, keyboard and touch operation, visible focus, and a text explanation of the result.
- Do not communicate meaning by color alone. Graphs need a title, description, labels or legend, and a nonvisual summary.
- Prefer exact mathematical language. Test calculations and boundary cases in `tests/`; never infer a key from a visual alone.
- Use concrete student-facing language. Avoid developer jargon, fabricated testimonials, or motivational filler.

## Code boundaries

- Compose controls from `components/ui` before introducing another component library.
- Keep numerical or domain logic in `lib/` and presentation in `components/` or `app/`.
- Keep client components as small as practical. Use server components for static course content and route handlers for server-only integrations.
- Avoid runtime CDNs. Add a dependency only when it clearly improves a requested learning capability.
- Author equation-rich narrative in MDX. Use `$...$` or `$$...$$`; the build renders MathJax CHTML and assistive MathML, so never add a browser MathJax loader.
- Math links created with `\href` or `\class` need a nearby ordinary HTML link or explanation that provides the same destination for assistive-technology users.
- Preserve both deployment targets: `npm run build` for worker/API capability and `npm run build:pages` for the public static site.
- A public page must not depend on a server route without a meaningful static or error fallback.

## Definition of done

Run these before committing:

```bash
npm run check
npm run build
npm run build:pages
npm run verify:pages
```

For an interaction, also verify its initial math, at least one boundary case, keyboard behavior, labels, and responsive layout. Browser screenshots or manual LMS checks are separate evidence; do not claim them unless they were actually performed.

Keep commits focused and signed. In the change summary, state the student outcome, the evidence run, and any course facts that still require instructor or LMS confirmation.
