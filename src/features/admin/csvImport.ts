import type { Enrollment, ScoreItem } from "../../lib/firestore/types";
import { parseCsv } from "../../lib/csv/parseCsv";

const REQUIRED_COLUMNS = ["studentId", "email"];
const RESERVED_COLUMNS = new Set(["studentId", "email", "displayName"]);

export type CsvValidationIssue = {
  message: string;
  rowNumber?: number;
};

export type CsvScoreColumn = {
  category: ScoreItem["category"];
  feedbackColumn?: string;
  id: string;
  maxScore: number;
  order: number;
  title: string;
};

export type CsvMatchedRow = {
  displayName: string;
  email: string;
  rowNumber: number;
  scores: Record<
    string,
    {
      feedback?: string;
      maxScore: number;
      published: boolean;
      score: number | null;
    }
  >;
  studentId: string;
  uid: string;
};

export type CsvImportPreview = {
  issues: CsvValidationIssue[];
  matchedRows: CsvMatchedRow[];
  scoreColumns: CsvScoreColumn[];
  skippedRows: CsvValidationIssue[];
};

function normalizeHeader(header: string) {
  return header.trim();
}

function toScoreItemId(header: string) {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferCategory(header: string): ScoreItem["category"] {
  const normalized = header.toLowerCase();

  if (normalized.includes("quiz")) {
    return "quiz";
  }

  if (normalized.includes("homework") || normalized.includes("hw")) {
    return "homework";
  }

  if (normalized.includes("midterm")) {
    return "midterm";
  }

  if (normalized.includes("final")) {
    return "final";
  }

  if (normalized.includes("attendance")) {
    return "attendance";
  }

  return "other";
}

function isFeedbackColumn(header: string) {
  const normalized = header.toLowerCase();
  return normalized.endsWith("feedback") || normalized.endsWith("_feedback");
}

function parseScore(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const score = Number(value);
  return Number.isFinite(score) ? score : Number.NaN;
}

function buildEnrollmentIndexes(enrollments: Array<{ id: string; data: Enrollment }>) {
  const byStudentId = new Map<string, { id: string; data: Enrollment }>();
  const byEmail = new Map<string, { id: string; data: Enrollment }>();

  enrollments.forEach((enrollment) => {
    byStudentId.set(enrollment.data.studentId.trim().toLowerCase(), enrollment);
    byEmail.set(enrollment.data.email.trim().toLowerCase(), enrollment);
  });

  return {
    byEmail,
    byStudentId,
  };
}

function findFeedbackColumn(headers: string[], scoreHeader: string) {
  const normalized = scoreHeader.toLowerCase();
  return headers.find((header) => {
    const feedbackHeader = header.toLowerCase();
    return (
      feedbackHeader === `${normalized}feedback` ||
      feedbackHeader === `${normalized}_feedback` ||
      feedbackHeader === `${normalized} feedback`
    );
  });
}

export function buildCsvImportPreview(
  csvText: string,
  enrollments: Array<{ id: string; data: Enrollment }>,
): CsvImportPreview {
  const parsed = parseCsv(csvText);
  const headers = parsed.headers.map(normalizeHeader);
  const issues: CsvValidationIssue[] = [];

  REQUIRED_COLUMNS.forEach((column) => {
    if (!headers.includes(column)) {
      issues.push({
        message: `ไม่พบ column ที่จำเป็น: ${column}`,
      });
    }
  });

  const scoreHeaders = headers.filter(
    (header) => !RESERVED_COLUMNS.has(header) && !isFeedbackColumn(header),
  );

  if (scoreHeaders.length === 0) {
    issues.push({
      message: "ต้องมี score column อย่างน้อย 1 column",
    });
  }

  const scoreColumns = scoreHeaders.map<CsvScoreColumn>((header, index) => {
    const numericScores = parsed.rows
      .map((row) => parseScore(row[header] ?? ""))
      .filter((score): score is number => typeof score === "number" && !Number.isNaN(score));
    const maxScore = numericScores.length > 0 ? Math.max(...numericScores) : 0;

    return {
      id: toScoreItemId(header),
      title: header,
      category: inferCategory(header),
      maxScore,
      order: index + 1,
      feedbackColumn: findFeedbackColumn(headers, header),
    };
  });

  const { byEmail, byStudentId } = buildEnrollmentIndexes(enrollments);
  const matchedRows: CsvMatchedRow[] = [];
  const skippedRows: CsvValidationIssue[] = [];

  parsed.rows.forEach((row, rowIndex) => {
    const rowNumber = rowIndex + 2;
    const studentId = row.studentId?.trim() ?? "";
    const email = row.email?.trim() ?? "";

    if (!studentId || !email) {
      skippedRows.push({
        rowNumber,
        message: "แถวนี้ไม่มี studentId หรือ email",
      });
      return;
    }

    const enrollment =
      byStudentId.get(studentId.toLowerCase()) ?? byEmail.get(email.toLowerCase());

    if (!enrollment) {
      skippedRows.push({
        rowNumber,
        message: "ไม่พบนักศึกษาที่ลงทะเบียนตรงกับแถวนี้",
      });
      return;
    }

    const scores: CsvMatchedRow["scores"] = {};
    let hasInvalidScore = false;

    scoreColumns.forEach((scoreColumn) => {
      const score = parseScore(row[scoreColumn.title] ?? "");

      if (Number.isNaN(score)) {
        hasInvalidScore = true;
        skippedRows.push({
          rowNumber,
          message: `ค่าคะแนนใน column ${scoreColumn.title} ไม่ถูกต้อง`,
        });
        return;
      }

      scores[scoreColumn.id] = {
        score,
        maxScore: scoreColumn.maxScore,
        feedback: scoreColumn.feedbackColumn
          ? row[scoreColumn.feedbackColumn]?.trim() || undefined
          : undefined,
        published: true,
      };
    });

    if (hasInvalidScore) {
      return;
    }

    matchedRows.push({
      rowNumber,
      uid: enrollment.id,
      studentId,
      email,
      displayName:
        row.displayName?.trim() || enrollment.data.displayName || "รอข้อมูลชื่อที่แสดง",
      scores,
    });
  });

  return {
    issues,
    matchedRows,
    scoreColumns,
    skippedRows,
  };
}
