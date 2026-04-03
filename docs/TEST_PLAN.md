# Test Plan: Strangerlist Release v1.0

This document defines the testing strategy for the **Create** and **Edit** features. The primary objective is to ensure data persistence, successful multi-format image uploads, and UI responsiveness.

---

## 1. Introduction and Objective
The goal is to validate core functionalities while mitigating risks associated with the shared production-like environment (Heroku). We focus on reliability across Desktop and Mobile platforms.

## 2. Scope of Testing

### 2.1 In Scope (Functional)
* **Create Feature:**
    * Validation of form fields (Textarea and File Input).
    * Support for `.jpg`, `.jpeg`, and `.png` (Recommended size: 320px x 320px).
    * Verification of list updates after successful creation.
    * Handling of special characters and long-form text (up to 300 characters).
* **Edit Feature:**
    * Modification of the "Story" text for existing records.
    * Verification of the "Update Item" trigger and PUT request.
    * Ensuring the original image remains unchanged after a text-only edit.

### 2.2 Out of Scope
* **Delete Feature:** Excluded from the current release deliverables.
* **Authentication:** The application is public; session testing is excluded.
* **Global Counters:** Automated validation of total counts is excluded due to the high volatility of the shared environment.

---

## 3. Test Strategy 

### 3.1 Automated Testing (Sanity & Regression)
* **Targeted CRUD Flow:** Automating the *Create -> Verify -> Edit -> Verify* sequence using unique identifiers (`Date.now()`) to isolate session data.
* **Cross-Browser Headless:** Execution via **Docker** to ensure consistency between Local and CI/CD (Linux-based) environments.
* **Resilience Testing:** Implementation of **Smart Waits** (`waitForDisplayed`) to handle server latency and "cold start" behaviors.

### 3.2 Manual Testing (UX & Edge Cases)
* **Boundary Value Analysis:** Testing the "Story" field with 1 character vs. the maximum allowed.
* **Invalid File Uploads:** Attempting to upload `.pdf` or `.exe` files to verify error handling.
* **Visual Regression:** Manual check of "Edit" button alignment on small mobile screens.

---

## 4. Test Environment & Configuration

### 4.1 Browser Matrix (Desktop)
| Browser | Version | OS | Priority |
| :--- | :--- | :--- | :--- |
| **Google Chrome** | Latest | Linux (Docker) / Win 11 | P0 (Critical) |
| **Mozilla Firefox** | Latest | Windows 11 | P1 (High) |
| **Microsoft Edge** | Latest | Windows 11 | P2 (Medium) |

### 4.2 Mobile Device Matrix
| Device | OS Version | Browser | Type |
| :--- | :--- | :--- | :--- |
| **iPhone 15 Pro** | iOS 17.x | Safari | Physical / Manual |
| **Samsung Galaxy S23** | Android 14 | Chrome | Physical / Manual |
| **iPhone X (Emulated)** | N/A | Chrome DevTools | **Automated** |

---

## 5. Test Schedule & Milestones
| Phase | Activity | Duration | Owner |
| :--- | :--- | :--- | :--- |
| **Planning** | Test Plan & Scenario Design | 1 Day | QA Lead |
| **Execution (Manual)** | Exploratory & Boundary Testing | 1.5 Days | QA Engineer |
| **Execution (Auto)** | Regression Suite in CI/CD | 0.5 Days | QA Automation |
| **Reporting** | Defect Triage & Summary | 0.5 Days | QA Team |

---

## 6. Manual vs. Automated Test Cases

### **Manual Testing (The "Edge" Cases)**
* **UI Layout:** Verify that the "Add Image" button doesn't overlap the text area on small screens (iPhone SE).
* **File Formats:** Attempt to upload invalid files (PDF, SVG) to verify error message handling.
* **Network Latency:** Test behavior on "3G Throttled" connections to ensure loaders are visible.

### **Automated Testing (The "Core" Cases)**
* **CRUD Workflow:** Create -> Verify; Edit -> Verify (Repeated across Desktop/Mobile).
* **Data Integrity:** Verify specific unique strings appear in the list after creation.
* **Navigation:** Ensure the application navigates correctly between Create and Edit views.

---

## 7. Entrance and Exit Criteria 

### 7.1 Entrance Criteria
* Code is deployed to the QA/Staging environment.
* Test Data (images, strings) is ready.
* The automation environment (Docker) is stable.

### 7.2 Exit Criteria
* 100% of P0 and P1 test cases executed.
* **Zero** "Blocker" or "Critical" bugs open.
* Regression suite passes 100% in a clean Docker run.

---

## 8. Risk and Mitigation
* **Risk:** XPath selectors break due to UI changes.
    * *Mitigation:* Use of relative XPaths and `ancestor::` axis in Page Objects.
* **Risk:** Shared Environment Data (Other users editing our items).
    * *Mitigation:* Tests use high-precision unique strings to interact only with session-specific data.
* **Risk:** Heroku Latency (Timeouts).
    * *Mitigation:* `waitforTimeout` increased to 10 seconds in `wdio.conf.js`.

---

## 9. Bug Severity Criteria
* **Blocker:** Unable to create an item (System crash).
* **Critical:** Item created but not persisted after page refresh.
* **Major:** Edit button not clickable on Mobile view.
* **Minor:** Text truncation issues on very long stories.