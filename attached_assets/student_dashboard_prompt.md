# ⚡ Bundle 2: Student Dashboard + Progress Tracker (Replit Agent Prompt)

This prompt guides the Replit agent to complete backend and frontend functionality for the student-facing dashboard in MyPath.

---

## 🔧 Backend: Add Missing Endpoint + Progress Logic

### 1. Create `GET /api/assignments/student/:connectionId`

- Fetch assignments for a student based on connectionId
- Confirm the requesting user is the mentor associated with that connection
- Return assignments with:
  - Pathway info
  - Module list
  - Assignment status
  - Due date

---

### 2. Backend Logic for Progress Tracking

- Add support for tracking module completion
- Each module should have a boolean `completed` field (or similar state)
- As modules are marked complete, update the assignment’s `progress` field (e.g., % complete)
- Progress = (completed modules / total modules) × 100

---

## 🎨 Frontend: Build Student Assignment View

### 3. Create `StudentAssignmentDashboard.tsx`

- Display all assignments fetched from the new endpoint
- Group by assignment status (`assigned`, `in_progress`, `completed`)
- Show:
  - Pathway title
  - Progress bar
  - Due date
  - Assignment status

Use a loading spinner while data is being fetched.

---

### 4. Module Completion UI

- Within each assignment card, show the list of modules
- Allow students to mark each module as complete (checkbox, toggle, etc.)
- On completion, send a PATCH request to update the module’s status
- Update assignment progress accordingly in the UI

---

### 5. Visual Progress Tracking

- Display progress bar or percentage for each assignment
- Dynamically update when module completion changes
- Use badge colors to represent assignment status:
  - Blue: Assigned
  - Yellow: In Progress
  - Green: Completed

---

### 6. Optional Enhancements

- Add “Start” button to move status from `assigned` → `in_progress`
- Mark assignment `completed` when all modules are done
- Allow notes or reflections per module if schema supports it

---

Once implemented, test the full student flow: view → complete → track → report.
