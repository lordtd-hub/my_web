import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import { fetchStudentCourses, type StudentCourse } from "./studentCourses";

type StudentCoursesState = {
  courses: StudentCourse[];
  error: string | null;
  isLoading: boolean;
};

export function useStudentCourses() {
  const { firebaseReady, status, user } = useAuth();
  const [state, setState] = useState<StudentCoursesState>({
    courses: [],
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    let isCurrent = true;

    async function loadCourses() {
      if (!firebaseReady || status !== "authenticated" || !user) {
        setState({
          courses: [],
          error: null,
          isLoading: false,
        });
        return;
      }

      setState((current) => ({
        ...current,
        error: null,
        isLoading: true,
      }));

      try {
        const courses = await fetchStudentCourses({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

        if (!isCurrent) {
          return;
        }

        setState({
          courses,
          error: null,
          isLoading: false,
        });
      } catch (courseError) {
        if (!isCurrent) {
          return;
        }

        setState({
          courses: [],
          error:
            courseError instanceof FirebaseError &&
            courseError.code === "permission-denied"
              ? "บัญชีนี้ยังไม่มีสิทธิ์อ่านรายวิชาของผู้เรียน กรุณาตรวจสอบว่าบัญชีถูกเพิ่มเข้าในรายวิชาแล้ว"
              : courseError instanceof Error
                ? courseError.message
                : "ไม่สามารถโหลดรายวิชาของฉันได้",
          isLoading: false,
        });
      }
    }

    void loadCourses();

    return () => {
      isCurrent = false;
    };
  }, [firebaseReady, status, user]);

  return state;
}
