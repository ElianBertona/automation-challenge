import { expect } from '@wdio/globals';
import fs from 'fs'; 

describe('Stensul Performance Audit', () => {
    it('should capture performance score and save it for the dashboard', async () => {
        await browser.enablePerformanceAudits();
        await browser.url('/'); 
        
        const score = await browser.getPerformanceScore();
        const scorePercentage = (score * 100).toFixed(0);
        
        console.log(`PERFORMANCE SCORE: ${scorePercentage}/100`);

        if (!fs.existsSync('./reports')) {
            fs.mkdirSync('./reports');
        }
        fs.writeFileSync('./reports/perf-score.txt', scorePercentage);
        
        expect(score).toBeGreaterThan(0.5);
    });
});