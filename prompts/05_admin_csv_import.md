Read AGENTS.md and docs/.

Implement Milestone 5 only: Teacher/admin dashboard and CSV score import.

Routes:
- /admin
- /admin/courses
- /admin/courses/new
- /admin/courses/:courseId
- /admin/courses/:courseId/students
- /admin/courses/:courseId/scores
- /admin/courses/:courseId/import

Requirements:
- Admin pages require authentication.
- Admin authorization is based on admins/{uid}.
- Do not use a user-editable role field as source of truth.
- Build a browser-based CSV import flow.
- The CSV import must have:
  1. file selection
  2. parsing
  3. validation
  4. preview table
  5. confirmation step
  6. Firestore write
- Do not upload CSV files to Cloud Storage.
- Do not use Cloud Functions.
- Do not store imported CSV in public files.
- Validate required columns.
- Show clear errors for missing studentId/email/score columns.
- Update courses/{courseId}/studentScores/{uid} only after matching enrolled students.
- Use examples/sample_scores.csv as the starter CSV shape.
- If the CSV format is ambiguous, implement a flexible parser and document assumptions in docs/CODEX_RUNBOOK.md and docs/DECISIONS_NEEDED.md.
- Do not deploy.

After implementation:
- Run `npm run build`.
- Run `npm run lint` if available.
- Update README and docs.
- Update PLANS.md.
- Summarize changes and remaining risks.
