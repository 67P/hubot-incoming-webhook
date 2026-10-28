import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createRobot } from './helpers/robot.mjs';

const TOKEN = 'webhooktoken';

describe('UptimeRobot webhook', () => {
  let ctx;

  beforeEach(async () => {
    ctx = await createRobot();
    const hook = (await import('../hooks/uptimerobot.js')).default;
    hook(ctx.robot);
  });

  afterEach(async () => {
    await ctx.close();
  });

  it('responds with status 200 and sends a formatted message', async () => {
    const qs = new URLSearchParams({
      room: '#ops',
      monitorFriendlyName: 'Test &#40;staging&#41;',
      monitorID: '1234567',
      alertTypeFriendlyName: 'Down',
    }).toString();

    const res = await request(ctx.robot.router)
      .get(`/incoming/uptimerobot/${TOKEN}?${qs}`);

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true });
    assert.deepEqual(ctx.messages, [
      {
        room: '#ops',
        strings: ['[UptimeRobot] Test (staging) is down - https://uptimerobot.com/dashboard.php#1234567'],
      },
    ]);
  });

  it('responds with 422 when room is missing', async () => {
    const qs = new URLSearchParams({
      monitorFriendlyName: 'Test',
      monitorID: '1234567',
      alertTypeFriendlyName: 'Down',
    }).toString();

    const res = await request(ctx.robot.router)
      .get(`/incoming/uptimerobot/${TOKEN}?${qs}`);

    assert.equal(res.status, 422);
    assert.deepEqual(ctx.messages, []);
  });

  it('responds with 422 when room is not a string', async () => {
    const qs = new URLSearchParams();
    qs.append('room', 'a');
    qs.append('room', 'b');
    qs.append('monitorID', '1234567');
    qs.append('alertTypeFriendlyName', 'Down');

    const res = await request(ctx.robot.router)
      .get(`/incoming/uptimerobot/${TOKEN}?${qs.toString()}`);

    assert.equal(res.status, 422);
    assert.deepEqual(ctx.messages, []);
  });

  it('responds with status 200 without a monitor name', async () => {
    const qs = new URLSearchParams({
      room: '#ops',
      monitorID: '1234567',
      alertTypeFriendlyName: 'Down',
    }).toString();

    const res = await request(ctx.robot.router)
      .get(`/incoming/uptimerobot/${TOKEN}?${qs}`);

    assert.equal(res.status, 200);
    assert.deepEqual(ctx.messages, [
      {
        room: '#ops',
        strings: ['[UptimeRobot]  is down - https://uptimerobot.com/dashboard.php#1234567'],
      },
    ]);
  });

  it('responds with 422 when alertTypeFriendlyName is missing', async () => {
    const qs = new URLSearchParams({
      room: '#ops',
      monitorID: '1234567',
    }).toString();

    const res = await request(ctx.robot.router)
      .get(`/incoming/uptimerobot/${TOKEN}?${qs}`);

    assert.equal(res.status, 422);
    assert.deepEqual(ctx.messages, []);
  });

  it('responds with 422 when monitorID is missing', async () => {
    const qs = new URLSearchParams({
      room: '#ops',
      monitorFriendlyName: 'Test',
      alertTypeFriendlyName: 'Down',
    }).toString();

    const res = await request(ctx.robot.router)
      .get(`/incoming/uptimerobot/${TOKEN}?${qs}`);

    assert.equal(res.status, 422);
    assert.deepEqual(ctx.messages, []);
  });

  it('responds with 404 for an unknown token', async () => {
    const res = await request(ctx.robot.router)
      .get('/incoming/uptimerobot/wrong-token');

    assert.equal(res.status, 404);
    assert.deepEqual(ctx.messages, []);
  });
});
