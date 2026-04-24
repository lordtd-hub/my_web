Read AGENTS.md and docs/.

Implement Milestone 3 only: Firebase integration.

Requirements:
- Add Firebase client initialization.
- Use environment variables.
- Add `.env.example` based on templates/env.example.
- Add Firebase Authentication support.
- Add an auth state provider.
- Add login page behavior.
- Add logout behavior.
- Add protected route component.
- Add Firestore client helpers.
- Add `firebase.json`.
- Add `firestore.rules` based on docs/SECURITY_MODEL.md and templates/firestore.rules.template.
- Do not use Cloud Functions.
- Do not use Cloud Storage.
- Do not add service account keys.
- Do not commit secrets.
- Do not deploy.

Auth requirements:
- Support Google Sign-In if Firebase config is present.
- If Google Sign-In cannot be fully configured without Firebase Console setup, add clear setup instructions.
- Show loading, signed-in, signed-out, and error states.

Firestore requirements:
- Add typed helper functions where useful.
- Do not read or write real student data.
- Do not store scores in static files or localStorage.

After editing:
- Run `npm run build`.
- Run `npm run lint` if available.
- Update docs/FIRESTORE_SCHEMA.md and docs/SECURITY_MODEL.md if needed.
- Update PLANS.md.
- Summarize changes and any required Firebase Console setup.
