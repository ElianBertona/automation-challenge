import { expect } from "@wdio/globals";

// test/specs/performance/performance.perf.js
describe("Performance Audit", () => {
    it("Lighthouse Performance Analysis", async () => {
        await browser.enablePerformanceAudits();
        await browser.url("/");

        const score = await browser.getPerformanceScore();
        const scorePercentage = (score * 100).toFixed(0);

        // Guardamos el score en la carpeta que YA se está mapeando bien
        const fs = require('fs');
        const path = require('path');
        const dir = './reports';
        
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        // Escribimos el score en un TXT que el script de Node ya sabe leer
        fs.writeFileSync(path.join(dir, 'perf-score.txt'), scorePercentage.toString());

        console.log(`PERFORMANCE SCORE: ${scorePercentage}/100`);
        expect(score).toBeGreaterThan(0.5);
    });
});
