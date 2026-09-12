import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

/**
 * The OTHER half of the paste-block contract: does `build/math_assets.py` still
 * produce what tests/fixtures/panel-blocks.json records?
 *
 * This one is local-only by nature and says so. `build/` is a different
 * repository and CI does not check it out, and the runner has no python3, so
 * this test cannot run there and does not pretend to. It skips with a reason
 * that names which of the two things was missing.
 *
 * That is not the same as papering over the problem. The JS side is checked
 * against this same fixture by tests/panel.test.ts, which needs no interpreter
 * and no sibling checkout and therefore always runs, in CI included. And
 * math_assets.assert_assets() makes the same fixture comparison from inside the
 * build repository, so a change to the Python fails THAT repository's own
 * checks. This file is the third leg: the one that catches a drift on a laptop
 * where both repositories are present, before it is committed.
 */
const mathAssets = fileURLToPath(
  new URL('../../build/math_assets.py', import.meta.url),
);
const fixturePath = fileURLToPath(
  new URL('fixtures/panel-blocks.json', import.meta.url),
);

/** The reason this cannot run here, naming what is absent, or false. */
function unavailable(): string | false {
  const probe = spawnSync('python3', ['--version'], { encoding: 'utf8' });

  if (probe.error) {
    return (
      'python3 is not on PATH. This half of the comparison needs an ' +
      'interpreter; the JS half runs without one in tests/panel.test.ts.'
    );
  }
  if (!existsSync(mathAssets)) {
    return (
      `build/math_assets.py was not found at ${mathAssets}. It lives in a ` +
      `different repository, which CI does not check out; the fixture in this ` +
      `repository is what stands in for it.`
    );
  }
  return false;
}

const skip = unavailable();

void test(
  'build/math_assets.py still matches the committed fixture (local only)',
  { skip },
  () => {
    const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as {
      slugs: string[];
      panel: Record<string, string>;
      panel_bare: Record<string, string>;
    };

    // Ask the authority for its output and compare it to what was recorded.
    // The comparison happens in JS, not in the Python, so a failure prints a
    // diff the way the rest of the suite does.
    const script = `
import json, sys
sys.path.insert(0, ${JSON.stringify(fileURLToPath(new URL('../../build/', import.meta.url)))})
import math_assets as M
print(json.dumps({
    "panel": {s: M.panel(s).strip() for s in ${JSON.stringify(fixture.slugs)}},
    "panel_bare": {s: M.panel_bare(s).strip() for s in ${JSON.stringify(fixture.slugs)}},
}))
`;
    const run = spawnSync('python3', ['-c', script], { encoding: 'utf8' });
    assert.equal(
      run.status,
      0,
      `math_assets.py did not run: ${run.stderr?.slice(0, 400)}`,
    );

    const actual = JSON.parse(run.stdout) as {
      panel: Record<string, string>;
      panel_bare: Record<string, string>;
    };

    for (const shape of ['panel', 'panel_bare'] as const) {
      for (const slug of fixture.slugs) {
        assert.equal(
          actual[shape][slug],
          fixture[shape][slug],
          `${slug}: build/math_assets.py ${shape}() has drifted from ` +
            `tests/fixtures/panel-blocks.json. Either the Python changed by ` +
            `accident, or the shape changed on purpose and the fixture needs ` +
            `regenerating and reviewing as a diff.`,
        );
      }
    }
  },
);
