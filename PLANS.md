# PLANS.md

This file tracks implementation milestones for Codex.

Codex must update this file after each milestone.

## Current project state

Status: Milestone 6 security rules tests added. Preview deploy review has not started.

## Milestone 0 — Read project context

Goal:
Codex reads all control documents and confirms understanding.

Acceptance criteria:
- Codex summarizes the project goal.
- Codex identifies unresolved decisions.
- Codex proposes the next milestone.
- No application code is changed.

Status: Completed.

## Milestone 1 — Scaffold app

Goal:
Create the initial Vite + React + TypeScript app structure.

Acceptance criteria:
- Vite + React + TypeScript created.
- React Router added.
- Tailwind CSS added.
- Placeholder routes created.
- Build passes.
- No Firebase integration yet.

Status: Completed.

## Milestone 2 — Public academic website

Goal:
Implement the public-facing academic website.

Acceptance criteria:
- Home, About, Teaching, Courses, Research, Projects, Contact pages exist.
- Content uses placeholders only.
- Layout is responsive.
- Navigation works.
- No private data exists in public files.

Status: Completed.

## Milestone 3 — Firebase integration

Goal:
Add Firebase Auth, Firestore client helpers, environment config, and initial rules.

Acceptance criteria:
- Firebase client initialization added.
- Auth provider added.
- Protected route component added.
- Firestore helpers added.
- `.env.example` added.
- `firestore.rules` added.
- No Cloud Functions or Cloud Storage added.
- Build passes.

Status: Completed.

## Milestone 4 — Student portal

Goal:
Allow students to view their own courses and scores securely.

Acceptance criteria:
- Student routes added.
- Student courses read from enrollments tied to `auth.uid`.
- Student scores read from `courses/{courseId}/studentScores/{uid}`.
- Empty/loading/error states handled.
- No score data stored in localStorage or static files.

Status: Completed.

## Milestone 5 — Admin dashboard and CSV import

Goal:
Allow teacher/admin to manage courses, enrollments, and import scores from CSV.

Acceptance criteria:
- Admin routes added.
- Admin access uses `admins/{uid}`.
- CSV import supports select, parse, validate, preview, confirm, and write.
- Scores are written only after matching enrolled students.
- No CSV files are uploaded to public storage.

Status: Completed.

## Milestone 6 — Security rules tests

Goal:
Test the privacy and authorization model.

Acceptance criteria:
- Anonymous users cannot read scores.
- Students can read their own scores.
- Students cannot read other students' scores.
- Students cannot write scores.
- Students cannot create admins.
- Admin can manage course data.
- Security test commands are documented.

Status: Completed.

## Milestone 7 — Preview deploy

Goal:
Prepare Firebase Hosting preview deployment.

Acceptance criteria:
- Build passes.
- No secrets or real data in repo.
- Preview deploy instructions documented.
- Production deploy is not performed unless explicitly requested.

Status: Not started.

## Milestone 8 — Production readiness

Goal:
Review readiness for real use.

Acceptance criteria:
- Data privacy reviewed.
- Rules tested.
- README complete.
- Admin workflow tested with fake data.
- User explicitly approves production deployment.

Status: Not started.
