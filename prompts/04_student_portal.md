Read AGENTS.md and docs/.

Implement Milestone 4 only: Student portal.

Routes:
- /student
- /student/courses
- /student/courses/:courseId/scores

Requirements:
- User must be logged in.
- If not logged in, redirect to /login or show a clear login-required page.
- Student courses must come from enrollments tied to auth.uid.
- Student scores must be read from courses/{courseId}/studentScores/{uid}.
- The app must use auth.uid, not studentId from the URL, to read scores.
- Do not expose another student's UID in the UI.
- If no data exists, show a friendly empty state.
- Show score item name, category, score, max score, feedback, and updatedAt if available.
- Add loading and error states.
- Do not store scores in localStorage.
- Do not store scores in static files.
- Do not add admin import features yet.
- Do not deploy.

Security:
- A student must not be able to read another student's score document by changing route params.
- Update documentation for any data access pattern.

After implementation:
- Run `npm run build`.
- Run `npm run lint` if available.
- Update PLANS.md and docs.
- Summarize changes and remaining risks.
