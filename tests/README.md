# Aruba World browser harness

The Playwright test builds the add-on bundle, starts the static game server, and
runs the game in software-rendered headless Chromium at both `?q=low` and
`?q=high`.

Each quality run:

- fails on any `console.error` or uncaught page exception;
- controls car, motorcycle, walking, and plane modes for 30 seconds each;
- verifies that each mode moved; and
- writes deterministic screenshots for Noord, Palm Beach, Oranjestad, and
  Hooiberg to `tests/artifacts/screenshots/`.

Frame rate is intentionally not asserted because CI uses software rendering.

## Run locally

```bash
npm ci
npm ci --prefix addons
npx playwright install chromium
npm run test:e2e
```

Use `npm run test:e2e:headed` to watch the browser. Both commands rebuild the
game add-on bundle before testing.
