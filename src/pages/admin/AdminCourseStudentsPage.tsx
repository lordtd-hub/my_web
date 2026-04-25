import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import {
  buildStudentEmail,
  fetchCourseEnrollments,
  fetchCourseRoster,
  isValidStudentId,
  upsertEnrollment,
  upsertRosterEntry,
  writeRosterImport,
  type EnrollmentSummary,
  type RosterEntrySummary,
} from "../../features/admin/adminData";
import {
  buildRosterImportPreview,
  type RosterImportPreview,
} from "../../features/admin/rosterImport";
import { AdminLayout } from "./AdminLayout";

function formatEnrollmentStatus(status: string) {
  return status === "active" ? "ใช้งานอยู่" : "ไม่ใช้งาน";
}

export function AdminCourseStudentsPage() {
  const { courseId } = useParams();
  const [enrollments, setEnrollments] = useState<EnrollmentSummary[]>([]);
  const [roster, setRoster] = useState<RosterEntrySummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingRoster, setIsSavingRoster] = useState(false);
  const [isImportingRoster, setIsImportingRoster] = useState(false);
  const [rosterFileName, setRosterFileName] = useState<string | null>(null);
  const [rosterPreview, setRosterPreview] =
    useState<RosterImportPreview | null>(null);

  const loadEnrollments = useCallback(async (targetCourseId: string) => {
    try {
      return await fetchCourseEnrollments(targetCourseId);
    } catch (enrollmentError) {
      throw enrollmentError instanceof Error
        ? enrollmentError
        : new Error("ไม่สามารถโหลดรายชื่อนักศึกษาที่ผูกบัญชีแล้วได้");
    }
  }, []);

  const loadRoster = useCallback(async (targetCourseId: string) => {
    try {
      return await fetchCourseRoster(targetCourseId);
    } catch (rosterError) {
      throw rosterError instanceof Error
        ? rosterError
        : new Error("ไม่สามารถโหลดรายชื่อจากรหัสนักศึกษาได้");
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function loadInitialEnrollments() {
      if (!courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const [nextEnrollments, nextRoster] = await Promise.all([
          loadEnrollments(courseId),
          loadRoster(courseId),
        ]);

        if (isCurrent) {
          setEnrollments(nextEnrollments);
          setRoster(nextRoster);
        }
      } catch (enrollmentError) {
        if (isCurrent) {
          setError(
            enrollmentError instanceof Error
              ? enrollmentError.message
              : "ไม่สามารถโหลดรายชื่อนักศึกษาได้",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialEnrollments();

    return () => {
      isCurrent = false;
    };
  }, [courseId, loadEnrollments, loadRoster]);

  async function refreshEnrollments() {
    if (!courseId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [nextEnrollments, nextRoster] = await Promise.all([
        loadEnrollments(courseId),
        loadRoster(courseId),
      ]);

      setEnrollments(nextEnrollments);
      setRoster(nextRoster);
    } catch (enrollmentError) {
      setError(
        enrollmentError instanceof Error
          ? enrollmentError.message
          : "ไม่สามารถโหลดรายชื่อนักศึกษาได้",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!courseId) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const uid = String(formData.get("uid") ?? "").trim();
    const studentId = String(formData.get("studentId") ?? "").trim();
    const displayName = String(formData.get("displayName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const status = String(formData.get("status") ?? "active") as
      | "active"
      | "inactive";

    if (!uid || !studentId || !displayName || !email) {
      setError("กรุณากรอก UID จากบัญชีเข้าสู่ระบบ รหัสนักศึกษา ชื่อ และ email ให้ครบถ้วน");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await upsertEnrollment(courseId, uid, {
        studentId,
        displayName,
        email,
        status,
      });
      form.reset();
      await refreshEnrollments();
    } catch (enrollmentError) {
      setError(
        enrollmentError instanceof Error
          ? enrollmentError.message
          : "ไม่สามารถบันทึกบัญชีผู้เรียนได้",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRosterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!courseId) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const studentId = String(formData.get("studentId") ?? "").trim();
    const displayName = String(formData.get("displayName") ?? "").trim();
    const section = String(formData.get("section") ?? "").trim();
    const status = String(formData.get("status") ?? "active") as
      | "active"
      | "inactive";

    if (!isValidStudentId(studentId)) {
      setError("รหัสนักศึกษาต้องเป็นตัวเลข 13 หลัก");
      return;
    }

    setIsSavingRoster(true);
    setError(null);

    try {
      await upsertRosterEntry(courseId, {
        studentId,
        displayName,
        section,
        status,
      });
      form.reset();
      await refreshEnrollments();
    } catch (rosterError) {
      setError(
        rosterError instanceof Error
          ? rosterError.message
          : "ไม่สามารถบันทึกรายชื่อจากรหัสนักศึกษาได้",
      );
    } finally {
      setIsSavingRoster(false);
    }
  }

  async function handleRosterCsvChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    setError(null);
    setRosterPreview(null);
    setRosterFileName(file?.name ?? null);

    if (!file) {
      return;
    }

    try {
      const csvText = await file.text();
      setRosterPreview(buildRosterImportPreview(csvText));
    } catch (csvError) {
      setError(
        csvError instanceof Error
          ? csvError.message
          : "ไม่สามารถอ่านไฟล์รายชื่อ CSV ได้",
      );
    }
  }

  async function handleRosterImportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!courseId || !rosterPreview || rosterPreview.rows.length === 0) {
      return;
    }

    if (rosterPreview.issues.length > 0) {
      setError("ยังมีปัญหาในไฟล์ CSV กรุณาแก้ไขก่อนนำเข้ารายชื่อ");
      return;
    }

    setIsImportingRoster(true);
    setError(null);

    try {
      await writeRosterImport(
        courseId,
        rosterPreview.rows.map((row) => ({
          studentId: row.studentId,
          displayName: row.displayName,
          section: row.section,
          status: row.status,
        })),
      );
      setRosterPreview(null);
      setRosterFileName(null);
      event.currentTarget.reset();
      await refreshEnrollments();
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "ไม่สามารถนำเข้ารายชื่อ CSV ได้",
      );
    } finally {
      setIsImportingRoster(false);
    }
  }

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="นักศึกษาที่ลงทะเบียน"
      description="จัดการรายชื่อผู้เรียนของรายวิชานี้ ทั้งรายชื่อจากรหัสนักศึกษาและบัญชีที่เข้าสู่ระบบแล้ว"
    >
      <AdminLayout>
        <form
          className="form-panel"
          onSubmit={(event) => void handleRosterSubmit(event)}
        >
          <h2 className="text-xl font-semibold text-ink">
            เพิ่มรายชื่อด้วยรหัสนักศึกษา
          </h2>
          <p className="text-sm leading-6 text-ink/65">
            ใช้หลังรายชื่อเพิ่ม-ถอนนิ่งแล้ว ระบบจะสร้าง email ให้อัตโนมัติเป็น
            รหัสนักศึกษา@student.sru.ac.th และรอให้นักศึกษาเข้าสู่ระบบเพื่อผูกบัญชีของตนเอง
          </p>
          <div className="form-grid">
            <label>
              <span>รหัสนักศึกษา 13 หลัก</span>
              <input
                inputMode="numeric"
                maxLength={13}
                name="studentId"
                pattern="\d{13}"
                placeholder="เช่น 6612345678901"
                required
              />
            </label>
            <label>
              <span>กลุ่มเรียน</span>
              <input name="section" placeholder="เช่น P01 หรือ P02" />
            </label>
          </div>
          <div className="form-grid">
            <label>
              <span>ชื่อที่แสดง (ถ้ามี)</span>
              <input name="displayName" placeholder="เว้นว่างได้" />
            </label>
            <label>
              <span>สถานะ</span>
              <select name="status">
                <option value="active">ใช้งานอยู่</option>
                <option value="inactive">ไม่ใช้งาน</option>
              </select>
            </label>
          </div>
          <button className="button-primary" disabled={isSavingRoster} type="submit">
            {isSavingRoster ? "กำลังบันทึก..." : "เพิ่มเข้ารายชื่อ"}
          </button>
        </form>

        <form
          className="form-panel"
          onSubmit={(event) => void handleRosterImportSubmit(event)}
        >
          <h2 className="text-xl font-semibold text-ink">
            นำเข้ารายชื่อจาก CSV
          </h2>
          <p className="text-sm leading-6 text-ink/65">
            ใช้ไฟล์รายชื่อนักศึกษาหลังเพิ่ม-ถอนนิ่งแล้ว ระบบต้องการคอลัมน์
            studentId และจะสร้าง email ให้อัตโนมัติเป็น
            studentId@student.sru.ac.th โดยไม่รับคะแนนจากไฟล์นี้
          </p>
          <label>
            <span>ไฟล์รายชื่อ CSV</span>
            <input
              accept=".csv,text/csv"
              name="rosterCsv"
              onChange={(event) => void handleRosterCsvChange(event)}
              type="file"
            />
          </label>
          <div className="info-panel mt-4">
            <h3 className="text-base font-semibold text-ink">รูปแบบ CSV</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              คอลัมน์ที่รองรับ: studentId, section, displayName,
              status โดย status เว้นว่างได้และจะถือว่าใช้งานอยู่
            </p>
          </div>
          {rosterFileName ? (
            <p className="mt-4 text-sm text-ink/65">
              ไฟล์ที่เลือก: {rosterFileName}
            </p>
          ) : null}
          {rosterPreview ? (
            <div className="mt-5 space-y-4">
              {rosterPreview.issues.length > 0 ? (
                <div className="alert-message">
                  {rosterPreview.issues.map((issue) => (
                    <p key={issue.message}>{issue.message}</p>
                  ))}
                </div>
              ) : null}
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="status-pill">
                  พร้อมนำเข้า {rosterPreview.rows.length} แถว
                </div>
                <div className="status-pill">
                  ข้าม {rosterPreview.skippedRows.length} แถว
                </div>
              </div>
              {rosterPreview.rows.length > 0 ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>แถว</th>
                        <th>รหัสนักศึกษา</th>
                        <th>Email</th>
                        <th>กลุ่มเรียน</th>
                        <th>สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rosterPreview.rows.slice(0, 10).map((row) => (
                        <tr key={`${row.rowNumber}-${row.studentId}`}>
                          <td>{row.rowNumber}</td>
                          <td>{row.studentId}</td>
                          <td>{row.email}</td>
                          <td>{row.section ?? "-"}</td>
                          <td>{formatEnrollmentStatus(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {rosterPreview.rows.length > 10 ? (
                    <p className="mt-3 text-sm text-ink/65">
                      แสดงตัวอย่าง 10 แถวแรกจาก {rosterPreview.rows.length} แถว
                    </p>
                  ) : null}
                </div>
              ) : null}
              {rosterPreview.skippedRows.length > 0 ? (
                <div className="alert-message">
                  {rosterPreview.skippedRows.slice(0, 5).map((issue) => (
                    <p key={`${issue.rowNumber}-${issue.message}`}>
                      แถว {issue.rowNumber}: {issue.message}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          <button
            className="button-primary mt-5"
            disabled={
              isImportingRoster ||
              !rosterPreview ||
              rosterPreview.rows.length === 0 ||
              rosterPreview.issues.length > 0
            }
            type="submit"
          >
            {isImportingRoster ? "กำลังนำเข้า..." : "นำเข้ารายชื่อ"}
          </button>
        </form>

        <form className="form-panel" onSubmit={(event) => void handleSubmit(event)}>
          <h2 className="text-xl font-semibold text-ink">เพิ่มหรือแก้ไขบัญชีผู้เรียน</h2>
          <label>
            <span>UID จากบัญชีเข้าสู่ระบบ</span>
              <input name="uid" placeholder="UID จากบัญชีที่เข้าสู่ระบบ" required />
          </label>
          <div className="form-grid">
            <label>
              <span>รหัสนักศึกษา</span>
              <input name="studentId" placeholder="รหัสนักศึกษาสำหรับแสดงผล" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" placeholder="student@example.edu" required type="email" />
            </label>
          </div>
          <div className="form-grid">
            <label>
              <span>ชื่อที่แสดง</span>
              <input name="displayName" placeholder="ชื่อนักศึกษา" required />
            </label>
            <label>
              <span>สถานะ</span>
              <select name="status">
                <option value="active">ใช้งานอยู่</option>
                <option value="inactive">ไม่ใช้งาน</option>
              </select>
            </label>
          </div>
          <button className="button-primary" disabled={isSaving} type="submit">
            {isSaving ? "กำลังบันทึก..." : "บันทึกบัญชีผู้เรียน"}
          </button>
        </form>

        {error ? <p className="alert-message mt-6">{error}</p> : null}

        <section className="info-panel mt-6">
          <h2>รายชื่อจากรหัสนักศึกษา</h2>
          {isLoading ? <p>กำลังโหลดรายชื่อจากรหัสนักศึกษา...</p> : null}
          {!isLoading && roster.length === 0 ? (
            <p>ยังไม่มีรายชื่อรหัสนักศึกษาที่รอผูกบัญชี</p>
          ) : null}
          {roster.length > 0 ? (
            <div className="table-wrap mt-5">
              <table>
                <thead>
                  <tr>
                    <th>รหัสนักศึกษา</th>
                    <th>Email ที่สร้างจากรหัส</th>
                    <th>กลุ่มเรียน</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map(({ data, id }) => (
                    <tr key={id}>
                      <td>{data.studentId}</td>
                      <td>{data.email || buildStudentEmail(data.studentId)}</td>
                      <td>{data.section ?? "-"}</td>
                      <td>{formatEnrollmentStatus(data.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <section className="info-panel mt-6">
          <h2>รายชื่อนักศึกษาที่ลงทะเบียน</h2>
          {isLoading ? <p>กำลังโหลดรายชื่อนักศึกษาที่ผูกบัญชีแล้ว...</p> : null}
          {!isLoading && enrollments.length === 0 ? (
            <p>ยังไม่พบนักศึกษาที่ลงทะเบียนในรายวิชานี้</p>
          ) : null}
          {enrollments.length > 0 ? (
            <div className="table-wrap mt-5">
              <table>
                <thead>
                  <tr>
                    <th>รหัสนักศึกษา</th>
                    <th>ชื่อ</th>
                    <th>Email</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(({ data, id }) => (
                    <tr key={id}>
                      <td>{data.studentId}</td>
                      <td>{data.displayName}</td>
                      <td>{data.email}</td>
                      <td>{formatEnrollmentStatus(data.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </AdminLayout>
    </PageShell>
  );
}
