'use strict';

// Description:
//   Forward UptimeRobot alert webhooks to a chat room.
//   Add the room attribute to your hook, e.g.
//   https://example.com/incoming/uptimerobot/secret?room=ops@example.com&
//   (the trailing ampersand is required so UptimeRobot can append its params).
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

  robot.router.get(`/incoming/uptimerobot/${token}`, (req, res) => {
    const room = req.query.room;
    const monitorName = he.decode(req.query.monitorFriendlyName || '');
    const monitorID = req.query.monitorID;
    const alertType = (req.query.alertTypeFriendlyName || '').toLowerCase();

    if (!room || typeof room !== 'string') {
      res.status(422).json({ error: 'Missing "room" query parameter.' });
      return;
    }
    if (!monitorID || !alertType) {
      res.status(422).json({ error: 'Missing required UptimeRobot query parameters.' });
      return;
    }

    const checkURL = `https://uptimerobot.com/dashboard.php#${monitorID}`;
    const message = `[UptimeRobot] ${monitorName} is ${alertType} - ${checkURL}`;

    robot.messageRoom(room, message);

    res.status(200).json({ ok: true });
  });
};

module.exports.getToken = getToken;
module.exports.decodeHtml = he.decode;
