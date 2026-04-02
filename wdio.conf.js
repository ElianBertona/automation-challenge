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
        'spec', 
        ['junit', {
            outputDir: './reports',
            outputFileFormat: function(options) {
                return `results-${options.cid}.xml`
            }
        }]
    ],
  // ===================
  // Test Configurations
  // ===================
  logLevel: "info",
  bail: 0,
  baseUrl: "http://immense-hollows-74271.herokuapp.com/",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: "mocha",
  reporters: ["spec"],
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
      await browser.takeScreenshot();
    }
  },
};
