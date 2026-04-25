export type BloomCognitiveLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export type AssessmentEvidenceType =
  | "completion"
  | "accuracy"
  | "rubric"
  | "reflection"
  | "artifact"
  | "teacherReview";

export type ReviewPolicy =
  | "practiceOnly"
  | "autoPractice"
  | "manualReviewRequired"
  | "adminApprovedTransfer";

export type CourseLearningOutcome = {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  bloomLevel: BloomCognitiveLevel;
  attainmentTarget?: number;
  isCore: boolean;
  order: number;
};

export type CourseModule = {
  id: string;
  courseCode: string;
  title: string;
  description?: string;
  outcomeIds: string[];
  order: number;
};

export type AssessmentComponentType =
  | "practice"
  | "quiz"
  | "assignment"
  | "mission"
  | "project"
  | "exam"
  | "participation"
  | "other";

export type AssessmentComponent = {
  id: string;
  courseCode: string;
  title: string;
  type: AssessmentComponentType;
  description?: string;
  weight?: number;
  outcomeIds: string[];
  isOfficialScoreComponent: boolean;
  scoreItemId?: string;
  order: number;
};

export type ActivityAssessmentMapping = {
  activityId: string;
  courseCode: string;
  outcomeId: string;
  bloomLevel: BloomCognitiveLevel;
  evidenceType: AssessmentEvidenceType;
  weight: number;
  minimumPerformance?: number;
  contributesToOfficialScore: boolean;
  scoreItemId?: string;
  reviewPolicy: ReviewPolicy;
};

export type RubricLevel = {
  id: string;
  label: string;
  points: number;
  description: string;
};

export type RubricCriterion = {
  id: string;
  title: string;
  outcomeId: string;
  bloomLevel: BloomCognitiveLevel;
  maxPoints: number;
  levels: RubricLevel[];
};

export type BadgeRule = {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  outcomeIds: string[];
  requiredActivityIds?: string[];
  minimumProgress?: number;
  minimumAccuracy?: number;
  reviewRequired: boolean;
};

export type CourseAssessmentTemplate = {
  courseCode: string;
  courseTitle: string;
  academicYear: number;
  term: string;
  sections: string[];
  learningOutcomes: CourseLearningOutcome[];
  modules: CourseModule[];
  assessmentComponents: AssessmentComponent[];
  activityMappings: ActivityAssessmentMapping[];
  rubricCriteria: RubricCriterion[];
  badgeRules: BadgeRule[];
};

export type OutcomeAttainmentLevel =
  | "notStarted"
  | "emerging"
  | "developing"
  | "proficient"
  | "exceeded";

export type CloAttainmentSummary = {
  outcomeId: string;
  progressPercent: number;
  attainmentLevel: OutcomeAttainmentLevel;
  evidenceCount: number;
  lastUpdatedAt: Date;
};
