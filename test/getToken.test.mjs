import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { getToken as genericGetToken } from '../hooks/generic.js';
import { getToken as uptimerobotGetToken } from '../hooks/uptimerobot.js';

const hooks = {
  generic: genericGetToken,
  uptimerobot: uptimerobotGetToken,
};

describe('getToken()', () => {
  const original = process.env.WEBHOOK_TOKEN;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.WEBHOOK_TOKEN;
    } else {
      process.env.WEBHOOK_TOKEN = original;
    }
  });

  for (const [name, getToken] of Object.entries(hooks)) {
    describe(name, () => {
      it('returns the token when set', () => {
        process.env.WEBHOOK_TOKEN = 'secret';
        assert.equal(getToken(), 'secret');
      });

      it('throws when unset', () => {
        delete process.env.WEBHOOK_TOKEN;
        assert.throws(() => getToken(), /WEBHOOK_TOKEN environment variable must be set/);
      });

      it('throws when empty', () => {
        process.env.WEBHOOK_TOKEN = '';
        assert.throws(() => getToken(), /WEBHOOK_TOKEN environment variable must be set/);
      });
    });
  }
});
