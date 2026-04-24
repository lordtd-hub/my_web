import {
  collectionGroup,
  getDoc,
  getDocs,
  query,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDbClient } from "../../lib/firebase/app";
import { getCourseDocRef } from "../../lib/firestore/refs";
import type { Course, Enrollment } from "../../lib/firestore/types";

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

export async function fetchStudentCourses(uid: string): Promise<StudentCourse[]> {
  const db = getDbClient();

  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  const enrollmentsQuery = query(
    collectionGroup(db, "enrollments"),
    where("uid", "==", uid),
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
