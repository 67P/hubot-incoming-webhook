// Description:
//   Accept incoming Webhooks to write messages to a room/channel
//
// Configuration:
//   WEBHOOK_TOKEN: A string for building your secret webhook URL
//
// Authors:
//   Sebastian Kippe <sebastian@kip.pe>
//   Greg Karékinian <greg@5apps.com>

(function () {
  "use strict";

  module.exports = function(robot) {
    var path = require("path");
    const hooksPath = path.resolve(__dirname, "hooks");

    require("fs").readdirSync(hooksPath).forEach(function(file) {
      robot.loadFile(hooksPath, file)
    });
  }
}());
