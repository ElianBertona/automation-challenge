import { expect } from "@wdio/globals";
import fs from "fs";

describe("Performance Audit", () => {
  it("Overall Performance Score: ${Math.round(score * 100)}/100`", async () => {
    await browser.enablePerformanceAudits();
    await browser.url("/");

    const score = await browser.getPerformanceScore();
    const scorePercentage = (score * 100).toFixed(0);

    console.log(`PERFORMANCE SCORE: ${scorePercentage}/100`);

    if (!fs.existsSync("./reports")) {
      fs.mkdirSync("./reports");
    }
    fs.writeFileSync("./reports/perf-score.txt", scorePercentage);

    expect(score).toBeGreaterThan(0.5);
  });
});
