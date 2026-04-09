[![End-to-End Tests (Strangerlist)](https://github.com/ElianBertona/automation-challenge/actions/workflows/main.yml/badge.svg)](https://github.com/ElianBertona/automation-challenge/actions/workflows/main.yml)

# Angular Strangerlist Automation Challenge

## Overview

This project contains a **Production-Ready** end-to-end (E2E) testing suite for the Strangerlist application. The solution has been architected following industry best practices, utilizing **WebdriverIO (v8+)**, **Node.js**, and **Docker** to ensure a consistent, scalable, and observable execution environment.

---

## Architecture and Strategy

To ensure test reliability in a concurrent execution environment and against a public application with variable latency (Heroku), the following technical solutions were implemented:

### 1. Design Pattern: Advanced Page Object Model (POM)

We implemented a decoupled architecture where:
- **Test logic** resides in specs.
- **UI interaction** lives in pageobjects.
- **Centralized UI Mapping:** All selectors are isolated in a dedicated `stranger.map.js` object, separating the "what" from the "how".
- **Dynamic Selectors & XPath Axes:** We use **`ancestor::li`** to perform surgical interactions (Edit/Delete) within specific list item contexts, preventing fragile index-based testing or erroneous interactions with other rows.

### 2. Idempotency & Unique Data Strategy

Since the application allows items with duplicate names and lives in a shared environment:
- The framework generates unique identifiers based on **Date.now()**.
- Each execution is **idempotent**: tests can run repeatedly without side effects or data collisions.
- Assertions validate exactly the record created by the current execution thread, avoiding false positives from duplicate data.

### 3. Execution Strategy: Stability & Integrity

- **Sequential Execution (`maxInstances: 1`):** As we are testing against a single public instance with a shared database, we prioritized **Data Integrity** over parallel speed. This prevents race conditions where multiple threads might conflict while modifying the same resources simultaneously.
- **Synchronization and Robustness (Smart Waits):** We use explicit waits (`waitForExist`, `waitForDisplayed`) to mitigate database latency and AngularJS animations.
- **Reverse Waits:** Confirm elements have been removed from the DOM before deletion assertions.
- **Scroll Management:** `scrollIntoView` prevents "element click intercepted" errors from the top navigation bar.

### 4. Multi-Platform & Performance Auditing

The framework validates user experience across critical profiles:
- **💻 Desktop:** 1920x1080 resolution.
- **📱 Mobile:** iPhone X emulation with specific network/CPU throttling.
- **Performance Auditing:** Integrated **Lighthouse (via DevTools Service)** to capture real-world performance scores and core web vitals during the E2E flow.

---

## Reporting & Continuous Integration (CI)

This project uses **GitHub Actions** for Continuous Testing.

- **Visual Dashboards:** Each execution generates a dynamic summary table directly in the GitHub Actions UI (Step Summary).
- **Intelligence Reports:** Results are clearly labeled by platform (**💻 Desktop** vs **📱 Mobile**) and include **Performance Metrics**.
- **Evidence Collection:** Automated screenshots on failure and JUnit XML reports are automatically uploaded as job artifacts.

## Continuous Integration (CI) - No Setup Required 

The easiest way to review the execution results is directly through **GitHub Actions**. You don't need to install Node.js or Docker locally to verify the project's status.

1. Go to the [**Actions**](https://github.com/ElianBertona/automation-challenge/actions) tab in this repository.
2. Select the most recent run (e.g., "fix main #20").
3. In the **Summary** section, you will find a **Visual Dashboard** with:
   - **Multi-platform status** (Desktop vs. Mobile).
   - **Performance Scores** (Lighthouse Audit).
   - **Execution time** per test case.
   - **Success/Failure status** with emojis for quick scanning.
4. If a test fails, you can find the **Screenshots** in the "Artifacts" section at the bottom of the page.

---

## Quality Assurance Documentation

The following documents detail the testing strategy, requirements coverage, and identified defects:

- **[Test Plan](./docs/TEST_PLAN.md):** Overall strategy, scope, environment matrix, and risk mitigation.
- **[Use Cases](./docs/USE_CASES.md):** Formal functional requirements and acceptance criteria.
- **[Test Cases](./docs/TEST_CASES.md):** Detailed test scenarios and their mapping to requirements.
- **[Bug Reports](./docs/BUGS.md):** Detailed report of identified defects with animated evidence (GIFs).

---

## Prerequisites

- ✓ Docker Desktop installed and running
- ✓ Node.js v18 or higher (only if running tests locally outside containers)

---

## Execution Instructions

### With Docker (Recommended)

This method ensures total portability by packaging Node.js, Headless Chrome, and all dependencies.

```bash
docker-compose up --build automation-tests
```

### Local Execution

If running outside Docker, first install dependencies:

```bash
npm install
```

Then use the scripts configured in **package.json**:

- **npm run test:all** — Run full suite (Desktop & Mobile)
- **npm run test:desktop** — Run Desktop only
- **npm run test:mobile** — Run Mobile only

---

## Project Structure

```
AUTOMATION-CHALLENGE/
├── .github/workflows/
│   └── main.yml               # CI/CD Pipeline & Custom Dashboard Logic
├── assets/
│   └── test.jpg               # Image asset used for file upload testing
├── docs/
│   ├── evidence/              # Animated GIF evidence for reported defects
│   ├── BUGS.md                # Detailed Bug Reports
│   ├── TEST_CASES.md          # Traceability Matrix
│   ├── TEST_PLAN.md           # Master Test Plan
│   └── USE_CASES.md           # Functional Use Cases
├── errorShots/                # Screenshots captured on test failure
├── reports/                   # Execution reports
│   ├── json-results/          # WebdriverIO JSON output
│   ├── junit-results/         # JUnit XML for CI integration
│   └── perf-score.txt         # Lighthouse audit summary
├── scripts/
│   └── generate_report.js     # Logic for the GitHub Summary Dashboard
├── test/
│   ├── pageobjects/
│   │   └── stranger.page.js   # POM logic & workflows
│   ├── specs/
│   │   ├── challenge.e2e.js   # Functional CRUD test suite
│   │   └── performance.e2e.js # Automated Performance suite
│   └── uimaps/
│       └── stranger.map.js    # Centralized UI Selectors
├── .dockerignore
├── .gitignore
├── docker-compose.yml         # Docker orchestration
├── Dockerfile                 # Docker image configuration
├── package-lock.json
├── package.json               # Dependencies and custom scripts
├── README.md                  # Main documentation
└── wdio.conf.js               # WebdriverIO configuration
```
