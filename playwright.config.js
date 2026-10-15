import { defineConfig } from "@playwright/test";
import path from "node:path";

const requestedRunId =
  process.env.PLAYWRIGHT_RUN_ID ||
  `${new Date().toISOString().replaceAll(":", "-")}-${process.pid}`;
const runId = requestedRunId.replace(/[^a-zA-Z0-9._-]/g, "-");
const runOutputDir = path.join("tests", "artifacts", "runs", runId);

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  fullyParallel: true,
  timeout: 8 * 60 * 1000,
  expect: {
    timeout: 15 * 1000,
  },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // SwiftShader is CPU-heavy; run projects sequentially on one machine.
  // GitHub Actions parallelizes low/high as separate matrix jobs.
  workers: 1,
  reporter: process.env.CI
    ? [
        ["line"],
        [
          "html",
          { outputFolder: path.join(runOutputDir, "report"), open: "never" },
        ],
      ]
    : "line",
  outputDir: path.join(runOutputDir, "test-results"),
  use: {
    baseURL: "http://127.0.0.1:8777",
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15 * 1000,
    navigationTimeout: 120 * 1000,
    // Local runs have no retries, so this records nothing. In CI, a trace is
    // recorded only for the retry after an initial failure.
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    launchOptions: {
      args: [
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
        "--disable-gpu-sandbox",
      ],
    },
  },
  projects: [
    { name: "low", metadata: { quality: "low" } },
    { name: "high", metadata: { quality: "high" } },
  ],
  webServer: {
    command:
      "python3 -m http.server 8777 --bind 127.0.0.1 --directory game",
    url: "http://127.0.0.1:8777/",
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },
});
