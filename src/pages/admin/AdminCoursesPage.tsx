import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { formatCourseStatus } from "../../features/admin/adminData";
import { useAdminCourses } from "../../features/admin/useAdminCourses";
import { AdminLayout } from "./AdminLayout";

export function AdminCoursesPage() {
  const { courses, error, isLoading } = useAdminCourses();

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="จัดการรายวิชา"
      description="ดูและจัดการรายวิชาที่ใช้ในพื้นที่ผู้เรียนของอาจารย์สิทธิโชค"
    >
      <AdminLayout>
        <div className="mb-6 flex flex-wrap gap-3">
          <Link className="button-primary" to="/admin/courses/new">
            สร้างรายวิชา
          </Link>
        </div>

        {isLoading ? (
          <div className="info-panel">
            <h2>กำลังโหลดรายวิชา</h2>
            <p>กำลังโหลดข้อมูลรายวิชา...</p>
          </div>
        ) : null}

        {error ? <p className="alert-message">{error}</p> : null}

        {!isLoading && !error && courses.length === 0 ? (
          <div className="info-panel">
            <h2>ยังไม่มีรายวิชา</h2>
            <p>กรุณาสร้างรายวิชาก่อนเพิ่มรายชื่อนักศึกษาหรือนำเข้าคะแนน</p>
          </div>
        ) : null}

        <div className="content-grid">
          {courses.map(({ data, id }) => (
            <article className="info-panel" key={id}>
              <p className="metadata-label">{data.term}</p>
              <h2>
                {data.courseCode ? `${data.courseCode} ` : ""}
                {data.title}
              </h2>
              <p>{data.description}</p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink">ปีการศึกษา</dt>
                  <dd className="mt-1 text-ink/65">{data.year}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">เผยแพร่บนหน้าเว็บ</dt>
                  <dd className="mt-1 text-ink/65">
                    {data.isPublic ? "ใช่" : "ไม่ใช่"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">สถานะรายวิชา</dt>
                  <dd className="mt-1 text-ink/65">
                    {formatCourseStatus(data.status)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">ใช้ใน portal</dt>
                  <dd className="mt-1 text-ink/65">
                    {data.portalEnabled === false ? "ไม่ใช่" : "ใช่"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">กลุ่มเรียน</dt>
                  <dd className="mt-1 text-ink/65">
                    {data.sections?.length ? data.sections.join(", ") : "-"}
                  </dd>
                </div>
              </dl>
              <Link className="button-secondary mt-5" to={`/admin/courses/${id}`}>
                เปิดรายวิชา
              </Link>
            </article>
          ))}
        </div>
      </AdminLayout>
    </PageShell>
  );
}
