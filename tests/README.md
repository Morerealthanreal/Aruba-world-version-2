# Aruba World browser harness

The Playwright test builds the add-on bundle, starts the static game server, and
runs the game in software-rendered headless Chromium at both `?q=low` and
`?q=high`.

Each quality run:

- fails on any `console.error` or uncaught page exception;
- controls car, motorcycle, walking, and plane modes for 30 seconds each;
- verifies that each mode moved; and
- writes deterministic rendered-canvas screenshots for Noord, Palm Beach,
  Oranjestad, and Hooiberg into its unique
  `tests/artifacts/runs/<run-id>/` output tree.

Frame rate is intentionally not asserted because CI uses software rendering.
Local runs do not record traces. CI records a trace only on the retry after an
initial failure, avoiding trace-finalization errors on successful browser close.

## Run locally

```bash
npm ci
npm ci --prefix addons
npx playwright install chromium
npm run test:e2e
```

Use `npm run test:e2e:headed` to watch the browser. Both commands rebuild the
game add-on bundle before testing. Set `PLAYWRIGHT_RUN_ID` to give an invocation
a recognizable artifact directory name; otherwise a timestamp and process ID
are used.
