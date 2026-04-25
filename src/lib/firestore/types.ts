import type { Timestamp } from "firebase/firestore";

export type UserProfile = {
  email: string;
  displayName: string;
  studentId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type AdminProfile = {
  email: string;
  createdAt: Timestamp;
};

export type Course = {
  title: string;
  slug: string;
  courseCode?: string;
  term: string;
  year: number;
  description: string;
  isPublic: boolean;
  portalEnabled?: boolean;
  sections?: string[];
  status?: "draft" | "active" | "archived";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Enrollment = {
  uid: string;
  studentId: string;
  displayName: string;
  email: string;
  section?: string;
  source?: "admin" | "student-self-link";
  status: "active" | "inactive";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export type RosterEntry = {
  studentId: string;
  email: string;
  displayName?: string;
  section?: string;
  status: "active" | "inactive";
  source: "registrar-import" | "manual";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CourseAnnouncement = {
  title: string;
  body: string;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type ScoreItem = {
  title: string;
  maxScore: number;
  weight?: number;
  category: "quiz" | "homework" | "midterm" | "final" | "attendance" | "other";
  isPublished: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type StudentScore = {
  uid: string;
  courseId: string;
  scores: Record<
    string,
    {
      score: number | null;
      maxScore: number;
      feedback?: string;
      published: boolean;
      updatedAt: Timestamp;
    }
  >;
  updatedAt: Timestamp;
};
