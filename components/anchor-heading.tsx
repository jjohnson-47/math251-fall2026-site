'use client';

import { useState } from 'react';
import { Link2 } from 'lucide-react';

type AnchorHeadingProps = {
  anchor: string;
  children: string;
};

async function copyText(value: string) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard copy was unavailable');
  }

  await navigator.clipboard.writeText(value);
}

export function AnchorHeading({ anchor, children }: AnchorHeadingProps) {
  const [status, setStatus] = useState('');

  const copyAnchor = async () => {
    const url = new URL(window.location.href);
    url.hash = anchor;
    window.history.replaceState(null, '', url);

    try {
      await copyText(url.toString());
      setStatus('Link copied');
    } catch {
      setStatus('Section link opened; copy the address from your browser');
    }
  };

  return (
    <div className="anchor-heading group/anchor flex flex-wrap items-baseline gap-x-3 gap-y-2">
      <h2
        id={anchor}
        className="scroll-mt-28 font-heading text-4xl leading-[0.98] font-semibold tracking-[-0.035em] text-balance sm:text-5xl"
      >
        {children}
      </h2>
      <button
        type="button"
        className="anchor-chip inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-primary opacity-100 outline-none hover:bg-primary/7 focus:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/40 sm:opacity-0 sm:focus:opacity-100 sm:group-hover/anchor:opacity-100"
        onClick={copyAnchor}
        aria-label={`Copy a link to ${children}`}
      >
        <Link2 className="size-3.5" aria-hidden="true" />
        Copy link
      </button>
      <span className="sr-only" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
