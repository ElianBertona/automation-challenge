import fs from 'fs';
import path from 'path';

const reportDir = './reports/json-results';
const perfFilePath = './reports/perf-score.txt';

let totalTests = 0, passed = 0, failed = 0;
let realPerfScore = "N/A";

console.log("--- Generating Advanced Quality Dashboard ---");

if (fs.existsSync(reportDir)) {
    const files = fs.readdirSync(reportDir, { recursive: true })
                    .filter(file => typeof file === 'string' && file.endsWith('.json'));
    
    files.forEach(file => {
        try {
            const content = JSON.parse(fs.readFileSync(path.join(reportDir, file), 'utf8'));
            if (content.metrics) {
                totalTests += (content.metrics.tests || 0);
                passed += (content.metrics.passed || 0);
                failed += (content.metrics.failed || 0);
            }
        } catch (e) {}
    });
}

if (fs.existsSync(perfFilePath)) {
    try {
        const score = fs.readFileSync(perfFilePath, 'utf8').trim();
        realPerfScore = isNaN(score) ? score : `${score}/100`;
    } catch (e) {}
}

const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) : 0;

const summary = `
# Quality Intelligence Dashboard

## SECTION 1: Functional E2E Analysis
> *Validation of Create, Edit, and Delete workflows*

| Metric | Status |
| :--- | :--- |
| **Total Test Cases** | ${totalTests} |
| **Pass Rate** | **${passRate}%** ${passRate >= 100 ? '✅' : '⚠️'} |
| **Success / Failure** | ${passed} ✅ / ${failed} ❌ |

---

## SECTION 2: Technical Performance Audit
> *Lighthouse engine analysis for Production environment*

| Metric | Score |
| :--- | :--- |
| **Performance Score** | **${realPerfScore}** |
| **Status** | ${realPerfScore !== "N/A" ? 'Audited 🛡️' : 'Skipped/Not Available 🧊'} |

---

## Executive Insights
${failed > 0 
    ? "❌ **Critical Alert:** Regressions detected in CRUD operations. Build stability is compromised." 
    : (totalTests === 0 ? "⚠️ **Data Gap:** No functional logs found. Review Docker volume sync." : "💎 **Stability Confirmed:** Core business logic is operating within expected parameters.")}

---
*Environment: Heroku-App | Generated: ${new Date().toLocaleString()}*
`;

// --- OUTPUT ---
if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
} else {
    console.log(summary);
}