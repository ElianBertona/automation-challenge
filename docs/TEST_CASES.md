# Test Cases & Traceability Matrix

This document presents the detailed **Test Cases** designed for the Strangerlist application, serving as a traceability matrix that links each test scenario to its corresponding **Use Case** and **Bug Report**.

---

##  Main CRUD Flow (P0 - Critical Path)

| Test Case ID | Requirement / UC Reference | Test Title | Execution Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **UC-01 (Create)** | Create item with image and text | 1. Click "Choose File" and upload the `test.jpg` image.<br>2. In "Text" field, enter: *"Will is hunted by a strange entity"*.<br>3. Click "Create Item". | The item appears at the bottom of the list with the correct image and description. |
| **TC-02** | **UC-02 (Edit)** | Edit another existing item | 1. Locate an existing item (e.g., text *"MIKE PLAYS THE GUITAR"*).<br>2. Click the "Edit" button for that specific row.<br>3. Change text to: *"Mike plays the guitar in the basement"*.<br>4. Click "Update Item". | The text is successfully updated in the main grid. The original image remains unchanged. |
| **TC-03** | **UC-03 (Delete)** | Delete the item created | 1. Search the list for the item created in TC-01: *"Will is hunted by a strange entity"*.<br>2. Click the "Delete" button for that block.<br>3. In the "Warning" popup, press **"Yes, delete it!"**. | The item is removed from the UI.<br>The "List of items" count decreases by one. |

---

## Bug Verification Flow (Regression Path)

*These cases are designed to validate the fixes for the reported defects. If the issues are fixed, these test cases should **PASS**. Each case is linked to its detailed bug report for full traceability.*

| Test Case ID | Bug / Issue Reference | Test Title | Execution Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-06** | **[BUG-001](https://github.com/ElianBertona/automation-challenge/blob/main/docs/BUGS.md#1-bug-001-file-input-not-reset-after-successful-creation)** | Verify form reset after creation | 1. Click "Choose File" and upload the `test.jpg` image.<br>2. In "Text" field, enter valid text.<br>3. Click "Create Item".<br>4. After the list refreshes, check the "Choose File" input. | The "Choose File" input must be cleared (reset) and should not display the previous file name. |
| **TC-07** | **[BUG-002](https://github.com/ElianBertona/automation-challenge/blob/main/docs/BUGS.md#2-bug-002-update-image-functionality-not-working)** | Update image and text simultaneously | 1. Click "Edit" on an existing item.<br>2. Select a new image file and modify the text description.<br>3. Click "Update Item". | Both the image and the text should be successfully updated in the list and persisted in the database. |
| **TC-08** | **[BUG-003](https://github.com/ElianBertona/automation-challenge/blob/main/docs/BUGS.md#3-bug-003-missing-success-feedback-for-crud-operations)** | Verify success message feedback | 1. Perform any "Create" or "Edit" action.<br>2. Observe the UI immediately after clicking the submit button. | A clear success notification (e.g., "Item created!" or "Update successful!") should be displayed to the user. |

---

## Methodology Note
The automated test suite (implemented with **WebdriverIO**) executes a chain of **TC-01** -> **TC-02** -> **TC-03** in a single execution flow to ensure end-to-end reliability and proper cleanup of test data.