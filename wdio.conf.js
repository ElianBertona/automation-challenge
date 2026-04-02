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
            // Esto creará nombres claros: results-Desktop.xml o results-Mobile.xml
            const platform = options.capabilities['goog:chromeOptions']?.mobileEmulation ? 'Mobile' : 'Desktop';
            return `results-${platform}.xml`
        }
    }]
    ],
  // ===================
  // Test Configurations
  // ===================
  logLevel: "debug",
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
  afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const filepath = `./errorShots/screenshot_${test.title.replace(/\s+/g, '_')}_${timestamp}.png`;
            
            await browser.saveScreenshot(filepath);
            console.log(`--- Screenshot taken on failure: ${filepath} ---`);
        }
    },
    onComplete: function(exitCode, config, capabilities, results) {
        console.log('--- Tests Completed. Finalizing reports... ---');
        return new Promise(resolve => setTimeout(resolve, 3000)); 
    },
};
