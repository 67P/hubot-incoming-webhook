'use strict';

require('./helpers/setup');

const Helper = require('hubot-test-helper');
const { expect } = require('chai');
const request = require('supertest');

const helper = new Helper('../hooks/uptimerobot.js');

describe('UptimeRobot webhook', function () {
  beforeEach(function () {
    this.room = helper.createRoom();
  });

  afterEach(function () {
    this.room.destroy();
  });

  it('responds with status 200 and sends a formatted message', async function () {
    const qs = new URLSearchParams({
      room: this.room.name,
      monitorFriendlyName: 'Test &#40;staging&#41;',
      monitorID: '1234567',
      alertTypeFriendlyName: 'Down',
    }).toString();

    const res = await request(this.room.robot.router)
      .get(`/incoming/uptimerobot/${process.env.WEBHOOK_TOKEN}?${qs}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.eql({ ok: true });
    expect(this.room.messages).to.eql([
      ['hubot', '[UptimeRobot] Test (staging) is down - https://uptimerobot.com/dashboard.php#1234567'],
    ]);
  });

  it('responds with 422 when room is missing', async function () {
    const qs = new URLSearchParams({
      monitorFriendlyName: 'Test',
      monitorID: '1234567',
      alertTypeFriendlyName: 'Down',
    }).toString();

    const res = await request(this.room.robot.router)
      .get(`/incoming/uptimerobot/${process.env.WEBHOOK_TOKEN}?${qs}`);

    expect(res.status).to.equal(422);
    expect(this.room.messages).to.eql([]);
  });

  it('responds with 422 when monitorID is missing', async function () {
    const qs = new URLSearchParams({
      room: this.room.name,
      monitorFriendlyName: 'Test',
      alertTypeFriendlyName: 'Down',
    }).toString();

    const res = await request(this.room.robot.router)
      .get(`/incoming/uptimerobot/${process.env.WEBHOOK_TOKEN}?${qs}`);

    expect(res.status).to.equal(422);
    expect(this.room.messages).to.eql([]);
  });

  it('responds with 404 for an unknown token', async function () {
    const res = await request(this.room.robot.router)
      .get('/incoming/uptimerobot/wrong-token');

    expect(res.status).to.equal(404);
    expect(this.room.messages).to.eql([]);
  });
});
