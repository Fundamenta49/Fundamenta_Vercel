# ⚡ Bundle 1: Mentor Assignment Dashboard UI (Replit Agent Prompt)

This prompt guides the agent through implementing the mentor-facing assignment dashboard using React Query and existing API routes.

---

## 1. Create `useAssignments` Hook (React Query)

Create a hook called `useAssignments()` in:

`client/src/hooks/useAssignments.ts`

- Fetches data from `GET /api/assignments`
- Returns: `data`, `isLoading`, `isError`
- Use React Query (`useQuery`) and export this hook

---

## 2. Display Assignment List in Dashboard

In `client/src/pages/mypath/AssignmentDashboard.tsx` or a new dashboard component:

- Use `useAssignments()` to fetch assignments
- Display each assignment with:
  - Pathway title
  - Student name (from assignment.connection.targetUser)
  - Status badge (`assigned`, `in_progress`, `completed`, `revoked`)
  - Due date (if present)
- Show loading spinner or skeleton while loading
- Show a fallback message if no assignments exist

---

## 3. Create New Assignment Modal (Mentor → Student)

Implement a modal or dialog with a form to assign a new pathway:

- Form Fields:
  - Dropdown for `Connection` (use `/api/connections`)
  - Dropdown for `Pathway` (use `/api/pathways`)
  - Optional due date (date picker)
  - Optional message to student

On submit:
- Call `POST /api/assignments`
- Show success/error toast
- Invalidate assignments query to refresh the list
- Use React Hook Form + Zod for validation

---

## 4. Add Status Update Control to Each Assignment

Each assignment card or row should have a status control:

- Type: Dropdown or segmented button
- Options: `assigned`, `in_progress`, `completed`, `revoked`

On change:
- Call `PATCH /api/assignments/:id`
- Show loading during request
- Show success or error toast
- Invalidate assignment query after success

---

## 5. Add UX Feedback + Visual Styles

For all actions (create/update):
- Show toast on success or error
- Wrap all mutations with loading and error handling
- Use badge colors for status:
  - `assigned` → Blue
  - `in_progress` → Yellow
  - `completed` → Green
  - `revoked` → Gray or Red

Use your platform’s toast/notification and badge components.

---

Once complete, verify all data is syncing properly and the UI updates on interaction.
