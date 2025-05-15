# ⚡ Bundle 3: Analytics Dashboards (Mentor + Student Views) – Replit Agent Prompt

This prompt guides the implementation of analytics dashboards for the MyPath feature, using existing assignment, module, and user connection data. The dashboards should align with our TypeScript/React codebase, use our UI library (`../ui/*`), and follow accessibility and performance best practices.

---

## 🧠 1. Mentor Analytics Dashboard

Create a new component: `client/src/components/mypath/MentorAnalyticsDashboard.tsx`

**API Endpoint**: `GET /api/assignments/metrics`
- **Response Shape**:
  ```typescript
  interface AssignmentMetrics {
    totalAssignments: number;
    activeAssignments: number;
    completedAssignments: number;
    perStudent: {
      studentId: number;
      studentName: string;
      totalAssignments: number;
      completedAssignments: number;
      progressPercentage: number;
    }[];
  }
  ```

**Display**:
- Total assignments, active assignments, and completed assignments in `AnalyticsCard` components.
- Per-student breakdown in a compact table or stacked rows, showing:
  - Student name (from `users` table, joined in API).
  - Number of total assignments.
  - Number of completed assignments.
  - Progress percentage (0-100%).
- Highlight top 3 students by progress percentage (e.g., with a badge or border).

**UI Requirements**:
- Use `Card`, `Table`, or `Stack` from `../ui/*` for layout.
- Show `Skeleton` components during loading (match `StudentAssignmentDashboard.tsx` style).
- Display an empty state message if no assignments exist: "No assignments found for your students."
- Handle API errors (e.g., 403, 500) with a `useToast` notification: "Failed to load metrics. Please try again."
- Ensure accessibility (ARIA labels for tables, focusable elements).

**Performance**:
- Limit per-student data to 50 records initially, with a "Load More" button for pagination (use `offset` and `limit` in API calls).

---

## 📊 2. Student Analytics View

Create a new component: `client/src/components/mypath/StudentAnalyticsDashboard.tsx`

**Data Source**: Reuse assignment/module data from `StudentAssignmentDashboard.tsx` (fetched via `apiRequest` from `/api/assignments/student`).
- **Assumed Data Shape** (from `assignedPathways`, `customPathwayModules`):
  ```typescript
  interface StudentAssignment {
    id: number;
    pathwayId: number;
    title: string;
    modules: {
      id: number;
      title: string;
      completed: boolean;
      completedAt?: string; // ISO timestamp
    }[];
    progressPercentage: number;
  }
  ```

**Display**:
- Overall completion percentage across all assignments (use `MiniProgressChart`).
- Module completion streak (count consecutive days with completions) or `Heatmap` (if `completedAt` timestamps are available).
- Timeline of 5 most recently completed modules (title, completion date).
- “Assignments in Progress” list with `Progress` bars for each assignment.

**UI Requirements**:
- Use `Card`, `Progress`, and `Timeline` from `../ui/*`.
- Show `Skeleton` components during loading.
- Display an empty state: "You have no assigned work yet."
- Handle errors with `useToast`: "Failed to load your assignments."
- Ensure accessibility (e.g., ARIA labels for progress bars, screen reader support for timeline).

**Performance**:
- Cache data using `queryClient` from `../../lib/queryClient` to avoid refetching.
- Lazy-load timeline entries if more than 10 modules are present.

---

## 🎯 3. Shared UI Components

Create reusable components in `client/src/components/ui/`:
- **`<AnalyticsCard>`**:
  - Props: `{ title: string; value: number | string; icon?: ReactNode }`
  - Renders a card with a title, value, and optional icon.
  - Example: `<AnalyticsCard title="Total Assignments" value={42} icon={<BookOpen />} />`
- **`<MiniProgressChart>`**:
  - Props: `{ percentage: number; label?: string }`
  - Renders an inline progress bar or sparkline with percentage.
  - Example: `<MiniProgressChart percentage={75} label="Progress" />`
- **`<Heatmap>` (Optional)**:
  - Props: `{ data: { date: string; value: number }[] }`
  - Renders a grid showing daily activity (e.g., module completions).
  - Use a library like `react-calendar-heatmap` or custom SVG grid.
  - Fallback to a simple streak counter if timestamps are unavailable.

**Styling**:
- Use Tailwind classes consistent with `StudentAssignmentDashboard.tsx` (e.g., `bg-white`, `shadow-sm`, `rounded-lg`).
- Ensure components are responsive and mobile-friendly.

---

## 🔌 4. Integration

Wire dashboards into the app:
- **Mentor Dashboard**: Add to `client/src/pages/mypath/mentor.tsx` at `/mypath/mentor/analytics`.
- **Student Dashboard**: Add to `client/src/pages/mypath/student.tsx` at `/mypath/student/analytics`.
- Use `Tabs` from `../ui/tabs` to switch between dashboards and other views (e.g., assignments, progress notes).
- Update `server/routes/student.ts` and `server/routes/mentor.ts` to handle the `/api/assignments/metrics` endpoint if not already implemented.

**API Implementation** (if needed):
- In `server/storage.db.ts`, add a method to fetch metrics:
  ```typescript
  async getAssignmentMetrics(mentorId: number): Promise<AssignmentMetrics> {
    const assignments = await db
      .select({
        id: assignedPathways.id,
        studentId: assignedPathways.studentId,
        studentName: users.name,
        completed: sql<boolean>`COUNT(CASE WHEN customPathwayModules.completed THEN 1 END)`.as('completed'),
        total: sql<number>`COUNT(customPathwayModules.id)`.as('total'),
      })
      .from(assignedPathways)
      .innerJoin(users, eq(users.id, assignedPathways.studentId))
      .leftJoin(customPathwayModules, eq(customPathwayModules.pathwayId, assignedPathways.pathwayId))
      .where(eq(assignedPathways.mentorId, mentorId))
      .groupBy(assignedPathways.id, users.name);

    return {
      totalAssignments: assignments.length,
      activeAssignments: assignments.filter(a => a.completed < a.total).length,
      completedAssignments: assignments.filter(a => a.completed === a.total).length,
      perStudent: assignments.map(a => ({
        studentId: a.studentId,
        studentName: a.studentName,
        totalAssignments: a.total,
        completedAssignments: a.completed,
        progressPercentage: (a.completed / a.total) * 100,
      })),
    };
  }
  ```

**Testing**:
- Write unit tests for components using Jest/React Testing Library.
  - Example: Test `MentorAnalyticsDashboard` renders correct metrics and handles empty state.
- Test API endpoint with mocked `db` to ensure correct metrics calculation.
- Validate accessibility using `axe` or similar tools.

---

## ✅ 5. Success Criteria

- Dashboards load data correctly and display metrics as specified.
- UI is responsive, accessible, and consistent with existing components.
- Error states and empty states are handled gracefully.
- Performance is optimized for up to 100 students/assignments.
- Code passes linting and type-checking (`npx tsc`).

This bundle completes the MyPath analytics feature, enhancing mentor and student engagement.