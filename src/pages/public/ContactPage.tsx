import { PageShell } from "../../components/PageShell";
import { profilePlaceholder } from "../../content/publicAcademic";

export function ContactPage() {
  return (
    <PageShell
      eyebrow="ติดต่อ"
      title="ช่องทางติดต่อ"
      description="ข้อมูล email สังกัด และรายละเอียดสำหรับติดต่อจะเผยแพร่เมื่อได้รับข้อมูลที่อาจารย์อนุญาตให้ใช้แล้ว"
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
              <dt className="font-semibold text-ink">ภาควิชา</dt>
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
          </dl>
        </div>
        <div className="info-panel">
          <h2>ข้อควรระวังก่อนเผยแพร่</h2>
          <p>
            หน้านี้ใช้ข้อมูล placeholder โดยตั้งใจ ควรแทนที่ด้วยข้อมูลที่อาจารย์
            หรือสถาบันอนุญาตให้เผยแพร่เท่านั้น
          </p>
          <p>
            ห้ามใส่ข้อความส่วนตัวของนักศึกษา คะแนน หรือรายละเอียด enrollment
            ในหน้าติดต่อสาธารณะ
          </p>
        </div>
      </div>
    </PageShell>
  );
}
