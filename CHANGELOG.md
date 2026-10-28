# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-07-05

### Changed
- **Breaking:** the package is now **ESM-only** (`"type": "module"`), and the
  minimum supported version is **Node.js 22** (was 20).
- **Breaking:** `hubot` is now a `peerDependency` (`>= 14`). Consumers must
  install hubot themselves (most already do).
- **Breaking:** HTTP responses now use correct status semantics and return a
  JSON body. Previously the status code was passed to `res.send()` as the body,
  which is broken on modern Express. Successful requests now respond with
  `200 { "ok": true }`; validation failures respond with `422` or `400` and a
  JSON error description.
- Upgrade `he` to 2.0.0 (ESM) for HTML entity decoding; replace the
  unmaintained `ent` dependency.
- Replace JSHint with ESLint (flat config) and `@stylistic/eslint-plugin`.
- Replace Travis CI with GitHub Actions, testing on Node.js 22 and 24.
- Modernize all source code: drop IIFEs, use `const`/arrow functions, strict
  validation, and proper error responses.
- The `hooks/` loader now only loads `.js` files (sorted), so editor swap files
  and other artifacts are no longer accidentally loaded as hubot scripts.
- Convert the test suite to the built-in `node:test` runner, driving hubot 14's
  `Robot`/`robot.router` with `supertest`; drop `mocha`, `chai` and
  `hubot-test-helper`.
- Add hubot documentation headers to both hooks so they register cleanly with
  hubot's help system (no more "deprecated documentation syntax" warning).
- The `WEBHOOK_TOKEN` environment variable is now validated at startup; the
  script throws instead of silently registering a `/incoming/undefined` route.

### Added
- Validation for the UptimeRobot hook: missing `room`, `monitorID`, or
  `alertTypeFriendlyName` now respond with `422` instead of producing a
  malformed message.
- Test coverage for: array messages, form-encoded `payload` bodies, invalid
  JSON, missing `room`/`message`, unsupported message types, unknown tokens,
  the hook loader, and UptimeRobot missing-parameter cases.
- `engines` field in `package.json` (`node >= 22`).
- `CHANGELOG.md`.

### Removed
- `.travis.yml` and `.jshintrc`.
- The `ent` dependency.
- `mocha`, `chai` and `hubot-test-helper` (replaced by `node:test`).

## [1.1.1] - 2018-03-28

- Last release before the 2.0.0 modernization.
