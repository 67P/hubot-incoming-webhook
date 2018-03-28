// Description:
//     Accept incoming Webhooks to write messages to a room/channel

(function () {
  "use strict";

  module.exports = function(robot) {

    robot.router.post('/incoming/'+process.env.WEBHOOK_TOKEN, (req, res) => {
      let data    = req.body.payload != null ? JSON.parse(req.body.payload) : req.body;
      let room    = data.room;
      let message = data.message;

      if (typeof room !== 'string' || typeof message === 'undefined') {
        res.send(422); return;
      }

      if (typeof message === 'string') {
        robot.messageRoom(room, message);
      } else if (message instanceof Array) {
        message.forEach(line => robot.messageRoom(room, line));
      }

      res.send(200);
    });
  };
}());
