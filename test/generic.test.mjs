import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createRobot } from './helpers/robot.mjs';

const TOKEN = 'webhooktoken';

describe('Generic webhook', () => {
  let ctx;

  beforeEach(async () => {
    ctx = await createRobot();
    const hook = (await import('../hooks/generic.js')).default;
    hook(ctx.robot);
  });

  afterEach(async () => {
    await ctx.close();
  });

  it('responds with status 200 and sends a message to the chosen room', async () => {
    const res = await request(ctx.robot.router)
      .post(`/incoming/${TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: '#kosmos', message: 'Good news everyone!' });

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { ok: true });
    assert.deepEqual(ctx.messages, [
      { room: '#kosmos', strings: ['Good news everyone!'] },
    ]);
  });

  it('sends each line when message is an array', async () => {
    const res = await request(ctx.robot.router)
      .post(`/incoming/${TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: '#kosmos', message: ['line one', 'line two'] });

    assert.equal(res.status, 200);
    assert.deepEqual(ctx.messages, [
      { room: '#kosmos', strings: ['line one'] },
      { room: '#kosmos', strings: ['line two'] },
    ]);
  });

  it('responds with 422 when room is missing', async () => {
    const res = await request(ctx.robot.router)
      .post(`/incoming/${TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ message: 'hello' });

    assert.equal(res.status, 422);
    assert.deepEqual(ctx.messages, []);
  });

  it('responds with 422 when message is missing', async () => {
    const res = await request(ctx.robot.router)
      .post(`/incoming/${TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: '#kosmos' });

    assert.equal(res.status, 422);
    assert.deepEqual(ctx.messages, []);
  });

  it('responds with 422 when message is an unsupported type', async () => {
    const res = await request(ctx.robot.router)
      .post(`/incoming/${TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: '#kosmos', message: 42 });

    assert.equal(res.status, 422);
    assert.deepEqual(ctx.messages, []);
  });

  it('accepts a form-encoded payload string', async () => {
    const payload = JSON.stringify({ room: '#kosmos', message: 'via form' });
    const res = await request(ctx.robot.router)
      .post(`/incoming/${TOKEN}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`payload=${encodeURIComponent(payload)}`);

    assert.equal(res.status, 200);
    assert.deepEqual(ctx.messages, [
      { room: '#kosmos', strings: ['via form'] },
    ]);
  });

  it('responds with 400 on invalid JSON payload', async () => {
    const res = await request(ctx.robot.router)
      .post(`/incoming/${TOKEN}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('payload={not json');

    assert.equal(res.status, 400);
    assert.deepEqual(ctx.messages, []);
  });

  it('responds with 404 for an unknown token', async () => {
    const res = await request(ctx.robot.router)
      .post('/incoming/wrong-token')
      .set('Content-Type', 'application/json')
      .send({ room: '#kosmos', message: 'hello' });

    assert.equal(res.status, 404);
    assert.deepEqual(ctx.messages, []);
  });
});
