import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import {
  fetchCourseScoreItems,
  type ScoreItemSummary,
} from "../../features/admin/adminData";
import { AdminLayout } from "./AdminLayout";

function formatCategory(category: string) {
  const labels: Record<string, string> = {
    attendance: "การเข้าเรียน",
    final: "ปลายภาค",
    homework: "การบ้าน",
    midterm: "กลางภาค",
    other: "อื่น ๆ",
    quiz: "แบบทดสอบ",
  };

  return labels[category] ?? category;
}

export function AdminCourseScoresPage() {
  const { courseId } = useParams();
  const [scoreItems, setScoreItems] = useState<ScoreItemSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function loadScoreItems() {
      if (!courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const nextScoreItems = await fetchCourseScoreItems(courseId);

        if (isCurrent) {
          setScoreItems(nextScoreItems);
        }
      } catch (scoreItemError) {
        if (isCurrent) {
          setError(
            scoreItemError instanceof Error
              ? scoreItemError.message
              : "ไม่สามารถโหลด score items ได้",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadScoreItems();

    return () => {
      isCurrent = false;
    };
  }, [courseId]);

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="รายการคะแนนของรายวิชา"
      description="ใน milestone นี้ score item metadata ถูกจัดการผ่านการ import CSV"
    >
      <AdminLayout>
        <div className="mb-6">
          <Link className="button-primary" to={`/admin/courses/${courseId}/import`}>
            Import คะแนน
          </Link>
        </div>

        {isLoading ? (
          <div className="info-panel">
            <h2>กำลังโหลดรายการคะแนน</h2>
            <p>กำลังอ่าน score item metadata...</p>
          </div>
        ) : null}

        {error ? <p className="alert-message">{error}</p> : null}

        {!isLoading && !error && scoreItems.length === 0 ? (
          <div className="info-panel">
            <h2>ยังไม่มีรายการคะแนน</h2>
            <p>กรุณา import CSV เพื่อสร้าง score item metadata</p>
          </div>
        ) : null}

        {scoreItems.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ชื่อรายการ</th>
                  <th>ประเภท</th>
                  <th>คะแนนเต็ม</th>
                  <th>เผยแพร่แล้ว</th>
                </tr>
              </thead>
              <tbody>
                {scoreItems.map(({ data, id }) => (
                  <tr key={id}>
                    <td>{data.title}</td>
                    <td>{formatCategory(data.category)}</td>
                    <td>{data.maxScore}</td>
                    <td>{data.isPublished ? "ใช่" : "ไม่ใช่"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </AdminLayout>
    </PageShell>
  );
}
