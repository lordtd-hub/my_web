import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import { firebaseConfig, firebaseEmulatorConfig } from "./config";

type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  googleProvider: GoogleAuthProvider;
};

let client: FirebaseClient | null = null;

export function getFirebaseClient(): FirebaseClient | null {
  if (!firebaseConfig) {
    return null;
  }

  if (!client) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    if (firebaseEmulatorConfig.useEmulators) {
      connectAuthEmulator(
        auth,
        `http://${firebaseEmulatorConfig.authHost}:${firebaseEmulatorConfig.authPort}`,
        {
          disableWarnings: true,
        },
      );
      connectFirestoreEmulator(
        db,
        firebaseEmulatorConfig.firestoreHost,
        firebaseEmulatorConfig.firestorePort,
      );
    }

    client = {
      app,
      auth,
      db,
      googleProvider,
    };
  }

  return client;
}

export function getAuthClient(): Auth | null {
  return getFirebaseClient()?.auth ?? null;
}

export function getDbClient(): Firestore | null {
  return getFirebaseClient()?.db ?? null;
}
