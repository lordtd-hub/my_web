import {
  collectionGroup,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDbClient } from "../../lib/firebase/app";
import {
  getCourseDocRef,
  getEnrollmentDocRef,
} from "../../lib/firestore/refs";
import type { Course, Enrollment, RosterEntry } from "../../lib/firestore/types";

export type StudentCourse = {
  courseId: string;
  course: Course | null;
  enrollment: Enrollment;
};

function getCourseIdFromEnrollmentDoc(
  enrollmentDoc: QueryDocumentSnapshot<Enrollment>,
) {
  return enrollmentDoc.ref.parent.parent?.id ?? null;
}

function getCourseIdFromRosterDoc(
  rosterDoc: QueryDocumentSnapshot<RosterEntry>,
) {
  return rosterDoc.ref.parent.parent?.id ?? null;
}

function parseSruStudentEmail(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  const found = normalizedEmail.match(/^(\d{13})@student\.sru\.ac\.th$/);

  return found
    ? {
        email: normalizedEmail,
        studentId: found[1],
      }
    : null;
}

async function linkRosterEnrollments(input: {
  displayName?: string | null;
  email?: string | null;
  uid: string;
}) {
  const studentEmail = parseSruStudentEmail(input.email);

  if (!studentEmail) {
    return;
  }

  const db = getDbClient();

  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  const rosterQuery = query(
    collectionGroup(db, "roster"),
    where("email", "==", studentEmail.email),
  );
  const rosterSnapshot = await getDocs(rosterQuery);
  const activeRosterEntries = rosterSnapshot.docs
    .map((rosterDoc) => {
      const courseId = getCourseIdFromRosterDoc(
        rosterDoc as QueryDocumentSnapshot<RosterEntry>,
      );

      if (!courseId) {
        return null;
      }

      return {
        courseId,
        roster: rosterDoc.data() as RosterEntry,
      };
    })
    .filter(
      (item): item is { courseId: string; roster: RosterEntry } =>
        item !== null && item.roster.status === "active",
    );

  await Promise.all(
    activeRosterEntries.map(async ({ courseId, roster }) => {
      const enrollmentRef = getEnrollmentDocRef(courseId, input.uid);
      const existingEnrollment = await getDoc(enrollmentRef);

      if (existingEnrollment.exists()) {
        return;
      }

      await setDoc(enrollmentRef, {
        uid: input.uid,
        studentId: roster.studentId,
        displayName:
          roster.displayName?.trim() ||
          input.displayName?.trim() ||
          roster.studentId,
        email: roster.email,
        section: roster.section,
        status: "active",
        source: "student-self-link",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }),
  );
}

export async function fetchStudentCourses(input: {
  displayName?: string | null;
  email?: string | null;
  uid: string;
}): Promise<StudentCourse[]> {
  const db = getDbClient();

  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  await linkRosterEnrollments(input);

  const enrollmentsQuery = query(
    collectionGroup(db, "enrollments"),
    where("uid", "==", input.uid),
  );
  const enrollmentSnapshot = await getDocs(enrollmentsQuery);
  const enrollments = enrollmentSnapshot.docs
    .map((enrollmentDoc) => {
      const courseId = getCourseIdFromEnrollmentDoc(
        enrollmentDoc as QueryDocumentSnapshot<Enrollment>,
      );

      if (!courseId) {
        return null;
      }

      return {
        courseId,
        enrollment: enrollmentDoc.data() as Enrollment,
      };
    })
    .filter((item): item is { courseId: string; enrollment: Enrollment } =>
      Boolean(item),
    );

  const courses = await Promise.all(
    enrollments.map(async ({ courseId, enrollment }) => {
      const courseSnapshot = await getDoc(getCourseDocRef(courseId));

      return {
        courseId,
        enrollment,
        course: courseSnapshot.exists() ? courseSnapshot.data() : null,
      };
    }),
  );

  return courses.sort((a, b) => {
    const aTitle = a.course?.title ?? a.courseId;
    const bTitle = b.course?.title ?? b.courseId;

    return aTitle.localeCompare(bTitle);
  });
}
