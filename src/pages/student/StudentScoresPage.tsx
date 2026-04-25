import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { useStudentScores } from "../../features/scores/useStudentScores";

function formatDate(value: Date | undefined) {
  if (!value) {
    return "ยังไม่มีข้อมูล";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatScore(score: number | null, maxScore: number) {
  return score === null ? `ยังไม่มีคะแนน / ${maxScore}` : `${score} / ${maxScore}`;
}

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

export function StudentScoresPage() {
  const { courseId } = useParams();
  const { error, isLoading, scores } = useStudentScores(courseId);

  return (
    <PageShell
      eyebrow="รายวิชาของฉัน"
      title="คะแนนของฉันในรายวิชานี้"
      description="หน้านี้อ่านเฉพาะ score document ของผู้ที่เข้าสู่ระบบในรายวิชาที่เลือก route มีเฉพาะ course ID และไม่รับ UID ของนักศึกษาคนอื่น"
    >
      <div className="mb-6">
        <Link className="text-link" to="/student/courses">
          กลับไปรายวิชาของฉัน
        </Link>
      </div>

      {isLoading ? (
        <div className="info-panel">
          <h2>กำลังโหลดคะแนน</h2>
          <p>กำลังอ่าน score document ส่วนตัวของท่านจาก Firestore...</p>
        </div>
      ) : null}

      {error ? <p className="alert-message">{error}</p> : null}

      {!isLoading && !error && !scores ? (
        <div className="info-panel">
          <h2>ยังไม่มีคะแนนที่เผยแพร่</h2>
          <p>
            อาจยังไม่มี score document สำหรับรายวิชานี้ หรือยังไม่มี score items
            ที่อาจารย์เผยแพร่ให้นักศึกษาเห็น
          </p>
        </div>
      ) : null}

      {scores ? (
        <div className="grid gap-6">
          <div className="info-panel">
            <h2>ข้อมูลคะแนน</h2>
            <p>Course ID: {scores.courseId}</p>
            <p>อัปเดตล่าสุด: {formatDate(scores.updatedAt)}</p>
          </div>

          {scores.rows.length === 0 ? (
            <div className="info-panel">
              <h2>ยังไม่มีรายการคะแนนที่เผยแพร่</h2>
              <p>
                คะแนนอาจมีอยู่ในระบบ แต่จะยังไม่แสดงจนกว่าอาจารย์จะเผยแพร่ score items
              </p>
            </div>
          ) : (
            <div className="score-list">
              {scores.rows.map((row) => (
                <article className="score-card" key={row.scoreItemId}>
                  <div>
                    <p className="metadata-label">{formatCategory(row.category)}</p>
                    <h2>{row.title}</h2>
                  </div>
                  <div className="score-value">{formatScore(row.score, row.maxScore)}</div>
                  <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-ink">Feedback</dt>
                      <dd className="mt-1 text-ink/65">
                        {row.feedback?.trim() || "ยังไม่มี feedback"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">อัปเดตเมื่อ</dt>
                      <dd className="mt-1 text-ink/65">
                        {formatDate(row.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </PageShell>
  );
}
