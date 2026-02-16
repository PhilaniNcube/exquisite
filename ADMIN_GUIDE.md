# Admin Guide: School & Class Management

This guide provides step-by-step instructions for administrators to manage schools, classes, and photo uploads within the dashboard.

---

## 1. Creating a New School

To create a new school or creche in the system:

1.  **Navigate to Schools**: In the dashboard sidebar, click on **Schools** (or go to `/dashboard/schools`).
2.  **Add School**: Click the **Add New School** button in the top right corner.
3.  **Fill the Form**:
    -   **Name**: Enter the full name of the school.
    -   **Type**: Select whether it is a **School** or a **Creche**.
    -   **Pass Code**: You can enter a custom pass code for parents to access photos. If left blank, one will be automatically generated.
4.  **Submit**: Click **Create School**. You will be redirected to the newly created school's detail page.

---

## 2. Creating a New Class in a School

Classes are managed within the context of a specific school:

1.  **View School Details**: Navigate to the specific school page (e.g., `/dashboard/schools/[schoolId]`).
2.  **Add Class**: In the **Classes** section, click the **Add Class** button.
3.  **Enter Details**:
    -   **Name**: Enter the class name (e.g., "Grade 1A", "Blue Berries").
4.  **Save**: Click **Create Class**. The new class will appear in the table immediately.

---

## 3. Bulk Uploading Images for a Class

To upload multiple photos for a class simultaneously:

1.  **Navigate to Class**: From the school details page, click on the class name or go to `/dashboard/classes/[classId]`.
2.  **Trigger Bulk Upload**: Click the **Bulk Upload** button in the top right.
3.  **Select Files**: 
    -   You can drag and drop multiple images into the upload area or click to browse files.
    -   Supported formats: JPG, PNG.
4.  **Process Upload**: Once files are selected, the system will process and upload them to the class gallery.
5.  **Verification**: After completion, the photos will be visible in the **Class Photos** section of the class page.

---

> [!TIP]
> Each class has a unique gallery. Ensure you are in the correct class dashboard before starting a bulk upload to avoid mixing up photos between different groups.
