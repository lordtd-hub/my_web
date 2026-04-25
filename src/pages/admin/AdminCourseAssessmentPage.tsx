import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageShell } from "../../components/PageShell";
import { getPublishedActivitiesForCourse } from "../../features/activities/activityCatalog";
import {
  buildSelfAssessmentPrompts,
  countPracticeOnlyMappings,
  findMappedActivity,
  getAssessmentSetupSteps,
  getAssessmentTemplateForCourse,
  type SetupStep,
} from "../../features/assessment/courseAssessmentPlan";
import {
  addCourseLearningOutcome,
  fetchCourseLearningOutcomes,
  seedCourseLearningOutcomes,
  updateCourseLearningOutcome,
  type LearningOutcomeInput,
  type LearningOutcomeSummary,
} from "../../features/assessment/assessmentData";
import type {
  AssessmentEvidenceType,
  BloomCognitiveLevel,
  ReviewPolicy,
} from "../../features/assessment/assessmentTypes";
import {
  fetchAdminCourse,
  type CourseSummary,
} from "../../features/admin/adminData";
import { AdminLayout } from "./AdminLayout";

const bloomOptions: Array<{ label: string; value: BloomCognitiveLevel }> = [
  { label: "Remember", value: "remember" },
  { label: "Understand", value: "understand" },
  { label: "Apply", value: "apply" },
  { label: "Analyze", value: "analyze" },
  { label: "Evaluate", value: "evaluate" },
  { label: "Create", value: "create" },
];

const emptyOutcomeForm: LearningOutcomeInput = {
  bloomLevel: "understand",
  description: "",
  isPublished: true,
  order: 1,
  title: "",
};

type DisplayedOutcome = {
  id: string;
  data: LearningOutcomeInput;
};

function formatBloomLevel(level: BloomCognitiveLevel) {
  const labels: Record<BloomCognitiveLevel, string> = {
    analyze: "Analyze",
    apply: "Apply",
    create: "Create",
    evaluate: "Evaluate",
    remember: "Remember",
    understand: "Understand",
  };

  return labels[level];
}

function formatEvidenceType(type: AssessmentEvidenceType) {
  const labels: Record<AssessmentEvidenceType, string> = {
    accuracy: "ความถูกต้อง",
    artifact: "ผลงาน",
    completion: "ทำครบ",
    reflection: "Reflection",
    rubric: "Rubric",
    teacherReview: "อาจารย์ตรวจ",
  };

  return labels[type];
}

function formatReviewPolicy(policy: ReviewPolicy) {
  const labels: Record<ReviewPolicy, string> = {
    adminApprovedTransfer: "โอนเป็นคะแนนเมื่ออาจารย์อนุมัติ",
    autoPractice: "ฝึกอัตโนมัติ",
    manualReviewRequired: "ต้องตรวจ",
    practiceOnly: "ฝึกเท่านั้น",
  };

  return labels[policy];
}

function formatSetupStatus(status: SetupStep["status"]) {
  if (status === "ready") {
    return "พร้อม";
  }

  if (status === "needsReview") {
    return "รอตรวจ";
  }

  return "ทำภายหลัง";
}

