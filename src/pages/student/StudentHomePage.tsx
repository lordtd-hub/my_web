import { Link } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { useAuth } from "../../features/auth/authContext";
import { useStudentCourses } from "../../features/courses/useStudentCourses";

function formatEnrollmentStatus(status: string) {
  return status === "active" ? "ใช้งานอยู่" : "ไม่ใช้งาน";
}

export function StudentHomePage() {
  const { user } = useAuth();
  const { courses, error, isLoading } = useStudentCourses();
  const activeCourses = courses.filter(
    ({ enrollment }) => enrollment.status === "active",
  );
  const inactiveCourses = courses.length - activeCourses.length;
  const latestCourses = activeCourses.slice(0, 3);

  return (
    <PageShell
      eyebrow="รายวิชาของฉัน"
      title="พื้นที่ผู้เรียนในรายวิชาของอาจารย์สิทธิโชค"
      description="เข้าถึงรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอนและข้อมูลคะแนนส่วนตัวหลังเข้าสู่ระบบ"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            S
          </div>
          <dl className="mt-6 space-y-4">
            <div>
              <dt>เข้าสู่ระบบในชื่อ</dt>
              <dd>{user?.displayName ?? user?.email ?? "ผู้ใช้"}</dd>
            </div>
            <div>
              <dt>สถานะบัญชี</dt>
              <dd>เข้าสู่ระบบแล้ว</dd>
            </div>
            <div>
              <dt>รายวิชาที่ใช้งานอยู่</dt>
              <dd>{activeCourses.length} รายวิชา</dd>
            </div>
            <div>
              <dt>บัญชีผู้เรียน</dt>
              <dd>{user?.email ?? "รอข้อมูลอีเมล"}</dd>
            </div>
          </dl>
        </aside>

        <div className="grid gap-5">
          <div className="info-panel border-copper-accent/30">
            <h2>ภาพรวมรายวิชาส่วนตัว</h2>
            <p>
              หน้านี้แสดงเฉพาะรายวิชาของอาจารย์สิทธิโชคที่ผูกกับบัญชีของท่าน
              ระบบจะแสดงเฉพาะข้อมูลของท่านและไม่แสดงคะแนนของผู้เรียนคนอื่น
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="detail-tile bg-white">
                <span>ทั้งหมด</span>
                <strong>{courses.length} รายวิชา</strong>
              </div>
              <div className="detail-tile bg-white">
                <span>ใช้งานอยู่</span>
                <strong>{activeCourses.length} รายวิชา</strong>
              </div>
              <div className="detail-tile bg-white">
                <span>ไม่ใช้งาน</span>
                <strong>{inactiveCourses} รายวิชา</strong>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-primary" to="/student/courses">
                ดูรายวิชาของฉัน
              </Link>
              <Link className="button-secondary" to="/">
                กลับหน้าแรก
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="info-panel">
              <h2>กำลังโหลดข้อมูลรายวิชา</h2>
              <p>กำลังตรวจสอบรายวิชาที่ผูกกับบัญชีของท่าน...</p>
            </div>
          ) : null}

          {error ? <p className="alert-message">{error}</p> : null}

          {!isLoading && !error && courses.length === 0 ? (
            <div className="info-panel">
              <h2>ยังไม่พบรายวิชาที่ผูกกับบัญชีนี้</h2>
              <p>
                เมื่อบัญชีนี้ถูกเพิ่มเข้าในรายวิชาของอาจารย์สิทธิโชค
                รายวิชาจะปรากฏในหน้านี้โดยอัตโนมัติ
              </p>
            </div>
          ) : null}

          {latestCourses.length > 0 ? (
            <section className="info-panel">
              <h2>รายวิชาที่ใช้งานอยู่</h2>
              <div className="mt-5 grid gap-3">
                {latestCourses.map(({ course, courseId, enrollment }) => (
                  <article className="detail-tile bg-paper-warm" key={courseId}>
                    <span>{course?.term ?? "รอข้อมูลภาคการศึกษา"}</span>
                    <strong>
                      {course?.courseCode ? `${course.courseCode} ` : ""}
                      {course?.title ?? "รอชื่อรายวิชา"}
                    </strong>
                    <p className="mt-2 text-sm leading-6 text-ink/65">
                      กลุ่มเรียน {enrollment.section ?? "ไม่ระบุ"} ·{" "}
                      {formatEnrollmentStatus(enrollment.status)}
                    </p>
                    <Link
                      className="button-ghost mt-3 px-0"
                      to={`/student/courses/${courseId}/scores`}
                    >
                      ดูคะแนนรายวิชานี้
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <div className="content-grid">
            <article className="info-panel">
              <p className="metadata-label">ความก้าวหน้า</p>
              <h2>พัฒนาการการเรียนรู้</h2>
              <p>
                เตรียมพื้นที่สำหรับสรุปความก้าวหน้าจากกิจกรรม interactive
                ในอนาคต โดยข้อมูลฝึกทำกิจกรรมจะยังไม่ถือเป็นคะแนนทางการ
              </p>
            </article>
            <article className="info-panel">
              <p className="metadata-label">CLO</p>
              <h2>การบรรลุผลลัพธ์การเรียนรู้</h2>
              <p>
                จะผูกกับ CLO จริงของรายวิชาหลังจากกำหนดเกณฑ์และวิธีตรวจสอบแล้ว
                เพื่อไม่ให้คะแนนหรือ badge ถูกสร้างจากข้อมูลที่แก้ไขเองได้ง่าย
              </p>
            </article>
            <article className="info-panel">
              <p className="metadata-label">ป้ายความสำเร็จ</p>
              <h2>ป้ายความสำเร็จและ XP</h2>
              <p>
                เวอร์ชันถัดไปควรแยก XP เพื่อแสดงพัฒนาการออกจากคะแนนทางการ
                และต้องมีข้อจำกัดกันการทำซ้ำเพื่อปั่นคะแนน
              </p>
            </article>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
