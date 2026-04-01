Angular Strangerlist Automation Challenge
This project contains an end-to-end (E2E) testing suite for the Strangerlist application. The solution has been architected following industry best practices, utilizing WebdriverIO (v8+), Node.js, and Docker to ensure a consistent execution environment.

Architecture and Strategy
To ensure test reliability in a concurrent execution environment and against an application with variable latency, the following technical solutions were implemented:

1. Design Pattern: Page Object Model (POM)
We implemented a decoupled architecture where test logic resides in specs and UI interaction in pageobjects. We introduced centralized dynamic selectors that allow locating elements (such as Edit/Delete buttons) within the context of a specific list item, preventing erroneous interactions with other rows.

2. Unique Data Strategy
Since the application allows items with duplicate names, the framework generates unique identifiers based on Date.now(). This ensures each execution is independent and assertions validate exactly the record created by the current thread, avoiding false positives.

3. Synchronization and Robustness (Smart Waits)
To mitigate database latency (Heroku) and AngularJS animations, we use explicit waits:

waitForExist / waitForDisplayed: To ensure elements are present before interaction.

Reverse Waits: To confirm that elements have been removed from the DOM before proceeding with deletion assertions.

Scroll Management: Use of scrollIntoView to prevent "element click intercepted" errors caused by the top navigation bar.

1. Multi-device Execution
The framework is configured to validate the user experience in two critical profiles:

Desktop: 1920x1080 resolution.

Mobile: iPhone X emulation to validate list and form responsiveness.

Prerequisites
Docker Desktop installed and running.

Node.js v18 or higher (only if running tests locally outside of containers).

Execution Instructions
1. Execution with Docker (Recommended)
This method ensures total portability by packaging Node.js, Headless Chrome, and all required dependencies.

Bash
docker-compose up --build automation-tests
2. Local Execution
If you choose to run outside of Docker, first install the project dependencies:

Bash
npm install
Then, use the scripts configured in package.json:

Run full suite (Desktop & Mobile): npm run test:all

Run Desktop only: npm run test:desktop

Run Mobile only: npm run test:mobile

Project Structure
test/specs/challenge.e2e.js: Test case definitions.

test/pageobjects/stranger.page.js: UI abstraction and action methods.

assets/: Static resource directory (images for upload).

wdio.conf.js: Global framework configuration and service orchestration.

Dockerfile & docker-compose.yml: Infrastructure as Code (IaC) definitions.