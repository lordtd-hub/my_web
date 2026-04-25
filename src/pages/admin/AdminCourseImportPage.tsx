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
        `นำเข้าคะแนนของนักศึกษาที่ตรวจสอบแล้วจำนวน ${preview.matchedRows.length} รายการสำเร็จ`,
      );
      setConfirmWrite(false);
    } catch (writeError) {
      setError(
        writeError instanceof Error ? writeError.message : "ไม่สามารถบันทึกคะแนนที่นำเข้าได้",
      );
    } finally {
      setIsWriting(false);
    }
  }

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="นำเข้าคะแนนจาก CSV"
      description="เลือกไฟล์ CSV ตรวจสอบตัวอย่างก่อนบันทึก และนำเข้าเฉพาะแถวที่ตรงกับนักศึกษาในรายวิชา"
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
            และสามารถมีคอลัมน์คะแนนเพิ่มเติมได้
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
                <p>ไม่พบปัญหาในรูปแบบ CSV ที่ขัดขวางการนำเข้า</p>
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
              <h2>3. รายการคะแนนที่พบในไฟล์</h2>
              <div className="table-wrap mt-5">
                <table>
                  <thead>
                    <tr>
                      <th>คอลัมน์</th>
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
              <h2>4. ตัวอย่างแถวที่ตรงกับรายชื่อนักศึกษา</h2>
              {preview.matchedRows.length === 0 ? (
                <p>ไม่มีแถวใน CSV ที่ตรงกับนักศึกษาที่ลงทะเบียนในรายวิชานี้</p>
              ) : (
                <div className="table-wrap mt-5">
                  <table>
                    <thead>
                      <tr>
                        <th>แถว</th>
                        <th>รหัสนักศึกษา</th>
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
              <h2>5. ยืนยันการบันทึกคะแนน</h2>
              <p>
                ระบบจะบันทึกเฉพาะแถวที่ตรงกับนักศึกษาในรายวิชา
                และสร้างรายการคะแนนตามคอลัมน์ที่พบในไฟล์
              </p>
              <label className="checkbox-row mt-5">
                <input
                  checked={confirmWrite}
                  onChange={(event) => setConfirmWrite(event.target.checked)}
                  type="checkbox"
                />
                <span>ฉันตรวจสอบตัวอย่างแล้ว และต้องการบันทึกเฉพาะแถวที่ตรงกับรายชื่อ</span>
              </label>
              <button
                className="button-primary mt-5"
                disabled={!canWrite}
                onClick={() => void handleConfirmWrite()}
                type="button"
              >
                {isWriting ? "กำลังบันทึก..." : "บันทึกคะแนนที่ตรวจสอบแล้ว"}
              </button>
            </section>
          </div>
        ) : null}
      </AdminLayout>
    </PageShell>
  );
}
