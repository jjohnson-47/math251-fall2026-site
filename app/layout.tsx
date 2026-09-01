import type { Metadata } from 'next';
import { Geist, Geist_Mono, Newsreader } from 'next/font/google';

import './globals.css';

const githubPagesBasePath = '/math251-fall2026-site';
const publicBasePath =
  process.env.GITHUB_PAGES === 'true' ? githubPagesBasePath : '';
const socialImageUrl =
  'https://jjohnson-47.github.io/math251-fall2026-site/og.png';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jjohnson-47.github.io/math251-fall2026-site/'),
  title: {
    default: 'MATH A251 · Calculus I · Fall 2026',
    template: '%s · MATH A251',
  },
  description:
    'The MATH A251 Calculus I course notebook: interactive experiments and explanations built from questions in this class.',
  applicationName: 'MATH A251 Course Notebook',
  openGraph: {
    type: 'website',
    title: 'MATH A251 · Calculus I · Fall 2026',
    description:
      'Run an experiment, squeeze two timing gates, and discover how calculus makes instantaneous change precise.',
    siteName: 'MATH A251 Course Notebook',
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: 'MATH A251 Calculus I Fall 2026 with a parabola, secant lines, and a tangent line',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MATH A251 · Calculus I · Fall 2026',
    description:
      'Run an experiment, squeeze two timing gates, and discover how calculus makes instantaneous change precise.',
    images: [socialImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href={`${publicBasePath}/mathjax/fonts/MathJax_Main-Regular.woff`}
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={`${publicBasePath}/mathjax/fonts/MathJax_Math-Italic.woff`}
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
