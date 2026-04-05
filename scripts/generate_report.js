import fs from 'fs';
import path from 'path';

// Definimos las rutas relativas a la raíz del proyecto
const reportDir = './reports/json-results';
const perfFilePath = './reports/perf-score.txt';

let totalTests = 0;
let passed = 0;
let failed = 0;
let realPerfScore = "N/A";

console.log("--- Iniciando Generación de Dashboard ---");

if (fs.existsSync(reportDir)) {
    const files = fs.readdirSync(reportDir, { recursive: true })
                    .filter(file => typeof file === 'string' && file.endsWith('.json'));
    
    console.log(`Archivos JSON encontrados en ${reportDir}: ${files.length}`);

    files.forEach(file => {
        try {
            const filePath = path.join(reportDir, file);
            const rawData = fs.readFileSync(filePath, 'utf8');
            const content = JSON.parse(rawData);

            if (content.metrics) {
                totalTests += (content.metrics.tests || 0);
                passed += (content.metrics.passed || 0);
                failed += (content.metrics.failed || 0);
            }
        } catch (error) {
            console.error(`Error procesando el archivo ${file}:`, error.message);
        }
    });
} else {
    console.log(`⚠️ Advertencia: La carpeta de reportes ${reportDir} no existe.`);
}

if (fs.existsSync(perfFilePath)) {
    try {
        const score = fs.readFileSync(perfFilePath, 'utf8').trim();
        realPerfScore = `${score}/100`;
        console.log(`✅ Score de Performance cargado: ${realPerfScore}`);
    } catch (error) {
        console.error("Error leyendo perf-score.txt:", error.message);
    }
}

const passRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) : 0;

const summary = `
## Quality Intelligence Report
> *Data processed from real-time execution logs*

| Metric | Value |
| :--- | :--- |
| **Total Tests Executed** | ${totalTests} |
| **Pass Rate** | ${passRate}% ${passRate >= 100 ? '✅' : '⚠️'} |
| **Lighthouse Performance** | ${realPerfScore} 🚀 |
| **Tests Passed** | ${passed} |
| **Tests Failed** | ${failed} |

### 🔍 Analysis Insight:
${failed > 0 
    ? "❌ **Critical Alert:** Regressions detected. The current build does not meet the stability threshold." 
    : (totalTests === 0 ? "⚠️ **Warning:** No functional tests were detected. Check the Docker/WDIO execution logs." : "💎 **Stability Confirmed:** All functional checkpoints passed successfully.")}

---
*Environment: Production / Heroku | Generated: ${new Date().toLocaleString()}*
`;

if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
} else {
    console.log("\n" + summary);
}