import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { useStudentCourses } from "../../features/courses/useStudentCourses";

function formatEnrollmentStatus(status: string) {
  return status === "active" ? "ใช้งานอยู่" : "ไม่ใช้งาน";
}

export function StudentCoursesPage() {
  const { courses, error, isLoading } = useStudentCourses();

  return (
    <PageShell
      eyebrow="ระบบนักศึกษา"
      title="รายวิชาของฉัน"
      description="ระบบแสดงรายวิชาจาก enrollment documents ที่ผูกกับ Firebase Auth UID ของผู้ที่เข้าสู่ระบบ"
    >
      {isLoading ? (
        <div className="info-panel">
          <h2>กำลังโหลดรายวิชา</h2>
          <p>กำลังตรวจสอบข้อมูล enrollment ของท่าน...</p>
        </div>
      ) : null}

      {error ? <p className="alert-message">{error}</p> : null}

      {!isLoading && !error && courses.length === 0 ? (
        <div className="info-panel">
          <h2>ยังไม่พบรายวิชาที่ลงทะเบียน</h2>
          <p>
            เมื่ออาจารย์หรือผู้ดูแลระบบสร้าง enrollment document สำหรับ Firebase Auth UID
            ของท่าน รายวิชาจะปรากฏในหน้านี้
          </p>
        </div>
      ) : null}

      {courses.length > 0 ? (
        <div className="content-grid">
          {courses.map(({ course, courseId, enrollment }) => (
            <article className="info-panel" key={courseId}>
              <p className="metadata-label">{course?.term ?? "รอข้อมูลภาคการศึกษา"}</p>
              <h2>{course?.title ?? "รอชื่อรายวิชา"}</h2>
              <p>{course?.description ?? "รอคำอธิบายรายวิชา"}</p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink">สถานะ</dt>
                  <dd className="mt-1 text-ink/65">
                    {formatEnrollmentStatus(enrollment.status)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">ปีการศึกษา</dt>
                  <dd className="mt-1 text-ink/65">
                    {course?.year ?? "รอข้อมูล"}
                  </dd>
                </div>
              </dl>
              <Link className="button-primary mt-5" to={`/student/courses/${courseId}/scores`}>
                ดูคะแนนของฉัน
              </Link>
            </article>
          ))}
        </div>
      ) : null}
    </PageShell>
  );
}
