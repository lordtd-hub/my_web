import {
  collection,
  doc,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
} from "firebase/firestore";
import { getDbClient } from "../firebase/app";
import type {
  AdminProfile,
  Course,
  CourseAnnouncement,
  Enrollment,
  ScoreItem,
  StudentScore,
  UserProfile,
} from "./types";

function converter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>) {
      return data;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
      return snapshot.data(options) as T;
    },
  };
}

function dbOrThrow() {
  const db = getDbClient();

  if (!db) {
    throw new Error("Firestore is not configured. Add Firebase env values first.");
  }

  return db;
}

function typedDoc<T extends DocumentData>(
  path: string,
  ...pathSegments: string[]
): DocumentReference<T> {
  return doc(dbOrThrow(), path, ...pathSegments).withConverter(converter<T>());
}

function typedCollection<T extends DocumentData>(
  path: string,
  ...pathSegments: string[]
): CollectionReference<T> {
  return collection(dbOrThrow(), path, ...pathSegments).withConverter(
    converter<T>(),
  );
}

export function getAdminDocRef(uid: string) {
  return typedDoc<AdminProfile>("admins", uid);
}

export function getUserDocRef(uid: string) {
  return typedDoc<UserProfile>("users", uid);
}

export function getCoursesCollectionRef() {
  return typedCollection<Course>("courses");
}

export function getCourseDocRef(courseId: string) {
  return typedDoc<Course>("courses", courseId);
}

export function getEnrollmentDocRef(courseId: string, uid: string) {
  return typedDoc<Enrollment>("courses", courseId, "enrollments", uid);
}

export function getEnrollmentsCollectionRef(courseId: string) {
  return typedCollection<Enrollment>("courses", courseId, "enrollments");
}

export function getAnnouncementsCollectionRef(courseId: string) {
  return typedCollection<CourseAnnouncement>(
    "courses",
    courseId,
    "announcements",
  );
}

export function getScoreItemsCollectionRef(courseId: string) {
  return typedCollection<ScoreItem>("courses", courseId, "scoreItems");
}

export function getScoreItemDocRef(courseId: string, scoreItemId: string) {
  return typedDoc<ScoreItem>("courses", courseId, "scoreItems", scoreItemId);
}

export function getOwnStudentScoreDocRef(courseId: string, uid: string) {
  return typedDoc<StudentScore>("courses", courseId, "studentScores", uid);
}

export function getStudentScoreDocRef(courseId: string, uid: string) {
  return typedDoc<StudentScore>("courses", courseId, "studentScores", uid);
}
