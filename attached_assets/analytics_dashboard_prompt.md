# ⚡ Bundle 3: Analytics Dashboards (Mentor + Student Views) – Replit Agent Prompt

This prompt guides the implementation of analytics dashboards using existing assignment, module, and user connection data.

---

## 🧠 1. Mentor Analytics Dashboard

Create a new dashboard component: `MentorAnalyticsDashboard.tsx`

Use the endpoint: `GET /api/assignments/metrics`

Display:
- Total assignments
- Active assignments
- Completed assignments
- Per-student breakdown showing:
  - Student name
  - # of total assignments
  - # completed
  - % progress

Visual format:
- Use cards, stacked rows, or a compact table
- Add loading skeletons and empty state
- Highlight top-performing students

---

## 📊 2. Student Analytics View

Create a new component: `StudentAnalyticsDashboard.tsx`

Use the same assignment/module data already fetched for student views.

Display:
- % completed across all assignments
- Module completion streak or heatmap (if tracking dates)
- Timeline of most recently completed modules
- “Assignments in Progress” list with progress bars

Add:
- Loading indicators
- Message if student has no assigned work

---

## 🎯 3. Shared UI Components (Optional Enhancements)

Create reusable components:
- `<AnalyticsCard>`: For showing metrics in compact format
- `<MiniProgressChart>`: Inline progress bars or sparkline
- `<Heatmap>` (optional): Use a grid to show daily activity if timestamps are tracked

---

## 🧪 4. Final Step

Wire both dashboards into your routes:
- Mentor dashboard → `/mypath/mentor/analytics`
- Student dashboard → `/mypath/student/analytics`

Use tabs or navigation as needed.

---

This bundle will complete the MyPath analytics features for both mentors and students.
