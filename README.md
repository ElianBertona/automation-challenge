[![End-to-End Tests (Strangerlist)](https://github.com/ElianBertona/automation-challenge/actions/workflows/main.yml/badge.svg)](https://github.com/ElianBertona/automation-challenge/actions/workflows/main.yml)

# Angular Strangerlist Automation Challenge

## Overview

This project contains an end-to-end (E2E) testing suite for the Strangerlist application. The solution has been architected following industry best practices, utilizing **WebdriverIO (v8+)**, **Node.js**, and **Docker** to ensure a consistent execution environment.

---

## Architecture and Strategy

To ensure test reliability in a concurrent execution environment and against an application with variable latency, the following technical solutions were implemented:

### 1. Design Pattern: Page Object Model (POM)

We implemented a decoupled architecture where:

- **Test logic** resides in specs
- **UI interaction** lives in pageobjects
- **Centralized dynamic selectors** allow locating elements (Edit/Delete buttons) within a specific list item context
- This prevents erroneous interactions with other rows

### 2. Unique Data Strategy

Since the application allows items with duplicate names:

- The framework generates unique identifiers based on **Date.now()**
- Each execution is independent and assertions validate exactly the record created by the current thread
- Avoids false positives from duplicate data

### 3. Synchronization and Robustness (Smart Waits)

To mitigate database latency (Heroku) and AngularJS animations, we use explicit waits:

- **waitForExist / waitForDisplayed** — Ensure elements are present before interaction
- **Reverse Waits** — Confirm elements have been removed from the DOM before deletion assertions
- **Scroll Management** — scrollIntoView prevents "element click intercepted" errors from the top navigation bar

### 4. Multi-device Execution

The framework validates user experience across two critical profiles:

- **Desktop** — 1920x1080 resolution
- **Mobile** — iPhone X emulation for list and form responsiveness

## Reporting & Continuous Integration

This project uses **GitHub Actions** for Continuous Testing.

- **Visual Dashboards:** Each execution generates a dynamic summary table directly in the GitHub Actions UI.
- **Cross-Platform Visualization:** Results are clearly labeled as **💻 Desktop** or **📱 Mobile**.
- **Evidence Collection:** If a test fails, screenshots and JUnit XML reports are automatically uploaded as job artifacts.

## Continuous Integration (CI) - No Setup Required

The easiest way to review the execution results is directly through **GitHub Actions**. You don't need to install Node.js or Docker locally to verify the project's status.

1. Go to the [**Actions**](https://github.com/ElianBertona/automation-challenge/actions) tab in this repository.
2. Select the most recent run (e.g., "fix main #20").
3. In the **Summary** section, you will find a **Visual Dashboard** with:
   - **Multi-platform results** (Desktop vs. Mobile).
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
│   └── main.yml               # CI/CD Pipeline configuration for GitHub Actions
├── assets/
│   └── test.jpg               # Image asset used for file upload testing
├── docs/
│   ├── evidence/              # Animated GIF evidence for reported defects
│   │   ├── bug_1.gif
│   │   ├── bug_2.gif
│   │   └── bug_3.gif
│   ├── BUGS.md                # Detailed Bug Reports and defect documentation
│   ├── TEST_CASES.md          # Traceability Matrix and step-by-step test scenarios
│   ├── TEST_PLAN.md           # Master Test Plan for the Release v1.0
│   └── USE_CASES.md           # Formal Functional Use Cases (Create, Edit, Delete)
├── errorShots/                # Automated screenshots captured on test failure
├── reports/                   # JUnit/Spec XML execution reports
├── test/
│   ├── pageobjects/
│   │   └── stranger.page.js   # Page Object Model (POM) abstraction layer
│   └── specs/
│       └── challenge.e2e.js   # End-to-End test suite definitions
├── docker-compose.yml         # Docker orchestration for headless execution
├── Dockerfile                 # Docker image configuration for the test environment
├── package.json               # Node.js dependencies and custom execution scripts
├── README.md                  # Main project documentation and setup instructions
└── wdio.conf.js               # WebdriverIO framework configuration settings
```