export function AdminCourseAssessmentPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [outcomes, setOutcomes] = useState<LearningOutcomeSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<LearningOutcomeInput>(emptyOutcomeForm);
  const [editingOutcomeId, setEditingOutcomeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadCourse() {
      if (!courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const [nextCourse, nextOutcomes] = await Promise.all([
          fetchAdminCourse(courseId),
          fetchCourseLearningOutcomes(courseId),
        ]);

        if (isCurrent) {
          setCourse(nextCourse);
          setOutcomes(nextOutcomes);
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

  const template = getAssessmentTemplateForCourse(course?.data.courseCode);
  const displayedOutcomes = useMemo<DisplayedOutcome[]>(
    () =>
      outcomes.length > 0
        ? outcomes.map((outcome) => ({
            id: outcome.id,
            data: {
              bloomLevel: outcome.data.bloomLevel,
              description: outcome.data.description,
              isPublished: outcome.data.isPublished,
              order: outcome.data.order,
              title: outcome.data.title,
            },
          }))
        : (template?.learningOutcomes.map((outcome) => ({
          id: outcome.id,
          data: {
            title: outcome.title,
            description: outcome.description,
            bloomLevel: outcome.bloomLevel,
            order: outcome.order,
            isPublished: false,
          },
        })) ?? []),
    [outcomes, template],
  );
  const activities = course
    ? getPublishedActivitiesForCourse({
        courseCode: course.data.courseCode,
        courseId: course.id,
      })
    : [];

  const setupSteps = getAssessmentSetupSteps({
    hasCourseCode: Boolean(course?.data.courseCode),
    hasTemplate: Boolean(template),
    activityCount: activities.length,
  });

  const selfAssessmentPrompts = useMemo(
    () =>
      buildSelfAssessmentPrompts(
        displayedOutcomes.map((outcome) => ({
          id: outcome.id,
          title: outcome.data.title,
        })),
      ),
    [displayedOutcomes],
  );

  const outcomeTitleById = useMemo(() => {
    return new Map(
      displayedOutcomes.map((outcome) => [
        outcome.id,
        outcome.data.title,
      ]),
    );
  }, [displayedOutcomes]);

  async function reloadOutcomes(targetCourseId: string) {
    const nextOutcomes = await fetchCourseLearningOutcomes(targetCourseId);
    setOutcomes(nextOutcomes);
  }

  async function handleSeedTemplate() {
    if (!courseId || !template) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await seedCourseLearningOutcomes(
        courseId,
        template.learningOutcomes.map((outcome) => ({
          id: outcome.id,
          input: {
            bloomLevel: outcome.bloomLevel,
            description: outcome.description,
            isPublished: true,
            order: outcome.order,
            title: outcome.title,
          },
        })),
      );
      await reloadOutcomes(courseId);
      setMessage("นำ CLO draft ไปใช้กับรายวิชานี้แล้ว กรุณาตรวจภาษาและปรับให้ตรงเอกสารรายวิชา");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "บันทึก CLO draft ไม่สำเร็จ",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveOutcome() {
    if (!courseId) {
      return;
    }

    if (!form.title.trim() || !form.description.trim()) {
      setError("กรุณากรอกชื่อ CLO และคำอธิบายให้ครบ");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (editingOutcomeId) {
        await updateCourseLearningOutcome(courseId, editingOutcomeId, form);
        setMessage("แก้ไข CLO แล้ว");
      } else {
        await addCourseLearningOutcome(courseId, form);
        setMessage("เพิ่ม CLO ใหม่แล้ว");
      }

      await reloadOutcomes(courseId);
      setForm(emptyOutcomeForm);
      setEditingOutcomeId(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "บันทึก CLO ไม่สำเร็จ",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditOutcome(outcome: DisplayedOutcome) {
    setEditingOutcomeId(outcome.id);
    setForm({
      bloomLevel: outcome.data.bloomLevel,
      description: outcome.data.description,
      isPublished: outcome.data.isPublished,
      order: outcome.data.order,
      title: outcome.data.title,
    });
    setMessage(null);
    setError(null);
  }

  return (
    <PageShell
      eyebrow="แดชบอร์ดอาจารย์"
      title="ออกแบบการสอนและการประเมิน"
      description="ตัวอย่าง workspace สำหรับผูก CLO, Bloom, กิจกรรม, self-assessment และขอบเขตคะแนนจริงของรายวิชา"
    >
      <AdminLayout>
        <div className="mb-6 flex flex-wrap gap-3">
          <Link className="text-link" to={`/admin/courses/${courseId ?? ""}`}>
            กลับไปรายวิชา
          </Link>
          {courseId ? (
            <Link className="text-link" to={`/admin/courses/${courseId}/students`}>
              รายชื่อนักศึกษา
            </Link>
          ) : null}
        </div>

        {isLoading ? (
          <div className="info-panel">
            <h2>กำลังโหลดรายวิชา</h2>
            <p>กำลังเตรียมพื้นที่ออกแบบการสอนของรายวิชานี้...</p>
          </div>
        ) : null}

        {error ? <p className="alert-message">{error}</p> : null}
        {message ? <p className="success-message">{message}</p> : null}

        {!isLoading && !error && !course ? (
          <div className="info-panel">
            <h2>ไม่พบรายวิชา</h2>
            <p>ไม่พบรายวิชานี้ หรือบัญชีของท่านอาจยังไม่มีสิทธิ์เข้าถึง</p>
          </div>
        ) : null}

        {course ? (
          <div className="grid gap-6">
            <section className="info-panel">
              <p className="metadata-label">
                {course.data.courseCode ?? "ยังไม่มีรหัสวิชา"}
              </p>
              <h2>{course.data.title}</h2>
              <p>
                หน้านี้เป็น prototype ฝั่งอาจารย์สำหรับทำให้การตั้งค่า CLO,
                กิจกรรม และ self-assessment สะดวกขึ้น ยังไม่เขียนคะแนนจริง
                และยังไม่บันทึกแผนการประเมินลงฐานข้อมูล
              </p>
            </section>

            <section className="content-grid">
              {setupSteps.map((step) => (
                <article className="info-panel" key={step.id}>
                  <p className="metadata-label">{formatSetupStatus(step.status)}</p>
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </article>
              ))}
            </section>

            {template ? (
              <>
                <section className="content-grid">
                  <article className="info-panel">
                    <p className="metadata-label">CLO draft</p>
                    <h2>{displayedOutcomes.length}</h2>
                    <p>
                      รายการผลลัพธ์การเรียนรู้ฉบับร่างสำหรับตรวจภาษาและปรับให้ตรงเอกสารรายวิชา
                    </p>
                  </article>
                  <article className="info-panel">
                    <p className="metadata-label">กิจกรรมที่ map แล้ว</p>
                    <h2>{template.activityMappings.length}</h2>
                    <p>
                      ทุก mapping ในตัวอย่างนี้ยังอยู่ในขอบเขต practice/progress
                      ก่อน
                    </p>
                  </article>
                  <article className="info-panel">
                    <p className="metadata-label">ไม่แตะคะแนนจริง</p>
                    <h2>{countPracticeOnlyMappings(template.activityMappings)}</h2>
                    <p>
                      รายการที่ยังไม่ส่งผลต่อคะแนนทางการโดยตรง
                      ต้องผ่านการตัดสินใจของอาจารย์ก่อน
                    </p>
                  </article>
                </section>

                <section className="info-panel">
                  <p className="metadata-label">CLO bank</p>
                  <h2>ผลลัพธ์การเรียนรู้ของรายวิชา</h2>
                  <p>
                    ใช้เป็นคลังให้เลือกเวลาสร้างกิจกรรม แบบประเมินตนเอง หรือ rubric
                    {outcomes.length > 0
                      ? " รายการด้านล่างบันทึกอยู่ในฐานข้อมูลของรายวิชานี้แล้ว"
                      : " ข้อความด้านล่างเป็นร่างตัวอย่าง ต้องกดนำไปใช้ก่อนจึงจะบันทึกจริง"}
                  </p>
                  {outcomes.length === 0 && template ? (
                    <button
                      className="button-primary mt-5"
                      disabled={isSaving}
                      onClick={() => void handleSeedTemplate()}
                      type="button"
                    >
                      ใช้ CLO draft กับรายวิชานี้
                    </button>
                  ) : null}
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {displayedOutcomes.map((outcome) => (
                      <article className="detail-tile" key={outcome.id}>
                        <span>{outcome.id}</span>
                        <strong>{outcome.data.title}</strong>
                        <p className="mt-3 text-sm leading-6 text-ink/65">
                          {outcome.data.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="status-pill">
                            Bloom: {formatBloomLevel(outcome.data.bloomLevel)}
                          </span>
                          <span className="status-pill">
                            {outcome.data.isPublished ? "เผยแพร่แล้ว" : "ยังไม่เผยแพร่"}
                          </span>
                        </div>
                        {outcomes.length > 0 ? (
                          <button
                            className="button-ghost mt-4 px-0"
                            onClick={() => handleEditOutcome(outcome)}
                            type="button"
                          >
                            แก้ไข CLO นี้
                          </button>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>

                <section className="form-panel">
                  <div>
                    <p className="metadata-label">
                      {editingOutcomeId ? "แก้ไข CLO" : "เพิ่ม CLO"}
                    </p>
                    <h2 className="text-xl font-semibold text-ink">
                      {editingOutcomeId ? "ปรับ CLO ที่เลือก" : "เพิ่มผลลัพธ์การเรียนรู้ใหม่"}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-ink/65">
                      บันทึกเฉพาะผลลัพธ์การเรียนรู้ของรายวิชา ยังไม่สร้างคะแนนหรือ badge ให้ผู้เรียน
                    </p>
                  </div>
                  <div className="form-grid">
                    <label>
                      ชื่อ CLO
                      <input
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        value={form.title}
                      />
                    </label>
                    <label>
                      ลำดับ
                      <input
                        min="1"
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            order: Number(event.target.value),
                          }))
                        }
                        type="number"
                        value={form.order}
                      />
                    </label>
                    <label>
                      Bloom level
                      <select
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            bloomLevel: event.target.value as BloomCognitiveLevel,
                          }))
                        }
                        value={form.bloomLevel}
                      >
                        {bloomOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      สถานะ
                      <select
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            isPublished: event.target.value === "published",
                          }))
                        }
                        value={form.isPublished ? "published" : "draft"}
                      >
                        <option value="published">เผยแพร่ให้นักศึกษาเห็น</option>
                        <option value="draft">เก็บเป็นร่าง</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    คำอธิบาย CLO
                    <textarea
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      rows={4}
                      value={form.description}
                    />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="button-primary"
                      disabled={isSaving}
                      onClick={() => void handleSaveOutcome()}
                      type="button"
                    >
                      {editingOutcomeId ? "บันทึกการแก้ไข" : "เพิ่ม CLO"}
                    </button>
                    {editingOutcomeId ? (
                      <button
                        className="button-secondary"
                        onClick={() => {
                          setEditingOutcomeId(null);
                          setForm(emptyOutcomeForm);
                        }}
                        type="button"
                      >
                        ยกเลิกการแก้ไข
                      </button>
                    ) : null}
                  </div>
                </section>

                <section className="info-panel">
                  <p className="metadata-label">Activity mapping</p>
                  <h2>ผูกกิจกรรมกับ CLO และ Bloom</h2>
                  <p>
                    ตารางนี้ช่วยให้อาจารย์ตรวจเร็วว่าแต่ละกิจกรรมวัดอะไร
                    ใช้หลักฐานแบบใด และยังเป็น practice หรือจะเข้า review queue
                  </p>
                  <div className="table-wrap mt-5">
                    <table>
                      <thead>
                        <tr>
                          <th>กิจกรรม</th>
                          <th>CLO</th>
                          <th>Bloom</th>
                          <th>หลักฐาน</th>
                          <th>สถานะคะแนน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {template.activityMappings.map((mapping) => {
                          const activity = findMappedActivity(
                            activities,
                            mapping.activityId,
                          );

                          return (
                            <tr key={`${mapping.activityId}-${mapping.outcomeId}`}>
                              <td>
                                {activity?.title ?? mapping.activityId}
                              </td>
                              <td>
                                {outcomeTitleById.get(mapping.outcomeId) ??
                                  mapping.outcomeId}
                              </td>
                              <td>{formatBloomLevel(mapping.bloomLevel)}</td>
                              <td>{formatEvidenceType(mapping.evidenceType)}</td>
                              <td>{formatReviewPolicy(mapping.reviewPolicy)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="info-panel">
                  <p className="metadata-label">Self-assessment generator</p>
                  <h2>ตัวอย่างคำถามประเมินตนเองจาก CLO</h2>
                  <p>
                    เมื่อ CLO ชัด ระบบสามารถสร้างชุดคำถามตั้งต้นให้อาจารย์ตรวจภาษา
                    ลดเวลาตั้งค่าทีละข้อ
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {selfAssessmentPrompts.map((group) => (
                      <article className="detail-tile" key={group.outcomeId}>
                        <span>{group.outcomeId}</span>
                        <strong>{group.title}</strong>
                        <ul className="mt-4 grid gap-2 text-sm leading-6 text-ink/70">
                          {group.prompts.map((prompt) => (
                            <li className="check-row" key={prompt}>
                              {prompt}
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="content-grid">
                  <article className="info-panel">
                    <p className="metadata-label">Badge draft</p>
                    <h2>Badge ตาม milestone</h2>
                    <p>
                      ใช้เป็นแรงจูงใจและตัวบอกพัฒนาการ ไม่ใช่คะแนนจริงโดยอัตโนมัติ
                    </p>
                    <div className="mt-5 grid gap-3">
                      {template.badgeRules.map((badge) => (
                        <div className="resource-row" key={badge.id}>
                          <strong>{badge.title}</strong>
                          <p>{badge.description}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="info-panel">
                    <p className="metadata-label">Official score boundary</p>
                    <h2>กันคะแนนจริงให้ปลอดภัย</h2>
                    <p>
                      activity, XP, badge และ self-assessment ใช้เป็นหลักฐานพัฒนาการ
                      ก่อน หากจะนับเป็นคะแนน ต้องเข้า review/approval แล้วจึงเขียน
                      ไปยังพื้นที่คะแนนทางการ
                    </p>
                  </article>
                </section>
              </>
            ) : (
              <section className="info-panel">
                <h2>ยังไม่มี assessment template สำหรับรายวิชานี้</h2>
                <p>
                  รายวิชานี้ยังใช้ระบบรายชื่อและคะแนนเดิมได้ตามปกติ
                  หากต้องการใช้ CLO, Bloom และ self-assessment ให้เริ่มจากสร้าง
                  CLO ของรายวิชานี้ก่อน
                </p>
              </section>
            )}
          </div>
        ) : null}
      </AdminLayout>
    </PageShell>
  );
}
