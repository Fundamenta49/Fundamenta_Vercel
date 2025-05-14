# ✅ QA Checklist – Mentor Assignment Dashboard UI

This checklist ensures that all frontend components are correctly integrated with the assignment API and behave as expected.

---

## 1. Assignment List Display
- [ ] Assignments display correctly in the dashboard
- [ ] Each item shows:
  - Pathway title
  - Student name
  - Current status
  - Due date (if available)
- [ ] Loading spinner appears while fetching
- [ ] "No assignments found" message displays when list is empty

---

## 2. Assignment Creation (Modal Form)
- [ ] Modal opens when "Assign New" button is clicked
- [ ] Connection and Pathway dropdowns populate correctly
- [ ] Due date field accepts input
- [ ] Submitting with valid data creates the assignment
- [ ] Invalid form inputs are caught by validation
- [ ] Toast shows success message on assignment creation
- [ ] Toast shows error on API failure
- [ ] Assignment list refreshes after successful creation

---

## 3. Status Update Controls
- [ ] Each assignment has a status control (dropdown or segmented button)
- [ ] Changing the status triggers a PATCH request
- [ ] Status visually updates in the list
- [ ] Toast shows success message after update
- [ ] Loading indicator appears during request
- [ ] Invalid status changes show appropriate error

---

## 4. Visual and UX Consistency
- [ ] Badges show correct colors for:
  - `assigned`: Blue
  - `in_progress`: Yellow
  - `completed`: Green
  - `revoked`: Gray or Red
- [ ] Component layout and spacing match other parts of the dashboard
- [ ] No console errors or broken layout during use

---

## 5. API Sync
- [ ] `GET /api/assignments` is used for loading the list
- [ ] `POST /api/assignments` is called on creation
- [ ] `PATCH /api/assignments/:id` is used for status updates
- [ ] React Query properly caches and invalidates the assignment list

---

## Optional
- [ ] Form preserves state if modal is reopened
- [ ] Keyboard accessibility and tab order is logical
- [ ] UI responds gracefully on mobile viewports

---

Once all items are confirmed, the mentor assignment UI is ready for beta use.
