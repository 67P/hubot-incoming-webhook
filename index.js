'use strict';

const path = require('path');
const fs = require('fs');

module.exports = function (robot) {
  const hooksPath = path.resolve(__dirname, 'hooks');

  fs.readdirSync(hooksPath)
    .filter((file) => file.endsWith('.js'))
    .sort()
    .forEach((file) => {
      robot.loadFile(hooksPath, file);
    });
};
