import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import {
  createCourse,
  parseSectionsInput,
} from "../../features/admin/adminData";
import type { Course } from "../../lib/firestore/types";
import { AdminLayout } from "./AdminLayout";

type CourseStatus = NonNullable<Course["status"]>;

function isCourseStatus(status: string): status is CourseStatus {
  return ["draft", "active", "archived"].includes(status);
}

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
    const courseCode = String(formData.get("courseCode") ?? "").trim();
    const term = String(formData.get("term") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const year = Number(formData.get("year"));
    const isPublic = formData.get("isPublic") === "on";
    const portalEnabled = formData.get("portalEnabled") === "on";
    const status = String(formData.get("status") ?? "draft");
    const sections = parseSectionsInput(String(formData.get("sections") ?? ""));

    if (!title || !slug || !term || !description || !Number.isFinite(year)) {
      setError("กรุณากรอก title, slug, term, year และ description ให้ครบถ้วน");
      setIsSaving(false);
      return;
    }

    if (!isCourseStatus(status)) {
      setError("สถานะรายวิชาไม่ถูกต้อง");
      setIsSaving(false);
      return;
    }

    try {
      const courseDoc = await createCourse({
        courseCode,
        title,
        slug,
        term,
        year,
        description,
        isPublic,
        portalEnabled,
        sections,
        status,
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
      description="สร้างรายวิชาสำหรับพื้นที่ผู้เรียน ใช้ข้อมูลชั่วคราวได้จนกว่าจะยืนยันข้อมูลรายวิชาจริง"
    >
      <AdminLayout>
        <form className="form-panel" onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-grid">
            <label>
              <span>รหัสวิชา</span>
              <input name="courseCode" placeholder="เช่น SMAC001" />
            </label>
            <label>
              <span>สถานะรายวิชา</span>
              <select defaultValue="draft" name="status">
                <option value="draft">ร่าง</option>
                <option value="active">เปิดใช้งาน</option>
                <option value="archived">เก็บถาวร</option>
              </select>
            </label>
          </div>
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
            <span>กลุ่มเรียน</span>
            <input name="sections" placeholder="เช่น P01, P02 หรือ N01" />
          </label>
          <label>
            <span>คำอธิบายรายวิชา</span>
            <textarea
              name="description"
              placeholder="คำอธิบายรายวิชาสำหรับเผยแพร่บนหน้าเว็บ"
              required
              rows={4}
            />
          </label>
          <label className="checkbox-row">
            <input name="isPublic" type="checkbox" />
            <span>แสดงเป็นข้อมูลรายวิชาบนหน้าเว็บ</span>
          </label>
          <label className="checkbox-row">
            <input defaultChecked name="portalEnabled" type="checkbox" />
            <span>ใช้รายวิชานี้ในพื้นที่ผู้เรียนและแดชบอร์ดอาจารย์</span>
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
