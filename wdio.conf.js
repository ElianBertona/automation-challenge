export const config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: "local",
  specs: ["./test/specs/**/*.js"],
  exclude: [],
  // ============
  // Capabilities
  // ============
  maxInstances: 1,
  capabilities: [
    {
      browserName: "chrome",
      "wdio:enviromentName": "Desktop",
      "goog:chromeOptions": {
        args: [
          "--headless",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--window-size=1920,1080",
        ],
      },
    },
    {
      browserName: "chrome",
      "wdio:enviromentName": "Mobile-iPhoneX",
      "goog:chromeOptions": {
        args: [
          "--headless",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
        mobileEmulation: { deviceName: "iPhone X" },
      },
    },
  ],
  reporters: [
    "spec",
    [
      "junit",
      {
        outputDir: "./reports/junit-results",
        outputFileFormat: function (options) {
          // Buscamos 'performance' de forma ultra segura
          const specs = options.specs || [];
          const isPerf = specs.some((s) => String(s).includes("perf"));

          const caps = options.capabilities || {};
          const isMobile = caps["goog:chromeOptions"]?.mobileEmulation || false;

          const type = isPerf ? "Perf" : "E2E";
          const plat = isMobile ? "Mobile" : "Desktop";

          return `results-${type}-${plat}-${options.cid || "default"}.xml`;
        },
        suiteNameFormat: function (options) {
          const specs = options.specs || [];
          const isPerf = specs.some((s) => String(s).includes("perf"));

          const caps = options.capabilities || {};
          const isMobile = caps["goog:chromeOptions"]?.mobileEmulation || false;

          const typeLabel = isPerf ? "⚡ PERFORMANCE" : "🛠️ E2E";
          const platLabel = isMobile ? "MOBILE" : "DESKTOP";
          const sName = options.suiteName || "Test Suite";

          return `[${platLabel}] ${typeLabel} - ${sName}`;
        },
        packageName: "StrangerList.Automation",
        errorOptions: {
          expected: "inline",
          actual: "inline",
        },
      },
    ],
    [
      "json",
      {
        outputDir: "./reports/json-results",
      },
    ],
  ],
  services: ["devtools"],
  strictSSL: false,
  // ===================
  // Test Configurations
  // ===================
  logLevel: "info",
  coloredLogs: true,
  screenshotPath: "./errorShots/",
  bail: 0,
  baseUrl: "http://immense-hollows-74271.herokuapp.com/",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
  // =====
  // Hooks
  // =====
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries },
  ) {
    if (!passed) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const cleanTitle = test.title.replace(/[^a-z0-9]/gi, "_");
      const fileName = `screenshot_${cleanTitle}_${timestamp}.png`;
      await browser.saveScreenshot(`./errorShots/${fileName}`);
      console.log(`--- Screenshot taken on failure: ${filepath} ---`);
    }
  },
  onComplete: function (exitCode, config, capabilities, results) {
    console.log("--- Tests Completed. Finalizing reports... ---");
    return new Promise((resolve) => setTimeout(resolve, 3000));
  },
};
