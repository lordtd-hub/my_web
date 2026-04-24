import {
  onAuthStateChanged,
  signInWithPopup,
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
import { firebaseSetupMessage, isFirebaseConfigured } from "../../lib/firebase/config";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./authContext";

type AuthProviderProps = {
  children: ReactNode;
};

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
      const message =
        authError instanceof Error
          ? authError.message
          : "เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Firebase Console";
      setError(message);
      setStatus(client.auth.currentUser ? "authenticated" : "unauthenticated");
    }
  }, []);

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
      signInWithGoogle,
      logout,
      clearError,
    }),
    [clearError, error, logout, signInWithGoogle, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
