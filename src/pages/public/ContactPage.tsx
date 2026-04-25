import { PageShell } from "../../components/PageShell";
import {
  profilePlaceholder,
  teachingSchedule,
  teachingScheduleTerm,
} from "../../content/publicAcademic";

export function ContactPage() {
  return (
    <PageShell
      eyebrow="ติดต่อ"
      title="ช่องทางติดต่อ"
      description="ช่องทางติดต่อและสังกัดสำหรับงานสอน งานวิชาการ และการประสานงานที่เกี่ยวข้อง"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="info-panel">
          <h2>ข้อมูลติดต่อสำหรับเผยแพร่</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-ink">Email</dt>
              <dd className="mt-1 text-ink/65">{profilePlaceholder.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">สังกัด</dt>
              <dd className="mt-1 text-ink/65">
                {profilePlaceholder.department}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">มหาวิทยาลัย</dt>
              <dd className="mt-1 text-ink/65">
                {profilePlaceholder.university}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">ห้องทำงาน</dt>
              <dd className="mt-1 text-ink/65">
                {profilePlaceholder.office}
              </dd>
            </div>
          </dl>
        </div>
        <div className="info-panel">
          <h2>การนัดหมายเข้าพบ</h2>
          <p>
            นักศึกษาสามารถใช้ตารางสอนด้านล่างเพื่อเลือกช่วงเวลาที่สะดวกก่อนติดต่ออาจารย์
          </p>
          <p>
            กรุณาส่ง email เพื่อนัดหมายล่วงหน้า โดยระบุรายวิชา หัวข้อที่ต้องการปรึกษา
            และช่วงเวลาที่สะดวก เพื่อให้อาจารย์ยืนยันเวลานัดหมายอีกครั้ง
          </p>
        </div>
      </div>

      <section className="mt-10">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">ตารางสอน</p>
            <h2>เวลานัดหมายเบื้องต้น ({teachingScheduleTerm})</h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/65">
          ตารางนี้ใช้ช่วยเลือกช่วงเวลาติดต่อหรือนัดหมายกับอาจารย์เท่านั้น
          ช่วงที่ไม่มีตารางสอนประจำควรติดต่อยืนยันล่วงหน้าทาง email ก่อนเสมอ
        </p>
        <div className="content-grid mt-6">
          {teachingSchedule.map((day) => (
            <article className="info-panel" key={day.day}>
              <h3>{day.day}</h3>
              <div className="mt-5">
                <p className="metadata-label">ตารางสอน</p>
                {day.classes.length > 0 ? (
                  <ul className="space-y-3">
                    {day.classes.map((item) => (
                      <li
                        className="check-row"
                        key={`${day.day}-${item.courseCode}-${item.section}-${item.time}`}
                      >
                        <strong>{item.time}</strong> · {item.courseCode}{" "}
                        {item.section} · {item.room}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>ไม่มีตารางสอนประจำ</p>
                )}
              </div>
              <div className="mt-5">
                <p className="metadata-label">ช่วงที่อาจนัดหมายได้</p>
                <div className="flex flex-wrap gap-2">
                  {day.availableSlots.map((slot) => (
                    <span className="status-pill" key={`${day.day}-${slot}`}>
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
