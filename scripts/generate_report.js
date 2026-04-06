import fs from "fs";
import path from "path";

const reportDir = "./reports/json-results";
const perfFilePath = "./reports/perf-score.txt";

let totalTests = 0;
let passed = 0;
let failed = 0;
let skipped = 0;
let realPerfScore = "N/A";

console.log("--- 🛠️  Generating Intelligence Dashboard ---");

if (fs.existsSync(reportDir)) {
  const files = fs
    .readdirSync(reportDir, { recursive: true })
    .filter((file) => typeof file === "string" && file.endsWith(".json"));
  console.log(`Processing ${files.length} JSON files from ${reportDir}...`);

  files.forEach((file) => {
    try {
      const filePath = path.join(reportDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

      if (content.suites) {
        const processSuite = (suite) => {
          if (suite.tests) {
            suite.tests.forEach((test) => {
              totalTests++;
              if (test.state === "passed" || test.status === "passed") passed++;
              else if (test.state === "failed" || test.status === "failed")
                failed++;
              else skipped++;
            });
          }
          if (suite.suites) {
            suite.suites.forEach(processSuite);
          }
        };
        content.suites.forEach(processSuite);
      } else if (content.state && content.state.passed !== undefined) {
        totalTests += content.state.tests || 0;
        passed += content.state.passed || 0;
        failed += content.state.failed || 0;
        skipped += content.state.skipped || 0;
      } else if (content.metrics) {
        totalTests += content.metrics.tests || 0;
        passed += content.metrics.passed || 0;
        failed += content.metrics.failed || 0;
      }
    } catch (error) {}
  });
} else {
  console.warn(`⚠️ Warning: Folder ${reportDir} not found.`);
}

if (fs.existsSync(perfFilePath)) {
  try {
    const score = fs.readFileSync(perfFilePath, "utf8").trim();
    realPerfScore = isNaN(score) ? score : `${score}/100`;
  } catch (e) {}
}

const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) : 0;

const summary = `
#  Quality Intelligence Dashboard

## SECTION 1: Functional E2E Analysis
> *StrangerList CRUD Operations (Create, Edit, Delete)*

| Metric | Status |
| :--- | :--- |
| **Total Test Cases** | ${totalTests} |
| **Pass Rate** | **${passRate}%** ${passRate >= 100 ? "✅" : "⚠️"} |
| **Results** | ${passed} ✅ / ${failed} ❌ ${skipped > 0 ? `/ ${skipped} ⏭️` : ""} |

---

## SECTION 2: Technical Performance Audit
> *Lighthouse Web Vitals analysis for Production Environment*

| Metric | Score |
| :--- | :--- |
| **Performance Score** | **${realPerfScore}** |
| **Status** | ${realPerfScore !== "N/A" ? "Audited 🛡️" : "Skipped/Not Available 🧊"} |

---

## Executive Insights
${
  failed > 0
    ? "❌ **Critical Alert:** Regressions detected in E2E flows. The current build does not meet the stability threshold."
    : totalTests === 0
      ? "⚠️ **Data Gap:** No functional logs detected. Ensure Docker volumes are correctly synced."
      : "💎 **Stability Confirmed:** All functional checkpoints passed successfully."
}

---
*Environment: Production / Heroku | Generated: ${new Date().toLocaleString()}*
`;

// --- OUTPUT ---
if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
} else {
  console.log(summary);
}
