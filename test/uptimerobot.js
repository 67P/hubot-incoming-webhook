"use strict";

const Helper = require('hubot-test-helper')
const expect = require('chai').expect;
const http = require('http');

process.env.EXPRESS_PORT = 18080
process.env.WEBHOOK_TOKEN = "webhooktoken"

const helper = new Helper('../hooks/uptimerobot.js')

describe('UptimeRobot webhook', function() {
  beforeEach(function(done) {
    this.room = helper.createRoom();
    const queryStrings = `room=${this.room.name}&monitorFriendlyName=Test+%26%2340%3Bstaging%26%2341%3B&monitorID=1234567&alertTypeFriendlyName=Down`
    const hook_uri = `http://localhost:${process.env.EXPRESS_PORT}/incoming/uptimerobot/${process.env.WEBHOOK_TOKEN}?${queryStrings}`;
    http.get(hook_uri, response => {
      this.response = response;
      done();
    }).on('error', done);
  });

  afterEach(function() {
    this.room.destroy();
  });

  it('responds with status 200', function() {
    expect(this.response.statusCode).to.equal(200);
  });

  it('sends a message to the chosen room', function() {
    const expected_messages = [
      [
        "hubot",
        "[UptimeRobot] Test (staging) is down - https://uptimerobot.com/dashboard.php#1234567"
      ]
    ]
    expect(this.room.messages).to.eql(expected_messages);
  });

});

