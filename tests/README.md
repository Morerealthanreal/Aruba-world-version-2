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

`hud-layout.spec.js` boots the game once as a touch phone and walks through
360-412 px wide portrait and landscape viewports, each with and without notch /
gesture-bar safe areas (emulated through CDP), in every travel mode. It fails
if any visible HUD element overlaps another or leaves the safe area, if a touch
control is smaller than 44 CSS px, or if the minimap is too small, blurry or
over-labelled.

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
