// Description:
//   Loads every hook in ./hooks as a hubot script.
//
// Commands:
//   None

import path from 'node:path';
import fs from 'node:fs';

export default function (robot) {
  const hooksPath = path.resolve(import.meta.dirname, 'hooks');

  fs.readdirSync(hooksPath)
    .filter((file) => file.endsWith('.js'))
    .sort()
    .forEach((file) => {
      robot.loadFile(hooksPath, file);
    });
}
