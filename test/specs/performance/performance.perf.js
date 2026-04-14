// performance.perf.js
describe("Performance Audit", () => {
    it("Lighthouse Performance Analysis", async () => {
        await browser.enablePerformanceAudits();
        await browser.url("/");
        const score = await browser.getPerformanceScore();
        const metrics = await browser.getMetrics();

        const out = [
            `PERFORMANCE SCORE: ${(score * 100).toFixed(0)}`,
            `LCP: ${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`,
            `TBT: ${metrics.totalBlockingTime.toFixed(0)}ms`,
            `CLS: ${metrics.cumulativeLayoutShift.toFixed(3)}`
        ].join('\n');

        console.log(out);
        process.stdout.write(out + '\n'); // Doble seguridad

        expect(score).toBeGreaterThan(0.5);
    });
});