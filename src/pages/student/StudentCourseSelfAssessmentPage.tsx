import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { useAuth } from "../../features/auth/authContext";
import {
  fetchCourseLearningOutcomes,
  fetchOwnSelfAssessment,
  saveOwnSelfAssessment,
  type LearningOutcomeSummary,
  type SelfAssessmentResponseInput,
} from "../../features/assessment/assessmentData";
import { useStudentCourses } from "../../features/courses/useStudentCourses";

const ratingOptions = [
  { label: "1 ยังไม่เข้าใจ", value: 1 },
  { label: "2 พอเข้าใจ แต่ยังต้องดูตัวอย่าง", value: 2 },
  { label: "3 ทำโจทย์พื้นฐานได้", value: 3 },
  { label: "4 อธิบายและประยุกต์ได้", value: 4 },
];

export function StudentCourseSelfAssessmentPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { courses, error: coursesError, isLoading: isLoadingCourses } =
    useStudentCourses();
  const studentCourse = courses.find((item) => item.courseId === courseId);
  const [outcomes, setOutcomes] = useState<LearningOutcomeSummary[]>([]);
  const [responses, setResponses] = useState<
    Record<string, SelfAssessmentResponseInput>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadSelfAssessment() {
      if (!courseId || !user || isLoadingCourses) {
        setIsLoading(isLoadingCourses);
        return;
      }

      if (!studentCourse) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [nextOutcomes, currentAssessment] = await Promise.all([
          fetchCourseLearningOutcomes(courseId),
          fetchOwnSelfAssessment(courseId, user.uid),
        ]);

        if (!isCurrent) {
          return;
        }

        setOutcomes(nextOutcomes.filter((outcome) => outcome.data.isPublished));
        setResponses(
          Object.fromEntries(
            Object.entries(currentAssessment?.data.responses ?? {}).map(
              ([outcomeId, response]) => [
                outcomeId,
                {
                  rating: response.rating,
                  reflection: response.reflection,
                },
              ],
            ),
          ),
        );
      } catch (loadError) {
        if (!isCurrent) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "ไม่สามารถโหลดแบบประเมินตนเองได้",
        );
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void loadSelfAssessment();

    return () => {
      isCurrent = false;
    };
  }, [courseId, isLoadingCourses, studentCourse, user]);

  function updateResponse(
    outcomeId: string,
    patch: Partial<SelfAssessmentResponseInput>,
  ) {
    setResponses((current) => ({
      ...current,
      [outcomeId]: {
        rating: current[outcomeId]?.rating ?? 2,
        reflection: current[outcomeId]?.reflection ?? "",
        ...patch,
      },
    }));
  }

  async function handleSave() {
    if (!courseId || !user) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await saveOwnSelfAssessment({
        courseId,
        uid: user.uid,
        responses: Object.fromEntries(
          outcomes.map((outcome) => [
            outcome.id,
            {
              rating: responses[outcome.id]?.rating ?? 2,
              reflection: responses[outcome.id]?.reflection?.trim() ?? "",
            },
          ]),
        ),
      });
      setMessage("บันทึกการประเมินตนเองแล้ว");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "บันทึกการประเมินตนเองไม่สำเร็จ",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageShell
      eyebrow="รายวิชาของฉัน"
      title="ประเมินตนเองตาม CLO"
      description="ใช้สะท้อนความเข้าใจของตนเองในรายวิชา ข้อมูลนี้เป็นพัฒนาการระหว่างเรียนและยังไม่ใช่คะแนนทางการ"
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Link className="text-link" to="/student/courses">
          กลับไปรายวิชาของฉัน
        </Link>
        {courseId ? (
          <Link
            className="text-link"
            to={`/student/courses/${courseId}/activities`}
          >
            เปิดสื่อและกิจกรรม
          </Link>
        ) : null}
      </div>

      {isLoading || isLoadingCourses ? (
        <div className="info-panel">
          <h2>กำลังโหลดแบบประเมินตนเอง</h2>
          <p>กำลังตรวจสอบรายวิชาและ CLO ที่เปิดให้นักศึกษาเห็น...</p>
        </div>
      ) : null}

      {coursesError ? <p className="alert-message">{coursesError}</p> : null}
      {error ? <p className="alert-message">{error}</p> : null}
      {message ? <p className="success-message">{message}</p> : null}

      {!isLoading && !isLoadingCourses && !studentCourse ? (
        <div className="info-panel">
          <h2>ไม่พบรายวิชานี้ในบัญชีของท่าน</h2>
          <p>ระบบจะแสดงแบบประเมินตนเองเฉพาะรายวิชาที่ท่านถูกเพิ่มเข้าไว้แล้ว</p>
        </div>
      ) : null}

      {studentCourse ? (
        <div className="grid gap-6">
          <section className="info-panel">
            <p className="metadata-label">
              {studentCourse.course?.courseCode ?? "รอรหัสวิชา"}
            </p>
            <h2>{studentCourse.course?.title ?? "รายวิชา"}</h2>
            <p>
              กรุณาประเมินตนเองตามสภาพจริง ข้อมูลนี้ช่วยให้อาจารย์เห็นจุดที่ควรทบทวน
              และช่วยให้ผู้เรียนเห็นเป้าหมายถัดไปของตนเอง
            </p>
          </section>

          {outcomes.length === 0 && !isLoading ? (
            <div className="info-panel">
              <h2>ยังไม่มี CLO ที่เปิดให้นักศึกษาเห็น</h2>
              <p>เมื่ออาจารย์เผยแพร่ CLO ของรายวิชานี้ แบบประเมินตนเองจะแสดงที่นี่</p>
            </div>
          ) : null}

          {outcomes.length > 0 ? (
            <section className="form-panel">
              {outcomes.map((outcome) => (
                <article className="detail-tile bg-paper-warm" key={outcome.id}>
                  <span>{outcome.id}</span>
                  <strong>{outcome.data.title}</strong>
                  <p className="mt-3 text-sm leading-6 text-ink/65">
                    {outcome.data.description}
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-[280px_1fr]">
                    <label>
                      ระดับความมั่นใจ
                      <select
                        onChange={(event) =>
                          updateResponse(outcome.id, {
                            rating: Number(event.target.value),
                          })
                        }
                        value={responses[outcome.id]?.rating ?? 2}
                      >
                        {ratingOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Reflection สั้น ๆ
                      <textarea
                        onChange={(event) =>
                          updateResponse(outcome.id, {
                            reflection: event.target.value,
                          })
                        }
                        placeholder="เช่น ตอนนี้เข้าใจอะไรแล้ว ยังติดตรงไหน หรืออยากให้อาจารย์ช่วยทบทวนเรื่องใด"
                        rows={3}
                        value={responses[outcome.id]?.reflection ?? ""}
                      />
                    </label>
                  </div>
                </article>
              ))}
              <div>
                <button
                  className="button-primary"
                  disabled={isSaving}
                  onClick={() => void handleSave()}
                  type="button"
                >
                  บันทึกการประเมินตนเอง
                </button>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </PageShell>
  );
}
