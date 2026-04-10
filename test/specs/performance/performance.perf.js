describe("Performance Audit", () => {
    it("Lighthouse Performance Analysis", async () => {
        await browser.enablePerformanceAudits();
        await browser.url("/");

        const score = await browser.getPerformanceScore();
        const scorePercentage = (score * 100).toFixed(0);

        console.log(`PERFORMANCE SCORE: ${scorePercentage}/100`);
        console.log(`METRICS_START`);

        try {
            const metrics = await browser.getMetrics();
            
            const lcp = metrics && metrics.largestContentfulPaint ? (metrics.largestContentfulPaint / 1000).toFixed(2) + 's' : 'N/A';
            const tbt = metrics && metrics.totalBlockingTime ? metrics.totalBlockingTime.toFixed(0) + 'ms' : 'N/A';
            const cls = metrics && metrics.cumulativeLayoutShift ? metrics.cumulativeLayoutShift.toFixed(3) : 'N/A';

            console.log(`LCP: ${lcp}`);
            console.log(`TBT: ${tbt}`);
            console.log(`CLS: ${cls}`);
        } catch (error) {
            console.log(`Métricas detalladas no disponibles: ${error.message}`);
        }

        console.log(`METRICS_END`);

        expect(score).toBeGreaterThan(0.5);
    });
});