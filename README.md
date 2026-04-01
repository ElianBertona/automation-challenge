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
├── test/
│   ├── specs/
│   │   └── challenge.e2e.js          Test case definitions
│   └── pageobjects/
│       └── stranger.page.js           UI abstraction and action methods
├── assets/                            Static resources (upload images)
├── wdio.conf.js                       Framework configuration & services
├── Dockerfile                         Container definition
├── docker-compose.yml                 Infrastructure as Code (IaC)
└── package.json                       Dependencies & scripts
```