// Description:
//   Send a message from a UptimeRobot webhook
//   You need to add the room attribute to your hook (for example
//   ops@muc.example.com)
//
//   Example UptimeRobot webhook (the ampersand is required):
//   https://example.com/incoming/uptimerobot/secret?room=ops@example.com&

(function () {
  "use strict";

  var html_decode = require("ent/decode");

  module.exports = function(robot) {
    robot.router.get('/incoming/uptimerobot/'+ process.env.WEBHOOK_TOKEN, (request, response) => {
      const room = request.query.room;
      const monitorName = html_decode(request.query.monitorFriendlyName);
      const checkURL = 'https://uptimerobot.com/dashboard.php#' + request.query.monitorID;
      const alertType = request.query.alertTypeFriendlyName.toLowerCase();
      const message = `[UptimeRobot] ${monitorName} is ${alertType} - ${checkURL}`;

      robot.messageRoom(room, message);

      response.send(200);
    });

  };
}());
