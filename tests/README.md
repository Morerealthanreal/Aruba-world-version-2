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

The LOW project also runs a Galaxy S24+-sized long-drive soak. It repeatedly
drives a full-island route after three warm-up loops, forces garbage collection at
each stop, returns to the same road pose for a brief settling window, and
records the JS heap, `renderer.info` geometry/texture totals, and
active event-listener count. The test fails on a browser error, crash, WebGL
context loss, lost controls, or continued resource growth. Its samples are
written to `soak-metrics.json` in the test output directory.

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

For focused local diagnostics, shorten or lengthen the soak with
`SOAK_STOP_MS`, `SOAK_SETTLE_MS`, `SOAK_WARMUP_CYCLES`, and
`SOAK_MEASURE_CYCLES`. The default is roughly five minutes plus game startup.
