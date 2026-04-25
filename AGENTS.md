# AGENTS.md

This repository is a Personal Academic Learning Portal.

The project has two goals:

1. A public academic profile website for a mathematics lecturer.
2. A private student learning portal where enrolled students can view course materials and their own scores securely.

## Non-negotiable rules

- Do not invent real personal information about the professor.
- Do not invent real student data.
- Use placeholders when content is missing.
- Record missing decisions in `docs/DECISIONS_NEEDED.md`.
- Never expose student scores in public files, public URLs, Markdown content, static JSON, or localStorage.
- Student scores must be stored only in Firestore and protected by Firestore Security Rules.
- A student must only be able to read their own score documents.
- Teacher/admin access must be protected by a dedicated admin allowlist, not by a user-editable role field.
- Do not add Cloud Functions, Cloud Storage, payment features, or server-side infrastructure unless explicitly requested.
- Do not deploy to production unless the user explicitly asks.
- Do not commit secrets, service account keys, private student data, or real grades.

## Thai language and localization policy

- Thai is the default language for all user-facing UI text and project documentation.
- Public website content should use formal, readable academic Thai suitable for a university mathematics lecturer.
- Student portal text should be clear, polite, and easy for students to understand.
- Admin dashboard text should be practical, concise, and clear for the teacher.
- README and project documentation may be written in Thai. Keep common technical terms in English when they are clearer.
- Use Thai where natural, but keep terms such as Firebase, Firestore, Authentication, Hosting, CSV, and UID in English.
- Acceptable UI translations include:
  - Login: `เข้าสู่ระบบ`
  - Student Portal / learner area: `รายวิชาของฉัน` or `พื้นที่ผู้เรียนในรายวิชา`
  - Admin Dashboard: `แดชบอร์ดอาจารย์`
- Do not translate code-critical identifiers unless explicitly requested and clearly safe:
  - file names
  - route paths such as `/student`, `/admin`, and `/courses`
  - React component names
  - TypeScript variable names
  - function names
  - Firebase collection names
  - Firestore document paths
  - environment variable names
  - import/export names
  - test names if changing them could break scripts
  - `package.json` scripts
  - CSS class names
  - security rules logic
- When localizing the app, change only human-readable strings unless a code change is required.
- If a text change requires modifying logic, stop and explain the reason before changing it.
- Do not invent real personal, university, course, or student information during localization. Continue using placeholders when content is missing.

## Preferred MVP stack

- Vite
- React
- TypeScript
- React Router
- Tailwind CSS
- Firebase Hosting
- Firebase Authentication
- Cloud Firestore
- Firebase Emulator Suite for local testing when possible

## Project structure

Use this structure unless there is a strong reason to change it:

```text
src/
├─ app/
├─ components/
├─ pages/
│  ├─ public/
│  ├─ student/
│  └─ admin/
├─ routes/
├─ features/
│  ├─ auth/
│  ├─ courses/
│  ├─ scores/
│  ├─ admin/
│  └─ content/
├─ lib/
│  ├─ firebase/
│  ├─ firestore/
│  └─ csv/
├─ content/
│  ├─ courses/
│  ├─ notes/
│  └─ profile/
└─ styles/
```

Project documentation lives in `docs/`.

## Required workflow

For every significant task:

1. Read `docs/PROJECT_BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/FIRESTORE_SCHEMA.md`, and `docs/SECURITY_MODEL.md`.
2. State a concise plan before changing code.
3. Implement the smallest useful milestone.
4. Run lint, tests, and build if available.
5. Update documentation if behavior, schema, routes, or security rules changed.
6. Summarize changed files, commands run, and remaining risks.
7. Add unresolved questions to `docs/DECISIONS_NEEDED.md`.

## Definition of done

A task is done only when:

- The app builds successfully.
- New code is typed with TypeScript.
- Navigation works.
- Security-sensitive behavior is covered by rules or tests.
- Public pages do not contain private data.
- Student score pages cannot read another student's score by changing URL params.
- Documentation reflects the current implementation.

## Security expectations

Use this trust model:

- Public visitors can read public pages and public course summaries.
- Authenticated students can read their own profile, enrollments, course materials for enrolled courses, and their own score documents.
- Teachers/admins can manage courses, enrollments, announcements, score items, and student scores.
- Teacher/admin status is determined by the existence of `admins/{uid}` in Firestore.
- Students must not be able to create or edit admin documents.
- Students must not be able to edit scores.

## If information is missing

If missing information is cosmetic, use placeholder content and document it.

If missing information affects privacy, authentication, authorization, data model, grading logic, or deployment, stop and ask the user.
