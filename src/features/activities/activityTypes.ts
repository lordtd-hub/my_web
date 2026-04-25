export type ActivityType =
  | "lesson"
  | "interactive"
  | "quiz"
  | "mission"
  | "game"
  | "external";

export type ActivityVisibility = "public" | "enrolled";

export type ActivityScoringMode =
  | "practice"
  | "manualReview"
  | "autoPractice"
  | "official";

export type ActivityStatus =
  | "started"
  | "submitted"
  | "completed"
  | "reviewed"
  | "rejected";

export type Activity = {
  id: string;
  courseId: string;
  moduleId?: string;
  title: string;
  description: string;
  type: ActivityType;
  visibility: ActivityVisibility;
  scoringMode: ActivityScoringMode;
  maxAttempts?: number;
  maxScore?: number;
  xp?: number;
  outcomes: string[];
  scoreItemId?: string;
  sourceUrl?: string;
  isPublished: boolean;
  order: number;
};

export type ActivityResult = {
  status: Extract<ActivityStatus, "started" | "submitted" | "completed">;
  score?: number;
  maxScore?: number;
  accuracy?: number;
  xpEarned?: number;
  answers?: unknown;
  evidence?: unknown;
};

export type ActivityAttempt = {
  id: string;
  uid: string;
  courseId: string;
  activityId: string;
  status: ActivityStatus;
  result: ActivityResult;
  createdAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
};

export type StudentProgress = {
  uid: string;
  courseId: string;
  completedActivities: string[];
  xp: number;
  badges: string[];
  outcomeProgress: Record<string, number>;
  updatedAt: Date;
};

export type ActivityAdapter = {
  type: ActivityType;
  collectResult: () => ActivityResult;
  validateResult: (result: ActivityResult) => boolean;
};
