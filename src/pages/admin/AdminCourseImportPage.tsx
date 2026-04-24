import { ChangeEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import {
  fetchCourseEnrollments,
  writeScoreImport,
} from "../../features/admin/adminData";
import {
  buildCsvImportPreview,
  type CsvImportPreview,
} from "../../features/admin/csvImport";
import { AdminLayout } from "./AdminLayout";

export function AdminCourseImportPage() {
  const { courseId } = useParams();
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<CsvImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [confirmWrite, setConfirmWrite] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function formatCategory(category: string) {
    const labels: Record<string, string> = {
      attendance: "การเข้าเรียน",
      final: "ปลายภาค",
      homework: "การบ้าน",
      midterm: "กลางภาค",
      other: "อื่น ๆ",
      quiz: "แบบทดสอบ",
    };

    return labels[category] ?? category;
  }

  const canWrite = useMemo(
    () =>
      Boolean(
        courseId &&
          preview &&
          preview.issues.length === 0 &&
          preview.matchedRows.length > 0 &&
          confirmWrite &&
          !isWriting,
      ),
    [confirmWrite, courseId, isWriting, preview],
  );

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setPreview(null);
    setError(null);
    setSuccessMessage(null);
    setConfirmWrite(false);

    if (!file || !courseId) {
      setFileName(null);
      return;
    }

    setFileName(file.name);
    setIsParsing(true);

    try {
      const [csvText, enrollments] = await Promise.all([
        file.text(),
        fetchCourseEnrollments(courseId),
      ]);
      setPreview(buildCsvImportPreview(csvText, enrollments));
    } catch (parseError) {
      setError(
        parseError instanceof Error ? parseError.message : "ไม่สามารถอ่าน CSV ได้",
      );
    } finally {
      setIsParsing(false);
    }
  }

  async function handleConfirmWrite() {
    if (!courseId || !preview || !canWrite) {
      return;
    }

    setIsWriting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await writeScoreImport(courseId, preview.matchedRows, preview.scoreColumns);
      setSuccessMessage(
        `Import score documents ที่ match แล้วจำนวน ${preview.matchedRows.length} รายการสำเร็จ`,
      );
      setConfirmWrite(false);
    } catch (writeError) {
      setError(
        writeError instanceof Error ? writeError.message : "ไม่สามารถเขียนข้อมูลจาก import ได้",
      );
    } finally {
      setIsWriting(false);
    }
  }

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="Import คะแนนจาก CSV"
      description="ไฟล์ CSV จะถูกอ่านใน browser เท่านั้น ไม่ upload ไป Cloud Storage และจะเขียนเฉพาะแถวที่ match กับนักศึกษาที่ลงทะเบียนแล้ว"
    >
      <AdminLayout>
        <div className="mb-6">
          <Link className="text-link" to={`/admin/courses/${courseId}`}>
            กลับไปรายวิชา
          </Link>
        </div>

        <section className="form-panel">
          <h2 className="text-xl font-semibold text-ink">1. เลือกไฟล์ CSV</h2>
          <p className="text-sm leading-6 text-ink/65">
            รูปแบบเริ่มต้น: `studentId,email,displayName,quiz1,quiz2,midterm`
            และสามารถมี score columns เพิ่มเติมได้
          </p>
          <label>
            <span>ไฟล์ CSV</span>
            <input accept=".csv,text/csv" onChange={(event) => void handleFileChange(event)} type="file" />
          </label>
          {fileName ? <p className="text-sm text-ink/65">ไฟล์ที่เลือก: {fileName}</p> : null}
          {isParsing ? <p className="text-sm text-ink/65">กำลังอ่านและตรวจสอบข้อมูล...</p> : null}
        </section>

        {error ? <p className="alert-message mt-6">{error}</p> : null}
        {successMessage ? <p className="success-message mt-6">{successMessage}</p> : null}

        {preview ? (
          <div className="mt-6 grid gap-6">
            <section className="info-panel">
              <h2>2. ตรวจสอบข้อมูล</h2>
              {preview.issues.length === 0 ? (
                <p>ไม่พบปัญหารูปแบบ CSV ที่ขัดขวางการ import</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {preview.issues.map((issue) => (
                    <li className="alert-message" key={issue.message}>
                      {issue.message}
                    </li>
                  ))}
                </ul>
              )}
              {preview.skippedRows.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-base font-semibold text-ink">แถวที่ถูกข้าม</h3>
                  <ul className="mt-3 space-y-2">
                    {preview.skippedRows.map((issue) => (
                      <li className="check-row" key={`${issue.rowNumber}-${issue.message}`}>
                        แถว {issue.rowNumber}: {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section className="info-panel">
              <h2>3. Score columns</h2>
              <div className="table-wrap mt-5">
                <table>
                  <thead>
                    <tr>
                      <th>Column</th>
                      <th>ประเภท</th>
                      <th>คะแนนเต็ม</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.scoreColumns.map((column) => (
                      <tr key={column.id}>
                        <td>{column.title}</td>
                        <td>{formatCategory(column.category)}</td>
                        <td>{column.maxScore}</td>
                        <td>{column.feedbackColumn ?? "ไม่มี"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="info-panel">
              <h2>4. Preview แถวที่ match แล้ว</h2>
              {preview.matchedRows.length === 0 ? (
                <p>ไม่มีแถวใน CSV ที่ match กับนักศึกษาที่ลงทะเบียน</p>
              ) : (
                <div className="table-wrap mt-5">
                  <table>
                    <thead>
                      <tr>
                        <th>แถว</th>
                        <th>Student ID</th>
                        <th>ชื่อ</th>
                        <th>Email</th>
                        <th>จำนวนคะแนน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.matchedRows.map((row) => (
                        <tr key={`${row.rowNumber}-${row.studentId}`}>
                          <td>{row.rowNumber}</td>
                          <td>{row.studentId}</td>
                          <td>{row.displayName}</td>
                          <td>{row.email}</td>
                          <td>{Object.keys(row.scores).length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="info-panel">
              <h2>5. ยืนยันการเขียนลง Firestore</h2>
              <p>
                ระบบจะเขียนเฉพาะแถวที่ match แล้วไปที่
                <code>courses/{"{courseId}"}/studentScores/{"{uid}"}</code> และ
                สร้าง score item metadata สำหรับ score columns ที่ import
              </p>
              <label className="checkbox-row mt-5">
                <input
                  checked={confirmWrite}
                  onChange={(event) => setConfirmWrite(event.target.checked)}
                  type="checkbox"
                />
                <span>ฉันตรวจสอบ preview แล้ว และต้องการเขียนเฉพาะแถวที่ match แล้ว</span>
              </label>
              <button
                className="button-primary mt-5"
                disabled={!canWrite}
                onClick={() => void handleConfirmWrite()}
                type="button"
              >
                {isWriting ? "กำลังเขียน..." : "เขียนคะแนนที่ match แล้ว"}
              </button>
            </section>
          </div>
        ) : null}
      </AdminLayout>
    </PageShell>
  );
}
