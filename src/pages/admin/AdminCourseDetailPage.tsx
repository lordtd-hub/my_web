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
      description="จัดการรายชื่อนักศึกษา รายการคะแนน และการนำเข้าคะแนนจาก CSV สำหรับรายวิชานี้"
    >
      <AdminLayout>
        {isLoading ? (
          <div className="info-panel">
            <h2>กำลังโหลดรายวิชา</h2>
            <p>กำลังโหลดข้อมูลรายวิชา...</p>
          </div>
        ) : null}

        {error ? <p className="alert-message">{error}</p> : null}

        {!isLoading && !error && !course ? (
          <div className="info-panel">
            <h2>ไม่พบรายวิชา</h2>
            <p>ไม่พบรายวิชานี้ หรือบัญชีของท่านอาจยังไม่มีสิทธิ์เข้าถึง</p>
          </div>
        ) : null}

        {course ? (
          <>
            <section className="content-grid">
              <article className="info-panel">
                <p className="metadata-label">รายชื่อรอผูกบัญชี</p>
                <h2>{summary?.rosterCount ?? 0}</h2>
                <p>รายชื่อจากรหัสนักศึกษาที่ยังรอการเข้าสู่ระบบครั้งแรก</p>
              </article>
              <article className="info-panel">
                <p className="metadata-label">บัญชีผู้เรียน</p>
                <h2>{summary?.enrollmentCount ?? 0}</h2>
                <p>นักศึกษาที่ผูกกับบัญชีเข้าสู่ระบบแล้ว</p>
              </article>
              <article className="info-panel">
                <p className="metadata-label">รายการคะแนน</p>
                <h2>{summary?.scoreItemCount ?? 0}</h2>
                <p>รายการคะแนนของรายวิชานี้</p>
              </article>
              <article className="info-panel">
                <p className="metadata-label">คะแนนรายคน</p>
                <h2>{summary?.studentScoreCount ?? 0}</h2>
                <p>รายการคะแนนรายคนที่บันทึกไว้แล้ว</p>
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
                  <dt className="font-semibold text-ink">กลุ่มเรียน</dt>
                  <dd className="mt-1 text-ink/65">
                    {course.data.sections?.length
                      ? course.data.sections.join(", ")
                      : "-"}
                  </dd>
                </div>
              </dl>
            </article>
            <article className="info-panel">
              <h2>รายชื่อนักศึกษา</h2>
              <p>
                เพิ่มรหัสนักศึกษา นำเข้ารายชื่อจาก CSV และตรวจสอบรายชื่อนักศึกษาก่อนนำเข้าคะแนน
              </p>
              <Link
                className="button-secondary mt-5"
                to={`/admin/courses/${course.id}/students`}
              >
                จัดการรายชื่อนักศึกษา
              </Link>
            </article>
            <article className="info-panel">
              <h2>รายการคะแนน</h2>
              <p>ตรวจสอบรายการคะแนนที่สร้างจากการนำเข้า CSV</p>
              <Link
                className="button-secondary mt-5"
                to={`/admin/courses/${course.id}/scores`}
              >
                ดูรายการคะแนน
              </Link>
            </article>
            <article className="info-panel">
              <h2>นำเข้าคะแนนจาก CSV</h2>
              <p>อ่านไฟล์ ตรวจสอบตัวอย่าง และบันทึกเฉพาะแถวที่ตรงกับรายชื่อนักศึกษา</p>
              <Link
                className="button-primary mt-5"
                to={`/admin/courses/${course.id}/import`}
              >
                นำเข้าคะแนน
              </Link>
            </article>
            </div>
          </>
        ) : null}
      </AdminLayout>
    </PageShell>
  );
}
