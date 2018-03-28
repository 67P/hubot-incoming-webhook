"use strict";

const Helper = require('hubot-test-helper')
const expect = require('chai').expect;
const http = require('http');

process.env.EXPRESS_PORT = 18080
process.env.WEBHOOK_TOKEN = "webhooktoken"

const helper = new Helper('../hooks/generic.js')

describe('Generic webhook', function() {
  beforeEach(function(done) {
    this.room = helper.createRoom();
    const payload = JSON.stringify({ "room": this.room.name, "message": "Good news everyone!" });
    const options = {
      hostname: "localhost",
      port: process.env.EXPRESS_PORT,
      path: `/incoming/${process.env.WEBHOOK_TOKEN}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, response => {
      this.response = response;
      done();
    }).on('error', done);

    req.write(payload);
    req.end();
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
        "Good news everyone!"
      ]
    ]
    expect(this.room.messages).to.eql(expected_messages);
  });

});

