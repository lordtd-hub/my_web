import type { FirebaseOptions } from "firebase/app";

const firebaseEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} satisfies FirebaseOptions;

function hasUsableValue(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && value !== "replace_me";
}

export const isFirebaseConfigured = Object.values(firebaseEnv).every(hasUsableValue);

export const firebaseConfig: FirebaseOptions | null = isFirebaseConfigured
  ? firebaseEnv
  : null;

function parsePort(value: unknown, fallback: number) {
  const port = Number(value);

  return Number.isInteger(port) && port > 0 ? port : fallback;
}

export const firebaseEmulatorConfig = {
  authHost: import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1",
  authPort: parsePort(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT, 9099),
  firestoreHost: import.meta.env.VITE_FIRESTORE_EMULATOR_HOST ?? "127.0.0.1",
  firestorePort: parsePort(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT, 8080),
  useEmulators: import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true",
};

export const firebaseSetupMessage =
  "ยังไม่ได้ตั้งค่า Firebase กรุณา copy .env.example เป็น .env.local และกรอกค่า Firebase web app ให้ครบถ้วน";
