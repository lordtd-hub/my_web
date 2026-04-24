import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { createCourse } from "../../features/admin/adminData";
import { AdminLayout } from "./AdminLayout";

export function AdminCourseNewPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const term = String(formData.get("term") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const year = Number(formData.get("year"));
    const isPublic = formData.get("isPublic") === "on";

    if (!title || !slug || !term || !description || !Number.isFinite(year)) {
      setError("กรุณากรอก title, slug, term, year และ description ให้ครบถ้วน");
      setIsSaving(false);
      return;
    }

    try {
      const courseDoc = await createCourse({
        title,
        slug,
        term,
        year,
        description,
        isPublic,
      });
      navigate(`/admin/courses/${courseDoc.id}`);
    } catch (courseError) {
      setError(
        courseError instanceof Error ? courseError.message : "ไม่สามารถสร้างรายวิชาได้",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="สร้างรายวิชา"
      description="สร้าง course record ใน Firestore โดยใช้ข้อมูล placeholder จนกว่าจะได้รับข้อมูลรายวิชาจริง"
    >
      <AdminLayout>
        <form className="form-panel" onSubmit={(event) => void handleSubmit(event)}>
          <label>
            <span>ชื่อรายวิชา</span>
            <input name="title" placeholder="ชื่อรายวิชา (รอข้อมูลยืนยัน)" required />
          </label>
          <label>
            <span>Slug</span>
            <input name="slug" placeholder="course-slug-placeholder" required />
          </label>
          <div className="form-grid">
            <label>
              <span>ภาคการศึกษา</span>
              <input name="term" placeholder="ภาคการศึกษา (รอข้อมูลยืนยัน)" required />
            </label>
            <label>
              <span>ปีการศึกษา</span>
              <input name="year" min="2000" required type="number" />
            </label>
          </div>
          <label>
            <span>คำอธิบายรายวิชา</span>
            <textarea
              name="description"
              placeholder="คำอธิบายรายวิชาสำหรับเผยแพร่ public"
              required
              rows={4}
            />
          </label>
          <label className="checkbox-row">
            <input name="isPublic" type="checkbox" />
            <span>แสดงเป็นข้อมูลรายวิชา public</span>
          </label>
          {error ? <p className="alert-message">{error}</p> : null}
          <button className="button-primary" disabled={isSaving} type="submit">
            {isSaving ? "กำลังสร้าง..." : "สร้างรายวิชา"}
          </button>
        </form>
      </AdminLayout>
    </PageShell>
  );
}
