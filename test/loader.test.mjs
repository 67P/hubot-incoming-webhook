import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import loadHooks from '../index.js';

describe('hook loader', () => {
  it('loads only .js hooks, sorted', () => {
    const loaded = [];
    const robot = {
      loadFile(dir, file) {
        loaded.push(file);
      },
    };

    loadHooks(robot);

    assert.deepEqual(loaded, ['generic.js', 'uptimerobot.js']);
  });
});
