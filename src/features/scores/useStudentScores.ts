import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/authContext";
import {
  fetchOwnStudentScores,
  type StudentScoreView,
} from "./studentScores";

type StudentScoresState = {
  error: string | null;
  isLoading: boolean;
  scores: StudentScoreView | null;
};

export function useStudentScores(courseId: string | undefined) {
  const { firebaseReady, status, user } = useAuth();
  const [state, setState] = useState<StudentScoresState>({
    error: null,
    isLoading: false,
    scores: null,
  });

  useEffect(() => {
    let isCurrent = true;

    async function loadScores() {
      if (!courseId || !firebaseReady || status !== "authenticated" || !user) {
        setState({
          error: null,
          isLoading: false,
          scores: null,
        });
        return;
      }

      setState((current) => ({
        ...current,
        error: null,
        isLoading: true,
      }));

      try {
        const scores = await fetchOwnStudentScores(courseId, user.uid);

        if (!isCurrent) {
          return;
        }

        setState({
          error: null,
          isLoading: false,
          scores,
        });
      } catch (scoreError) {
        if (!isCurrent) {
          return;
        }

        setState({
          error:
            scoreError instanceof FirebaseError &&
            scoreError.code === "permission-denied"
              ? "บัญชีนี้ยังไม่มีสิทธิ์อ่านคะแนนของรายวิชานี้ หรือรายวิชายังไม่ได้ผูกกับบัญชีของท่าน"
              : scoreError instanceof Error
                ? scoreError.message
                : "ไม่สามารถโหลดคะแนนของฉันได้",
          isLoading: false,
          scores: null,
        });
      }
    }

    void loadScores();

    return () => {
      isCurrent = false;
    };
  }, [courseId, firebaseReady, status, user]);

  return state;
}
