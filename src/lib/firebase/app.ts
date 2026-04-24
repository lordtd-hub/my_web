import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

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
