'use strict';

// Description:
//   Accept incoming webhooks to write messages to a room/channel.
//
// Configuration:
//   WEBHOOK_TOKEN - A string for building your secret webhook URL.
//
// Authors:
//   Kosmos Contributors <mail@kosmos.org>

const he = require('he');

function getToken() {
  const token = process.env.WEBHOOK_TOKEN;
  if (!token || typeof token !== 'string') {
    throw new Error(
      'hubot-incoming-webhook: the WEBHOOK_TOKEN environment variable must be set to a non-empty string.'
    );
  }
  return token;
}

module.exports = function (robot) {
  const token = getToken();

  robot.router.post(`/incoming/${token}`, (req, res) => {
    let data;
    try {
      data = (req.body.payload != null)
        ? JSON.parse(req.body.payload)
        : req.body;
    } catch {
      res.status(400).json({ error: 'Invalid JSON payload.' });
      return;
    }

    const room = data.room;
    const message = data.message;

    if (typeof room !== 'string' || room.length === 0 || typeof message === 'undefined') {
      res.status(422).json({ error: 'Missing or invalid "room" or "message".' });
      return;
    }

    if (typeof message === 'string') {
      robot.messageRoom(room, message);
    } else if (Array.isArray(message)) {
      message.forEach((line) => robot.messageRoom(room, line));
    } else {
      res.status(422).json({ error: '"message" must be a string or an array of strings.' });
      return;
    }

    res.status(200).json({ ok: true });
  });
};

// Exported for tests / reuse
module.exports.getToken = getToken;
module.exports.decodeHtml = he.decode;
