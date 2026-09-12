import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { panel, panelBare } from '../scripts/blackboard/panel.mjs';

/**
 * The Blackboard paste block exists twice: in `../build/math_assets.py`, which
 * is the authority, and in `scripts/blackboard/panel.mjs`, because the exporter
 * runs in Node. Two implementations of one shape drift, and the drift is
 * invisible until a student sees it.
 *
 * WHY A FIXTURE AND NOT A SUBPROCESS
 * ----------------------------------
 * The first version of this test spawned `python3` and imported math_assets
 * from the sibling repository. That can only ever pass on one laptop. The
 * GitHub runner has no python3 and does not check out `build/`, so this file
 * failed, `npm run check` failed, `build:pages` never ran, no artifact
 * uploaded, and Pages went on serving the previous commit while `/bb/` looked
 * published. A test that needs a neighbouring repository is not a test of this
 * repository.
 *
 * So the expected output is committed HERE, in tests/fixtures/panel-blocks.json,
 * generated once from math_assets.py and then treated as the contract. This
 * file compares the JS against it: no subprocess, no interpreter, no sibling
 * checkout, and therefore it runs everywhere including CI.
 *
 * The Python side is checked against the SAME fixture by
 * tests/panel-python-parity.test.ts, which is allowed to skip when python3 or
 * the sibling repository is absent, because that half genuinely cannot run in
 * CI. Between the two, neither implementation can move without something going
 * red somewhere.
 */
const fixture = JSON.parse(
  readFileSync(new URL('fixtures/panel-blocks.json', import.meta.url), 'utf8'),
) as {
  asset_base: string;
  panel_px: number;
  slugs: string[];
  panel: Record<string, string>;
  panel_bare: Record<string, string>;
};

const builders = {
  panel,
  panel_bare: panelBare,
} as const;

void test('the fixture covers every slug in both shapes', () => {
  // A fixture that quietly lost an entry would make the loops below pass by
  // iterating nothing, which is the failure mode this whole file exists to
  // avoid.
  assert.deepEqual(fixture.slugs, [
    'section-1-7',
    'ivt-openstax',
    'section-1-8',
  ]);

  for (const shape of ['panel', 'panel_bare'] as const) {
    assert.deepEqual(
      Object.keys(fixture[shape]).sort(),
      [...fixture.slugs].sort(),
      `the fixture's ${shape} entry does not cover exactly the recorded slugs`,
    );
    for (const slug of fixture.slugs) {
      assert.ok(
        fixture[shape][slug]?.includes('<iframe'),
        `${shape}/${slug}: the fixture does not look like a paste block`,
      );
    }
  }
});

for (const [shape, build] of Object.entries(builders)) {
  void test(`${shape} matches the committed fixture, byte for byte`, () => {
    for (const slug of fixture.slugs) {
      assert.equal(
        build(slug, fixture.asset_base).trim(),
        fixture[shape as 'panel' | 'panel_bare'][slug],
        `${slug}: scripts/blackboard/panel.mjs has drifted from ` +
          `tests/fixtures/panel-blocks.json for ${shape}(). Either the JS is ` +
          `wrong, or the shape changed on purpose and the fixture needs ` +
          `regenerating from build/math_assets.py and reviewing as a diff.`,
      );
    }
  });
}

void test('the bare block frames /bb/ and links to /embed/', () => {
  for (const slug of fixture.slugs) {
    const block = panelBare(slug, fixture.asset_base);

    assert.match(
      block,
      new RegExp(`<iframe src="${fixture.asset_base}/bb/${slug}/"`),
      `${slug}: the frame must point at the page designed for a frame`,
    );
    assert.match(
      block,
      new RegExp(`<a href="${fixture.asset_base}/embed/${slug}/"`),
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
    assert.ok(
      block.includes(`height:${fixture.panel_px}px`),
      `${slug}: the frame must be ${fixture.panel_px}px`,
    );
  }
});
