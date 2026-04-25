import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import {
  buildStudentEmail,
  fetchCourseEnrollments,
  fetchCourseRoster,
  isValidStudentId,
  upsertEnrollment,
  upsertRosterEntry,
  type EnrollmentSummary,
  type RosterEntrySummary,
} from "../../features/admin/adminData";
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

  const loadEnrollments = useCallback(async (targetCourseId: string) => {
    try {
      return await fetchCourseEnrollments(targetCourseId);
    } catch (enrollmentError) {
      throw enrollmentError instanceof Error
        ? enrollmentError
        : new Error("ไม่สามารถโหลด enrollments ได้");
    }
  }, []);

  const loadRoster = useCallback(async (targetCourseId: string) => {
    try {
      return await fetchCourseRoster(targetCourseId);
    } catch (rosterError) {
      throw rosterError instanceof Error
        ? rosterError
        : new Error("ไม่สามารถโหลด roster ได้");
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
              : "ไม่สามารถโหลด enrollments ได้",
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
          : "ไม่สามารถโหลด enrollments ได้",
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
      setError("กรุณากรอก UID, studentId, displayName และ email ให้ครบถ้วน");
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
          : "ไม่สามารถบันทึก enrollment ได้",
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
          : "ไม่สามารถบันทึก roster ได้",
      );
    } finally {
      setIsSavingRoster(false);
    }
  }

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="นักศึกษาที่ลงทะเบียน"
      description="Enrollment document ID ต้องเป็น Firebase Auth UID ส่วน studentId ใช้เป็น metadata เท่านั้น"
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
            `รหัสนักศึกษา@student.sru.ac.th` และรอให้นักศึกษา login เพื่อ link
            กับ Firebase Auth UID ของตนเอง
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
              <span>Section / กลุ่มเรียน</span>
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
            {isSavingRoster ? "กำลังบันทึก..." : "เพิ่มเข้า roster"}
          </button>
        </form>

        <form className="form-panel" onSubmit={(event) => void handleSubmit(event)}>
          <h2 className="text-xl font-semibold text-ink">เพิ่มหรือแก้ไข enrollment</h2>
          <label>
            <span>Firebase Auth UID</span>
            <input name="uid" placeholder="auth uid" required />
          </label>
          <div className="form-grid">
            <label>
              <span>Student ID</span>
              <input name="studentId" placeholder="studentId สำหรับแสดงผล" required />
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
            {isSaving ? "กำลังบันทึก..." : "บันทึก enrollment"}
          </button>
        </form>

        {error ? <p className="alert-message mt-6">{error}</p> : null}

        <section className="info-panel mt-6">
          <h2>Roster จากรหัสนักศึกษา</h2>
          {isLoading ? <p>กำลังโหลด roster...</p> : null}
          {!isLoading && roster.length === 0 ? (
            <p>ยังไม่มีรายชื่อรอ link ด้วยรหัสนักศึกษา</p>
          ) : null}
          {roster.length > 0 ? (
            <div className="table-wrap mt-5">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Email ที่สร้างจากรหัส</th>
                    <th>Section</th>
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
          {isLoading ? <p>กำลังโหลด enrollments...</p> : null}
          {!isLoading && enrollments.length === 0 ? (
            <p>ยังไม่พบนักศึกษาที่ลงทะเบียนในรายวิชานี้</p>
          ) : null}
          {enrollments.length > 0 ? (
            <div className="table-wrap mt-5">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
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
