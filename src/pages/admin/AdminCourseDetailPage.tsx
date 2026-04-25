import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import {
  fetchAdminCourse,
  fetchCourseControlSummary,
  formatCourseStatus,
  type CourseControlSummary,
  type CourseSummary,
} from "../../features/admin/adminData";
import { AdminLayout } from "./AdminLayout";

export function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [summary, setSummary] = useState<CourseControlSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadCourse() {
      if (!courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const [nextCourse, nextSummary] = await Promise.all([
          fetchAdminCourse(courseId),
          fetchCourseControlSummary(courseId),
        ]);

        if (isCurrent) {
          setCourse(nextCourse);
          setSummary(nextSummary);
        }
      } catch (courseError) {
        if (isCurrent) {
          setError(
            courseError instanceof Error
              ? courseError.message
              : "ไม่สามารถโหลดข้อมูลรายวิชาได้",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadCourse();

    return () => {
      isCurrent = false;
    };
  }, [courseId]);

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title={course?.data.title ?? "จัดการรายวิชา"}
      description="จัดการ enrollment, score items และการ import คะแนนจาก CSV สำหรับรายวิชานี้"
    >
      <AdminLayout>
        {isLoading ? (
          <div className="info-panel">
            <h2>กำลังโหลดรายวิชา</h2>
            <p>กำลังอ่าน course record...</p>
          </div>
        ) : null}

        {error ? <p className="alert-message">{error}</p> : null}

        {!isLoading && !error && !course ? (
          <div className="info-panel">
            <h2>ไม่พบรายวิชา</h2>
            <p>course ID นี้ไม่มีอยู่ หรือยังไม่สามารถเข้าถึงได้</p>
          </div>
        ) : null}

        {course ? (
          <>
            <section className="content-grid">
              <article className="info-panel">
                <p className="metadata-label">Roster</p>
                <h2>{summary?.rosterCount ?? 0}</h2>
                <p>รายชื่อจากรหัสนักศึกษาที่รอ link ด้วย Firebase Auth UID</p>
              </article>
              <article className="info-panel">
                <p className="metadata-label">Enrollments</p>
                <h2>{summary?.enrollmentCount ?? 0}</h2>
                <p>นักศึกษาที่ผูกกับ Firebase Auth UID แล้ว</p>
              </article>
              <article className="info-panel">
                <p className="metadata-label">Score Items</p>
                <h2>{summary?.scoreItemCount ?? 0}</h2>
                <p>รายการคะแนนของรายวิชานี้</p>
              </article>
              <article className="info-panel">
                <p className="metadata-label">Student Scores</p>
                <h2>{summary?.studentScoreCount ?? 0}</h2>
                <p>เอกสารคะแนนรายคนที่เขียนแล้วใน Firestore</p>
              </article>
            </section>

            <div className="content-grid mt-6">
            <article className="info-panel">
              <p className="metadata-label">{course.data.term}</p>
              <h2>รายละเอียดรายวิชา</h2>
              <p>{course.data.description}</p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink">รหัสวิชา</dt>
                  <dd className="mt-1 text-ink/65">
                    {course.data.courseCode ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">ปีการศึกษา</dt>
                  <dd className="mt-1 text-ink/65">{course.data.year}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">สถานะรายวิชา</dt>
                  <dd className="mt-1 text-ink/65">
                    {formatCourseStatus(course.data.status)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">ใช้ใน portal</dt>
                  <dd className="mt-1 text-ink/65">
                    {course.data.portalEnabled === false ? "ไม่ใช่" : "ใช่"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Section</dt>
                  <dd className="mt-1 text-ink/65">
                    {course.data.sections?.length
                      ? course.data.sections.join(", ")
                      : "-"}
                  </dd>
                </div>
              </dl>
            </article>
            <article className="info-panel">
              <h2>Roster และ enrollment</h2>
              <p>
                เพิ่มรหัสนักศึกษา, import roster CSV และตรวจสอบรายชื่อนักศึกษาก่อน import คะแนน
              </p>
              <Link
                className="button-secondary mt-5"
                to={`/admin/courses/${course.id}/students`}
              >
                จัดการ roster/enrollment
              </Link>
            </article>
            <article className="info-panel">
              <h2>รายการคะแนน</h2>
              <p>ตรวจสอบ score columns ที่สร้างจากการ import</p>
              <Link
                className="button-secondary mt-5"
                to={`/admin/courses/${course.id}/scores`}
              >
                ดูรายการคะแนน
              </Link>
            </article>
            <article className="info-panel">
              <h2>Import คะแนนจาก CSV</h2>
              <p>อ่านไฟล์ ตรวจสอบ preview และเขียนเฉพาะแถวที่ match แล้ว</p>
              <Link
                className="button-primary mt-5"
                to={`/admin/courses/${course.id}/import`}
              >
                Import คะแนน
              </Link>
            </article>
            </div>
          </>
        ) : null}
      </AdminLayout>
    </PageShell>
  );
}
