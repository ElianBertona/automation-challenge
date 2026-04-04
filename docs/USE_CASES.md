# Use Cases - Strangerlist Automation Challenge

This document outlines the functional behavior of the application through formal Use Case definitions. These scenarios served as the foundation for the automated test suite.

---

## UC-01: Create Item with Image and Description

**Actor:** User  
**Description:** Allows the user to create a new item, including an image and a text description.

### **Preconditions**

- The user is on the main list screen.
- The system is available.
- A valid image file is accessible.

### **Main Flow**

1.  The user selects an image file.
    - _System validates file type and size._
2.  The user enters a unique description.
    - _System validates input format and uniqueness._
3.  The user submits the item.
    - _System uploads the image and stores the item._
4.  The system refreshes the list.
    - _The new item is displayed in the list._

### **Postconditions**

- The item is successfully stored.
- The item is visible with the correct image and description.

### **Alternative Flows**

- **A1: Invalid image format or size:** System rejects the file and an error message is displayed.
- **A2: Empty description:** Submission is blocked and a validation message is shown.
- **A3: Duplicate description:** System prevents submission and a uniqueness error is displayed.
- **A4: Upload failure (network/server error):** System shows an error message and the item is not created.

---

## UC-02: Edit Existing Item Description

**Actor:** User  
**Description:** Allows the user to update the description of an existing item.

### **Preconditions**

- At least one item exists in the list.
- The user can identify the specific item to edit.

### **Main Flow**

1.  The user selects an existing item and clicks "Edit".
    - _System displays current item data in editable mode._
2.  The user modifies the description.
    - _System validates the new input._
3.  The user submits the update.
    - _System saves the changes._
4.  The system updates the list.
    - _The item reflects the updated description._

### **Postconditions**

- The item description is updated.
- The original image remains unchanged.
- The update modal/form is closed.

### **Alternative Flows**

- **A1: Empty description:** System blocks submission and a validation message is displayed.
- **A2: Duplicate description:** System prevents updates and the error message is shown.
- **A3: Update failure (server error):** System shows an error message and original data remains unchanged.

---

## UC-03: Delete Item

**Actor:** User  
**Description:** Allows the user to remove an existing item from the list.

### **Preconditions**

- At least one item exists.
- The target item is identifiable.

### **Main Flow**

1.  The user selects the delete option for a specific item.
    - _System displays a confirmation prompt._
2.  The user confirms deletion.
    - _System removes the item from storage._
3.  The system updates the list.
    - _The item is no longer visible._

### **Postconditions**

- The item is permanently deleted from the database.
- The item is no longer present in the UI list.

### **Alternative Flows**

- **A1: User cancels deletion:** System closes the confirmation dialog and no changes are made.
- **A2: Deletion failure (server error):** System shows an error message and the item remains visible.
