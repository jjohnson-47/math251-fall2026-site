import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { panel, panelBare } from '../scripts/blackboard/panel.mjs';

/**
 * The Blackboard paste block exists twice: once in `../build/math_assets.py`,
 * which is the authority, and once in `scripts/blackboard/panel.mjs`, because
 * the exporter runs in Node. Two implementations of one shape drift, and the
 * drift is invisible until a student sees it.
 *
 * This ran as a hand-typed command the day the JS copy was written, which is
 * the kind of check that passes once and is never run again. It is a test now.
 */
const ASSET_BASE = 'https://jjohnson-47.github.io/math251-fall2026-site';
const SLUGS = ['section-1-7', 'ivt-openstax', 'section-1-8'];
const buildDirectory = fileURLToPath(new URL('../../build/', import.meta.url));

function fromPython(functionName: string) {
  const script = `
import json, sys
sys.path.insert(0, '.')
import math_assets as M
print(json.dumps({s: M.${functionName}(s) for s in ${JSON.stringify(SLUGS)}}))
`;
  const stdout = execFileSync('python3', ['-c', script], {
    cwd: buildDirectory,
    encoding: 'utf8',
  });
  return JSON.parse(stdout) as Record<string, string>;
}

void test('panelBare matches math_assets.panel_bare byte for byte', () => {
  const python = fromPython('panel_bare');

  for (const slug of SLUGS) {
    assert.equal(
      panelBare(slug, ASSET_BASE).trim(),
      python[slug]?.trim(),
      `${slug}: the JS bare panel has drifted from math_assets.panel_bare`,
    );
  }
});

void test('panel still matches math_assets.panel byte for byte', () => {
  // The blurb-and-caption panel is retained and unchanged. Keeping this test
  // means the bare variant was added beside it rather than on top of it.
  const python = fromPython('panel');

  for (const slug of SLUGS) {
    assert.equal(
      panel(slug, ASSET_BASE).trim(),
      python[slug]?.trim(),
      `${slug}: the JS panel has drifted from math_assets.panel`,
    );
  }
});

void test('the bare block frames /bb/ and links to /embed/', () => {
  for (const slug of SLUGS) {
    const block = panelBare(slug, ASSET_BASE);

    assert.match(
      block,
      new RegExp(`<iframe src="${ASSET_BASE}/bb/${slug}/"`),
      `${slug}: the frame must point at the page designed for a frame`,
    );
    assert.match(
      block,
      new RegExp(`<a href="${ASSET_BASE}/embed/${slug}/"`),
      `${slug}: the bar must link to the full-screen page`,
    );
    // The order is load-bearing: a phone reader meets the way out before the
    // scroll region.
    assert.ok(block.indexOf('<a href=') < block.indexOf('<iframe'));
    // No prose. Deleted 2026-09-12: the blurb duplicated the page's opening
    // and the caption explained how an iframe works.
    assert.doesNotMatch(
      block,
      /<p\b/,
      `${slug}: the bare block carries no prose`,
    );
    assert.ok(
      Buffer.byteLength(block) < 1024,
      `${slug}: a bare block is a bar and a frame`,
    );
  }
});
