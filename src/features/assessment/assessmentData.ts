import {
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  getLearningOutcomeDocRef,
  getLearningOutcomesCollectionRef,
  getSelfAssessmentDocRef,
} from "../../lib/firestore/refs";
import type {
  BloomCognitiveLevel,
  CourseLearningOutcome,
  StudentSelfAssessment,
} from "../../lib/firestore/types";

export type LearningOutcomeSummary = {
  id: string;
  data: CourseLearningOutcome;
};

export type LearningOutcomeInput = {
  bloomLevel: BloomCognitiveLevel;
  description: string;
  isPublished: boolean;
  order: number;
  title: string;
};

export type SelfAssessmentResponseInput = {
  rating: number;
  reflection: string;
};

export async function fetchCourseLearningOutcomes(courseId: string) {
  const snapshot = await getDocs(
    query(getLearningOutcomesCollectionRef(courseId), orderBy("order")),
  );

  return snapshot.docs.map<LearningOutcomeSummary>((outcomeDoc) => ({
    id: outcomeDoc.id,
    data: outcomeDoc.data(),
  }));
}

export async function addCourseLearningOutcome(
  courseId: string,
  input: LearningOutcomeInput,
) {
  return addDoc(getLearningOutcomesCollectionRef(courseId), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCourseLearningOutcome(
  courseId: string,
  outcomeId: string,
  input: LearningOutcomeInput,
) {
  await setDoc(
    getLearningOutcomeDocRef(courseId, outcomeId),
    {
      ...input,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function seedCourseLearningOutcomes(
  courseId: string,
  outcomes: Array<{ id: string; input: LearningOutcomeInput }>,
) {
  await Promise.all(
    outcomes.map((outcome) =>
      setDoc(
        getLearningOutcomeDocRef(courseId, outcome.id),
        {
          ...outcome.input,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
}

export async function fetchOwnSelfAssessment(courseId: string, uid: string) {
  const snapshot = await getDoc(getSelfAssessmentDocRef(courseId, uid));

  return snapshot.exists()
    ? {
        id: snapshot.id,
        data: snapshot.data(),
      }
    : null;
}

export async function saveOwnSelfAssessment(input: {
  courseId: string;
  responses: Record<string, SelfAssessmentResponseInput>;
  uid: string;
}) {
  const responses: StudentSelfAssessment["responses"] = Object.fromEntries(
    Object.entries(input.responses).map(([outcomeId, response]) => [
      outcomeId,
      {
        ...response,
        updatedAt: serverTimestamp() as StudentSelfAssessment["responses"][string]["updatedAt"],
      },
    ]),
  );

  await setDoc(
    getSelfAssessmentDocRef(input.courseId, input.uid),
    {
      uid: input.uid,
      courseId: input.courseId,
      responses,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
