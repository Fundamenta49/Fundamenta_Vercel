# ✅ MUST-HAVE IMPLEMENTATION PROMPT – Fundamenta Stability & Core Experience (Post-Crash Phase)

This prompt focuses on restoring and securing the most critical parts of the platform required for stability and MVP readiness.

---

## 1. Core Backend Stability

### ✅ A. Error Resilience
- Wrap all `/api/` routes in try/catch blocks
- Add centralized Express error handler middleware to catch and respond with JSON
- Log internal errors using `console.error` with route + request info

### ✅ B. Request Timeout Handling
- Implement a request timeout middleware (e.g. `express-timeout-handler` or custom)
- Set default timeout for all API requests to 10 seconds
- Return a structured error on timeout instead of hanging

---

## 2. Student Progress Tracking

### ✅ A. Mark Module as Completed
- Add `PATCH /api/modules/:id/complete` or similar endpoint
- Mark the module as completed for the current user
- Update the related assignment’s `progress` field accordingly

### ✅ B. Calculate Progress (%)
- Add logic to `customPathwayModules` or assignment controller to track % complete
- Progress = (completed modules / total modules) × 100
- Auto-update when modules are marked complete/incomplete

---

## 3. Mentor Metrics Endpoint

### ✅ A. GET /api/assignments/metrics
- Return: totalAssignments, activeAssignments, completedAssignments
- Include per-student stats:
  - connectionId
  - student name
  - # total assignments
  - # completed
  - % progress

---

## 4. Basic Analytics UI

### ✅ A. MentorAnalyticsDashboard.tsx
- Use cards to display:
  - Total Assignments
  - Completed
  - Active
- Below, show per-student assignment summary (table or card grid)
- Use loading states, empty states, and toast for feedback

---

## 5. Static Browser Caching

### ✅ A. Configure Cache Headers
- For `/static`, `/assets`, and versioned files:
  - `Cache-Control: public, max-age=31536000, immutable`
- Ensure index.html is NOT cached (use: `no-store`)

---

## Final Step: QA
- Confirm all routes return valid JSON
- Confirm UI shows fallback if no data (empty states)
- Test module completion reflects in both student and mentor views

This must-have bundle is critical for delivering a working beta experience and ensuring the system is reliable under real user load.
