[![npm](https://img.shields.io/npm/v/hubot-incoming-webhook.svg)](https://www.npmjs.com/package/hubot-incoming-webhook)
[![CI](https://github.com/67P/hubot-incoming-webhook/actions/workflows/ci.yml/badge.svg)](https://github.com/67P/hubot-incoming-webhook/actions/workflows/ci.yml)

# Hubot Incoming Webhook

A (very simple) hubot script for sending messages to a channel/room via HTTP
POST requests to your bot.

## Installation

Install script package in your bot's repository:

    npm install --save hubot-incoming-webhook

Add to `external_scripts.json`:

```json
[
  "hubot-incoming-webhook"
]
```

Set the `WEBHOOK_TOKEN` environment variable to a secret string of your choice
when running the bot. It is required at startup and will be used in the
incoming webhook URLs.

## Usage

### Generic hooks

The generic webhook allows you to send arbitrary messages to a room of your
choice, by POSTing a simple JSON body to the webhook URL.

The URL is constructed as follows:
`http(s)://<host>:<port>/incoming/<your-secret-token>`

| Key | Value |
| --- | ----- |
| room | (string) The room/channel you want to post to. |
| message | (string/array) The message you want to post. Can be an array for multiple lines. |

Example:

```sh
curl -X POST -H "Content-Type: application/json" \
     -d '{"room": "#kosmos", "message": "ohai"}' \
     http://127.0.0.1:8080/incoming/your-secret-token
```

A successful request responds with `200 {"ok":true}`. Missing or invalid
`room`/`message` respond with `422`; a malformed JSON payload responds with
`400`.

### UptimeRobot

This hook allows you to receive hooks from UptimeRobot, and announce your
account's uptime status changes/events in a room of your choice.

The URL is constructed as follows:
`http(s)://<host>:<port>/incoming/uptimerobot/<your-secret-token>`

In [UptimeRobot's settings](https://uptimerobot.com/dashboard#mySettings),
add the following webhook as an alert contact (you must set the room that you
want the bot to send messages to):

```
http(s)://<host>:<port>/incoming/uptimerobot/<your-secret-token>?room=ops@example.com&
```

Don't forget the trailing ampersand, this is required so UptimeRobot can add
their query strings to the request for the monitor ID, status, and so on.

Enable the webhook Alert Contact for each monitor. You can perform a
[bulk action](https://uptimerobot.com/dashboard#bulkActions) to do it for all
at once.

## Configuration

| Key | Description |
| --- | ----------- |
| `WEBHOOK_TOKEN` | A string for building your secret webhook URLs (required). |

## Adapter-specific config/hints

### IRC

Include the hash character for IRC channels in the `room` value.

### Mattermost (tested with hubot-matteruser)

Find the unique ID of the channel (not the display name) and use it for the `room` value.

## Development

### Tests

The tests are inside of the `test` folder. To run them:

    npm test

Lint the code with:

    npm run lint

