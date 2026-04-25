# Firebase Setup

Milestone 3 adds Firebase client wiring, Authentication state, Firestore
references, Hosting config, and Firestore Security Rules. It does not deploy
anything and does not add real student data.

## Local environment

1. Create a Firebase project in Firebase Console.
2. Register a web app.
3. Copy `.env.example` to `.env.local`.
4. Fill `.env.local` with the Firebase web app config values:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firebase web config values are not service account keys. Do not commit
`.env.local`.

Current local development project noted from Firebase Console:

```text
VITE_FIREBASE_PROJECT_ID=academic-learning-portal-dev
```

The Firebase CLI is available through the project dependency, so use local CLI
commands instead of requiring a global install:

```bash
npx firebase --version
npx firebase login
npx firebase use academic-learning-portal-dev
```

Do not deploy Hosting until the user explicitly approves preview or production
deployment in `docs/DECISIONS_NEEDED.md`.

## Authentication

Enable Google as a sign-in provider in Firebase Console:

```text
Firebase Console > Authentication > Sign-in method > Google
```

The app starts Google sign-in with a popup and falls back to Firebase redirect
sign-in if the browser blocks popups.

Some embedded or in-app browsers can block popups and also partition
`sessionStorage`, which breaks Firebase redirect sign-in with a missing initial
state error. For local admin UID setup, use Safari or Chrome directly at
`http://localhost:5173/login`.

University domain restrictions, email/password sign-in, and manual student
account setup are still unresolved decisions in `docs/DECISIONS_NEEDED.md`.

## Admin allowlist

Admin access must be controlled by Firestore documents:

```text
admins/{uid}
```

The initial admin UID and seeding method still need to be decided before real
admin use. Do not use `users/{uid}.role` as the source of truth.

## Security rules

`firestore.rules` implements the documented MVP trust model:

- Anonymous users cannot read student scores.
- Students can read only their own score document path.
- Students cannot write scores, enrollments, course settings, or admin docs.
- Admins are recognized by `admins/{request.auth.uid}`.

Rules tests are planned for Milestone 6.
