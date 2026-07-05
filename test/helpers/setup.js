'use strict';

const EventEmitter = require('events');

process.env.WEBHOOK_TOKEN = 'webhooktoken';
// Use random port for http server
process.env.EXPRESS_PORT = '0';

// Hides warnings, increase if necessary (more tests)
EventEmitter.defaultMaxListeners = 50;
