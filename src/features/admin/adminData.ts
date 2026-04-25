import {
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { getDbClient } from "../../lib/firebase/app";
import {
  getCourseDocRef,
  getCoursesCollectionRef,
  getEnrollmentDocRef,
  getEnrollmentsCollectionRef,
  getRosterCollectionRef,
  getRosterDocRef,
  getScoreItemDocRef,
  getScoreItemsCollectionRef,
  getStudentScoreDocRef,
} from "../../lib/firestore/refs";
import type {
  Course,
  Enrollment,
  RosterEntry,
  ScoreItem,
} from "../../lib/firestore/types";

export type CourseSummary = {
  id: string;
  data: Course;
};

export type EnrollmentSummary = {
  id: string;
  data: Enrollment;
};

export type RosterEntrySummary = {
  id: string;
  data: RosterEntry;
};

export type ScoreItemSummary = {
  id: string;
  data: ScoreItem;
};

export async function fetchAdminCourses(): Promise<CourseSummary[]> {
  const snapshot = await getDocs(
    query(getCoursesCollectionRef(), orderBy("year", "desc"), orderBy("title")),
  );

  return snapshot.docs.map((courseDoc) => ({
    id: courseDoc.id,
    data: courseDoc.data(),
  }));
}

export async function fetchAdminCourse(courseId: string) {
  const foundCourse = await getDoc(getCourseDocRef(courseId));

  return foundCourse.exists()
    ? {
        id: foundCourse.id,
        data: foundCourse.data(),
      }
    : null;
}

export async function createCourse(input: {
  description: string;
  isPublic: boolean;
  slug: string;
  term: string;
  title: string;
  year: number;
}) {
  return addDoc(getCoursesCollectionRef(), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function fetchCourseEnrollments(courseId: string) {
  const snapshot = await getDocs(getEnrollmentsCollectionRef(courseId));

  return snapshot.docs
    .map((enrollmentDoc) => ({
      id: enrollmentDoc.id,
      data: enrollmentDoc.data(),
    }))
    .sort((a, b) => a.data.displayName.localeCompare(b.data.displayName));
}

export async function fetchCourseRoster(courseId: string) {
  const snapshot = await getDocs(getRosterCollectionRef(courseId));

  return snapshot.docs
    .map((rosterDoc) => ({
      id: rosterDoc.id,
      data: rosterDoc.data(),
    }))
    .sort((a, b) => a.data.studentId.localeCompare(b.data.studentId));
}

export async function fetchCourseScoreItems(courseId: string) {
  const snapshot = await getDocs(
    query(getScoreItemsCollectionRef(courseId), orderBy("order")),
  );

  return snapshot.docs.map((scoreItemDoc) => ({
    id: scoreItemDoc.id,
    data: scoreItemDoc.data(),
  }));
}

export async function upsertEnrollment(
  courseId: string,
  uid: string,
  input: {
    displayName: string;
    email: string;
    status: Enrollment["status"];
    studentId: string;
  },
) {
  await setDoc(getEnrollmentDocRef(courseId, uid), {
    uid,
    ...input,
    source: "admin",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function buildStudentEmail(studentId: string) {
  return `${studentId}@student.sru.ac.th`;
}

export function isValidStudentId(studentId: string) {
  return /^\d{13}$/.test(studentId);
}

export async function upsertRosterEntry(
  courseId: string,
  input: {
    displayName?: string;
    section?: string;
    status: RosterEntry["status"];
    studentId: string;
  },
) {
  if (!isValidStudentId(input.studentId)) {
    throw new Error("รหัสนักศึกษาต้องเป็นตัวเลข 13 หลัก");
  }

  const payload: {
    createdAt: ReturnType<typeof serverTimestamp>;
    displayName?: string;
    email: string;
    section?: string;
    source: RosterEntry["source"];
    status: RosterEntry["status"];
    studentId: string;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    studentId: input.studentId,
    email: buildStudentEmail(input.studentId),
    status: input.status,
    source: "manual",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (input.displayName?.trim()) {
    payload.displayName = input.displayName.trim();
  }

  if (input.section?.trim()) {
    payload.section = input.section.trim();
  }

  await setDoc(getRosterDocRef(courseId, input.studentId), payload, {
    merge: true,
  });
}

export async function writeScoreImport(
  courseId: string,
  importRows: Array<{
    scores: Record<
      string,
      {
        feedback?: string;
        maxScore: number;
        published: boolean;
        score: number | null;
      }
    >;
    uid: string;
  }>,
  scoreItems: Array<{
    category: ScoreItem["category"];
    id: string;
    maxScore: number;
    order: number;
    title: string;
  }>,
) {
  const db = getDbClient();

  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  const batch = writeBatch(db);
  const now = serverTimestamp();

  scoreItems.forEach((scoreItem) => {
    batch.set(
      getScoreItemDocRef(courseId, scoreItem.id),
      {
        title: scoreItem.title,
        maxScore: scoreItem.maxScore,
        category: scoreItem.category,
        isPublished: true,
        order: scoreItem.order,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  importRows.forEach((row) => {
    const scores = Object.fromEntries(
      Object.entries(row.scores).map(([scoreItemId, score]) => {
        const scorePayload: {
          feedback?: string;
          maxScore: number;
          published: boolean;
          score: number | null;
          updatedAt: ReturnType<typeof serverTimestamp>;
        } = {
          maxScore: score.maxScore,
          published: score.published,
          score: score.score,
          updatedAt: now,
        };

        if (score.feedback) {
          scorePayload.feedback = score.feedback;
        }

        return [scoreItemId, scorePayload];
      }),
    );

    batch.set(
      getStudentScoreDocRef(courseId, row.uid),
      {
        uid: row.uid,
        courseId,
        scores,
        updatedAt: now,
      },
      { merge: true },
    );
  });

  await batch.commit();
}
