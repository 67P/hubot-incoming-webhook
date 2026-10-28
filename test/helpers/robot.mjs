import { Robot } from 'hubot';

// A random port for the HTTP server, and the token the hooks expect.
process.env.EXPRESS_PORT = '0';
process.env.WEBHOOK_TOKEN = 'webhooktoken';

// Build a hubot 14 robot with a real Express server (`robot.router`) and a stub
// adapter that records everything passed to `robot.messageRoom()`.
export async function createRobot() {
  const robot = new Robot('Shell', true, 'hubot');
  const messages = [];

  robot.adapter = {
    send(envelope, ...strings) {
      messages.push({ room: envelope.room, strings });
      return Promise.resolve();
    },
  };

  await robot.setupExpress();

  return {
    robot,
    messages,
    async close() {
      if (robot.server) {
        await new Promise((resolve) => robot.server.close(resolve));
      }
    },
  };
}
