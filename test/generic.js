'use strict';

const Helper = require('hubot-test-helper');
const { expect } = require('chai');
const request = require('supertest');

process.env.WEBHOOK_TOKEN = 'webhooktoken';

const helper = new Helper('../hooks/generic.js');

describe('Generic webhook', function () {
  beforeEach(function () {
    this.room = helper.createRoom();
  });

  afterEach(function () {
    this.room.destroy();
  });

  it('responds with status 200 and sends a message to the chosen room', async function () {
    const res = await request(this.room.robot.router)
      .post(`/incoming/${process.env.WEBHOOK_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: this.room.name, message: 'Good news everyone!' });

    expect(res.status).to.equal(200);
    expect(res.body).to.eql({ ok: true });
    expect(this.room.messages).to.eql([
      ['hubot', 'Good news everyone!'],
    ]);
  });

  it('sends each line when message is an array', async function () {
    const res = await request(this.room.robot.router)
      .post(`/incoming/${process.env.WEBHOOK_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: this.room.name, message: ['line one', 'line two'] });

    expect(res.status).to.equal(200);
    expect(this.room.messages).to.eql([
      ['hubot', 'line one'],
      ['hubot', 'line two'],
    ]);
  });

  it('responds with 422 when room is missing', async function () {
    const res = await request(this.room.robot.router)
      .post(`/incoming/${process.env.WEBHOOK_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ message: 'hello' });

    expect(res.status).to.equal(422);
    expect(this.room.messages).to.eql([]);
  });

  it('responds with 422 when message is missing', async function () {
    const res = await request(this.room.robot.router)
      .post(`/incoming/${process.env.WEBHOOK_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: this.room.name });

    expect(res.status).to.equal(422);
    expect(this.room.messages).to.eql([]);
  });

  it('responds with 422 when message is an unsupported type', async function () {
    const res = await request(this.room.robot.router)
      .post(`/incoming/${process.env.WEBHOOK_TOKEN}`)
      .set('Content-Type', 'application/json')
      .send({ room: this.room.name, message: 42 });

    expect(res.status).to.equal(422);
    expect(this.room.messages).to.eql([]);
  });

  it('accepts a form-encoded payload string', async function () {
    const payload = JSON.stringify({ room: this.room.name, message: 'via form' });
    const res = await request(this.room.robot.router)
      .post(`/incoming/${process.env.WEBHOOK_TOKEN}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`payload=${encodeURIComponent(payload)}`);

    expect(res.status).to.equal(200);
    expect(this.room.messages).to.eql([
      ['hubot', 'via form'],
    ]);
  });

  it('responds with 400 on invalid JSON payload', async function () {
    const res = await request(this.room.robot.router)
      .post(`/incoming/${process.env.WEBHOOK_TOKEN}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('payload={not json');

    expect(res.status).to.equal(400);
    expect(this.room.messages).to.eql([]);
  });

  it('responds with 404 for an unknown token', async function () {
    const res = await request(this.room.robot.router)
      .post('/incoming/wrong-token')
      .set('Content-Type', 'application/json')
      .send({ room: this.room.name, message: 'hello' });

    expect(res.status).to.equal(404);
    expect(this.room.messages).to.eql([]);
  });
});
