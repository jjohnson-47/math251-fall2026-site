import assert from 'node:assert/strict';
import test from 'node:test';

import { siteHref } from '../lib/site.ts';

void test('worker routes omit trailing slashes', () => {
  const original = process.env.GITHUB_PAGES;
  delete process.env.GITHUB_PAGES;

  try {
    assert.equal(siteHref('/'), '/');
    assert.equal(siteHref('/play/'), '/play');
    assert.equal(
      siteHref('/explainers/what-is-calculus/#ask'),
      '/explainers/what-is-calculus#ask',
    );
  } finally {
    if (original === undefined) {
      delete process.env.GITHUB_PAGES;
    } else {
      process.env.GITHUB_PAGES = original;
    }
  }
});

void test('GitHub Pages routes include the repository base path', () => {
  const original = process.env.GITHUB_PAGES;
  process.env.GITHUB_PAGES = 'true';

  try {
    assert.equal(siteHref('/'), '/math251-fall2026-site/');
    assert.equal(siteHref('/play/'), '/math251-fall2026-site/play/');
    assert.equal(
      siteHref('/explainers/what-is-calculus/#ask'),
      '/math251-fall2026-site/explainers/what-is-calculus/#ask',
    );
  } finally {
    if (original === undefined) {
      delete process.env.GITHUB_PAGES;
    } else {
      process.env.GITHUB_PAGES = original;
    }
  }
});
