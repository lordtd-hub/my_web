Read AGENTS.md and docs/.

Implement Milestone 6 only: Security rules tests.

Goal:
Create tests or a clearly documented emulator-based test workflow for Firestore rules.

Required test cases:
- Anonymous users cannot read scores.
- Public users can read public courses.
- Student A can read Student A scores.
- Student A cannot read Student B scores.
- Student cannot write scores.
- Student cannot create admin documents.
- Admin can read and write courses.
- Admin can write enrollments.
- Admin can write student scores.

Requirements:
- Prefer Firebase Emulator Suite for rule tests if practical.
- Do not use real student data.
- Do not use production Firebase project.
- Add fake test data only.
- Document how to run the tests.
- Do not deploy.

After implementation:
- Run tests if possible.
- Run `npm run build`.
- Run `npm run lint` if available.
- Update docs/SECURITY_MODEL.md and docs/CODEX_RUNBOOK.md.
- Update PLANS.md.
- Summarize test coverage and gaps.
