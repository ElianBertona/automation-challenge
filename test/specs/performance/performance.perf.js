import { expect } from "@wdio/globals";

describe("Performance Audit", () => {
    it("Lighthouse Performance Analysis", async () => {
        await browser.enablePerformanceAudits();
        await browser.url("/");

        const score = await browser.getPerformanceScore();
        const metrics = await browser.getMetrics(); // Obtiene LCP, TBT, etc.
        const scorePercentage = (score * 100).toFixed(0);

        // ESTO ES CRÍTICO: El script de Python busca estas palabras clave en los logs
        console.log(`PERFORMANCE SCORE: ${scorePercentage}/100`);
        console.log(`METRICS_START`);
        console.log(`Largest Contentful Paint: ${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`);
        console.log(`Total Blocking Time: ${metrics.totalBlockingTime}ms`);
        console.log(`Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)}`);
        console.log(`METRICS_END`);

        expect(score).toBeGreaterThan(0.5);
    });
});
