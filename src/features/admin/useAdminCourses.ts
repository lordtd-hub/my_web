import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { fetchAdminCourses, type CourseSummary } from "./adminData";

export function useAdminCourses() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadCourses() {
      setIsLoading(true);
      setError(null);

      try {
        const nextCourses = await fetchAdminCourses();

        if (!isCurrent) {
          return;
        }

        setCourses(nextCourses);
      } catch (courseError) {
        if (!isCurrent) {
          return;
        }

        setError(
            courseError instanceof FirebaseError &&
            courseError.code === "permission-denied"
            ? "Firestore ไม่อนุญาตให้เข้าถึงข้อมูล กรุณาตรวจสอบว่าผู้ใช้นี้มีเอกสาร admins/{uid}"
            : courseError instanceof Error
              ? courseError.message
              : "ไม่สามารถโหลดข้อมูลรายวิชาได้",
        );
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadCourses();

    return () => {
      isCurrent = false;
    };
  }, []);

  return {
    courses,
    error,
    isLoading,
  };
}
