import { getDoc, getDocs, query, where } from "firebase/firestore";
import {
  getOwnStudentScoreDocRef,
  getScoreItemsCollectionRef,
} from "../../lib/firestore/refs";
import type { ScoreItem, StudentScore } from "../../lib/firestore/types";

export type ScoreRow = {
  scoreItemId: string;
  title: string;
  category: ScoreItem["category"] | "other";
  score: number | null;
  maxScore: number;
  feedback?: string;
  published: boolean;
  updatedAt?: Date;
};

export type StudentScoreView = {
  courseId: string;
  rows: ScoreRow[];
  updatedAt?: Date;
};

function toDate(value: unknown): Date | undefined {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate() as Date;
  }

  return undefined;
}

export async function fetchOwnStudentScores(
  courseId: string,
  uid: string,
): Promise<StudentScoreView | null> {
  const [scoreSnapshot, scoreItemsSnapshot] = await Promise.all([
    getDoc(getOwnStudentScoreDocRef(courseId, uid)),
    getDocs(
      query(getScoreItemsCollectionRef(courseId), where("isPublished", "==", true)),
    ),
  ]);

  if (!scoreSnapshot.exists()) {
    return null;
  }

  const studentScore = scoreSnapshot.data() as StudentScore;
  const scoreItems = new Map(
    scoreItemsSnapshot.docs.map((scoreItemDoc) => [
      scoreItemDoc.id,
      scoreItemDoc.data(),
    ]),
  );

  const rows = Object.entries(studentScore.scores)
    .map(([scoreItemId, scoreValue]) => {
      const scoreItem = scoreItems.get(scoreItemId);

      return {
        scoreItemId,
        title: scoreItem?.title ?? "รอข้อมูลรายการคะแนน",
        category: scoreItem?.category ?? "other",
        score: scoreValue.score,
        maxScore: scoreValue.maxScore,
        feedback: scoreValue.feedback,
        published: scoreValue.published,
        updatedAt: toDate(scoreValue.updatedAt),
      };
    })
    .filter((row) => row.published)
    .sort((a, b) => {
      const aOrder = scoreItems.get(a.scoreItemId)?.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = scoreItems.get(b.scoreItemId)?.order ?? Number.MAX_SAFE_INTEGER;

      return aOrder - bOrder || a.title.localeCompare(b.title);
    });

  return {
    courseId,
    rows,
    updatedAt: toDate(studentScore.updatedAt),
  };
}
