import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { fetchAdminCourse, type CourseSummary } from "../../features/admin/adminData";
import { AdminLayout } from "./AdminLayout";

export function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseSummary | null>(null);
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
        const nextCourse = await fetchAdminCourse(courseId);

        if (isCurrent) {
          setCourse(nextCourse);
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
          <div className="content-grid">
            <article className="info-panel">
              <p className="metadata-label">{course.data.term}</p>
              <h2>รายละเอียดรายวิชา</h2>
              <p>{course.data.description}</p>
            </article>
            <article className="info-panel">
              <h2>นักศึกษาที่ลงทะเบียน</h2>
              <p>ตรวจสอบรายชื่อนักศึกษาก่อน import คะแนน</p>
              <Link
                className="button-secondary mt-5"
                to={`/admin/courses/${course.id}/students`}
              >
                จัดการนักศึกษา
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
        ) : null}
      </AdminLayout>
    </PageShell>
  );
}
