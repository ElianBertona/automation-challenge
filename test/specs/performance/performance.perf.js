import fs from 'fs';
import path from 'path';

describe("Performance Audit", () => {
    it("Lighthouse Performance Analysis", async () => {
        await browser.enablePerformanceAudits();
        await browser.url("/");

        const score = await browser.getPerformanceScore();
        const scorePercentage = (score * 100).toFixed(0);

        const metrics = await browser.getMetrics();
        const { largestContentfulPaint, totalBlockingTime, cumulativeLayoutShift } = metrics;

        console.log(`PERFORMANCE SCORE: ${scorePercentage}/100`);
        console.log(`METRICS_START`);
        console.log(`LCP: ${(largestContentfulPaint / 1000).toFixed(2)}s`);
        console.log(`TBT: ${totalBlockingTime.toFixed(0)}ms`);
        console.log(`CLS: ${cumulativeLayoutShift.toFixed(3)}`);
        console.log(`METRICS_END`);

        expect(score).toBeGreaterThan(0.5);
    });
});