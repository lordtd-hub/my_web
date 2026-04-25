import { parseCsv } from "../../lib/csv/parseCsv";
import type { RosterEntry } from "../../lib/firestore/types";
import { buildStudentEmail, isValidStudentId } from "./adminData";

const REQUIRED_COLUMNS = ["studentId"];

export type RosterImportIssue = {
  message: string;
  rowNumber?: number;
};

export type RosterImportRow = {
  displayName?: string;
  email: string;
  rowNumber: number;
  section?: string;
  status: RosterEntry["status"];
  studentId: string;
};

export type RosterImportPreview = {
  issues: RosterImportIssue[];
  rows: RosterImportRow[];
  skippedRows: RosterImportIssue[];
};

function parseRosterStatus(value: string): RosterEntry["status"] | null {
  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized === "active" || normalized === "ใช้งานอยู่") {
    return "active";
  }

  if (
    normalized === "inactive" ||
    normalized === "ไม่ใช้งาน" ||
    normalized === "drop" ||
    normalized === "dropped"
  ) {
    return "inactive";
  }

  return null;
}

export function buildRosterImportPreview(csvText: string): RosterImportPreview {
  const parsed = parseCsv(csvText);
  const issues: RosterImportIssue[] = [];
  const skippedRows: RosterImportIssue[] = [];
  const rows: RosterImportRow[] = [];
  const seenStudentIds = new Set<string>();

  REQUIRED_COLUMNS.forEach((column) => {
    if (!parsed.headers.includes(column)) {
      issues.push({
        message: `ไม่พบคอลัมน์ที่จำเป็น: ${column}`,
      });
    }
  });

  if (issues.length > 0) {
    return {
      issues,
      rows,
      skippedRows,
    };
  }

  parsed.rows.forEach((row, rowIndex) => {
    const rowNumber = rowIndex + 2;
    const studentId = row.studentId?.trim() ?? "";
    const displayName = row.displayName?.trim() || undefined;
    const section = row.section?.trim() || undefined;
    const status = parseRosterStatus(row.status ?? "");

    if (!isValidStudentId(studentId)) {
      skippedRows.push({
        rowNumber,
        message: "รหัสนักศึกษาต้องเป็นตัวเลข 13 หลัก",
      });
      return;
    }

    if (seenStudentIds.has(studentId)) {
      skippedRows.push({
        rowNumber,
        message: "พบรหัสนักศึกษาซ้ำในไฟล์ CSV",
      });
      return;
    }

    if (!status) {
      skippedRows.push({
        rowNumber,
        message: "สถานะต้องเป็น active, inactive หรือเว้นว่าง",
      });
      return;
    }

    seenStudentIds.add(studentId);
    rows.push({
      rowNumber,
      studentId,
      email: buildStudentEmail(studentId),
      displayName,
      section,
      status,
    });
  });

  return {
    issues,
    rows,
    skippedRows,
  };
}
