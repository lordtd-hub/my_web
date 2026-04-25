import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFirebaseClient } from "../../lib/firebase/app";
import {
  firebaseEmulatorConfig,
  firebaseSetupMessage,
  isFirebaseConfigured,
} from "../../lib/firebase/config";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./authContext";

type AuthProviderProps = {
  children: ReactNode;
};

function isPopupBlockedError(error: unknown) {
  return (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "auth/popup-blocked"
  );
}

function getSignInErrorMessage(error: unknown) {
  if (
    error instanceof Error &&
    error.message.includes("missing initial state")
  ) {
    return "เข้าสู่ระบบแบบ redirect ไม่สำเร็จ เพราะ browser นี้ไม่อนุญาตให้ Firebase อ่าน sessionStorage สำหรับ OAuth state กรุณาเปิด http://localhost:5173/login ใน Safari หรือ Chrome แล้วลองเข้าสู่ระบบใหม่";
  }

  return error instanceof Error
    ? error.message
    : "เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Firebase Console";
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>(
    isFirebaseConfigured ? "loading" : "unauthenticated",
  );
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = getFirebaseClient();

    if (!client) {
      return undefined;
    }

    void getRedirectResult(client.auth).catch((redirectError: unknown) => {
      setError(getSignInErrorMessage(redirectError));
      setUser(null);
      setStatus("unauthenticated");
    });

    return onAuthStateChanged(
      client.auth,
      (nextUser) => {
        setUser(nextUser);
        setStatus(nextUser ? "authenticated" : "unauthenticated");
      },
      (authError) => {
        setError(authError.message);
        setUser(null);
        setStatus("unauthenticated");
      },
    );
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const client = getFirebaseClient();

    if (!client) {
      setError(firebaseSetupMessage);
      return;
    }

    setError(null);
    setStatus("loading");

    try {
      await signInWithPopup(client.auth, client.googleProvider);
    } catch (authError) {
      if (isPopupBlockedError(authError)) {
        await signInWithRedirect(client.auth, client.googleProvider);
        return;
      }

      setError(getSignInErrorMessage(authError));
      setStatus(client.auth.currentUser ? "authenticated" : "unauthenticated");
    }
  }, []);

  const signInWithTestAccount = useCallback(
    async (email: string, password: string) => {
      const client = getFirebaseClient();

      if (!client) {
        setError(firebaseSetupMessage);
        return;
      }

      if (!firebaseEmulatorConfig.useEmulators) {
        setError("บัญชีทดสอบใช้ได้เฉพาะ Firebase Emulator local QA เท่านั้น");
        return;
      }

      setError(null);
      setStatus("loading");

      try {
        await signInWithEmailAndPassword(client.auth, email, password);
      } catch (authError) {
        setError(
          authError instanceof Error
            ? authError.message
            : "เข้าสู่ระบบบัญชีทดสอบไม่สำเร็จ กรุณารัน seed emulator ก่อน",
        );
        setStatus(client.auth.currentUser ? "authenticated" : "unauthenticated");
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const client = getFirebaseClient();

    if (!client) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setError(null);
    await signOut(client.auth);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      firebaseReady: isFirebaseConfigured,
      isEmulatorMode: firebaseEmulatorConfig.useEmulators,
      signInWithGoogle,
      signInWithTestAccount,
      logout,
      clearError,
    }),
    [
      clearError,
      error,
      logout,
      signInWithGoogle,
      signInWithTestAccount,
      status,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
