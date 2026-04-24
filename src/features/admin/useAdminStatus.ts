import { FirebaseError } from "firebase/app";
import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAdminDocRef } from "../../lib/firestore/refs";
import { useAuth } from "../auth/authContext";

type AdminStatus = "idle" | "checking" | "allowed" | "denied";

export function useAdminStatus() {
  const { firebaseReady, status, user } = useAuth();
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function checkAdmin() {
      if (!firebaseReady || status !== "authenticated" || !user) {
        setAdminStatus("idle");
        setError(null);
        return;
      }

      setAdminStatus("checking");
      setError(null);

      try {
        const adminDoc = await getDoc(getAdminDocRef(user.uid));

        if (!isCurrent) {
          return;
        }

        setAdminStatus(adminDoc.exists() ? "allowed" : "denied");
      } catch (adminError) {
        if (!isCurrent) {
          return;
        }

        if (
          adminError instanceof FirebaseError &&
          adminError.code === "permission-denied"
        ) {
          setAdminStatus("denied");
          return;
        }

        setAdminStatus("denied");
        setError(
          adminError instanceof Error
            ? adminError.message
            : "ไม่สามารถตรวจสอบสิทธิ์ admin ได้",
        );
      }
    }

    void checkAdmin();

    return () => {
      isCurrent = false;
    };
  }, [firebaseReady, status, user]);

  return {
    adminStatus,
    error,
  };
}
