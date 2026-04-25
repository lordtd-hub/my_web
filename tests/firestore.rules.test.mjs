import { readFile } from "node:fs/promises";
import { after, before, beforeEach, describe, it } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const PROJECT_ID = "demo-personal-academic-learning-portal-rules-test";
const COURSE_ID = "fake-course";
const PRIVATE_COURSE_ID = "fake-private-course";
const ADMIN_UID = "admin-test-uid";
const STUDENT_A_UID = "student-a-test-uid";
const STUDENT_B_UID = "student-b-test-uid";
const STUDENT_ROSTER_UID = "student-roster-test-uid";
const STUDENT_ROSTER_ID = "6612345678901";
const STUDENT_ROSTER_EMAIL = `${STUDENT_ROSTER_ID}@student.sru.ac.th`;

let testEnv;

function firestoreHostConfig() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;

  if (!host) {
    return {};
  }

  const [hostname, port] = host.split(":");

  return {
    host: hostname,
    port: Number(port),
  };
}

function adminDb() {
  return testEnv.authenticatedContext(ADMIN_UID).firestore();
}

function studentADb() {
  return testEnv.authenticatedContext(STUDENT_A_UID).firestore();
}

function rosterStudentDb() {
  return testEnv
    .authenticatedContext(STUDENT_ROSTER_UID, {
      email: STUDENT_ROSTER_EMAIL,
    })
    .firestore();
}

function nonRosterStudentDb() {
  return testEnv
    .authenticatedContext("non-roster-student-uid", {
      email: "6612345678999@student.sru.ac.th",
    })
    .firestore();
}

function anonymousDb() {
  return testEnv.unauthenticatedContext().firestore();
}

async function seedFakeData() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    await setDoc(doc(db, "admins", ADMIN_UID), {
      email: "admin@example.test",
      createdAt: "fake-created-at",
    });

    await setDoc(doc(db, "courses", COURSE_ID), {
      title: "Fake Public Course",
      slug: "fake-public-course",
      term: "Fake Term",
      year: 2026,
      description: "Fake course used only for rules tests.",
      isPublic: true,
      createdAt: "fake-created-at",
      updatedAt: "fake-updated-at",
    });

    await setDoc(doc(db, "courses", PRIVATE_COURSE_ID), {
      title: "Fake Private Course",
      slug: "fake-private-course",
      term: "Fake Term",
      year: 2026,
      description: "Fake private course used only for rules tests.",
      isPublic: false,
      createdAt: "fake-created-at",
      updatedAt: "fake-updated-at",
    });

    await setDoc(doc(db, "courses", COURSE_ID, "enrollments", STUDENT_A_UID), {
      uid: STUDENT_A_UID,
      studentId: "fake-student-a",
      displayName: "Fake Student A",
      email: "student-a@example.test",
      status: "active",
      createdAt: "fake-created-at",
    });

    await setDoc(doc(db, "courses", COURSE_ID, "enrollments", STUDENT_B_UID), {
      uid: STUDENT_B_UID,
      studentId: "fake-student-b",
      displayName: "Fake Student B",
      email: "student-b@example.test",
      status: "active",
      createdAt: "fake-created-at",
    });

    await setDoc(doc(db, "courses", COURSE_ID, "roster", STUDENT_ROSTER_ID), {
      studentId: STUDENT_ROSTER_ID,
      email: STUDENT_ROSTER_EMAIL,
      displayName: "Fake Roster Student",
      section: "P01",
      status: "active",
      source: "registrar-import",
      createdAt: "fake-created-at",
      updatedAt: "fake-updated-at",
    });

    await setDoc(doc(db, "courses", COURSE_ID, "studentScores", STUDENT_A_UID), {
      uid: STUDENT_A_UID,
      courseId: COURSE_ID,
      scores: {
        fakeQuiz: {
          score: 8,
          maxScore: 10,
          published: true,
          updatedAt: "fake-updated-at",
        },
      },
      updatedAt: "fake-updated-at",
    });

    await setDoc(doc(db, "courses", COURSE_ID, "studentScores", STUDENT_B_UID), {
      uid: STUDENT_B_UID,
      courseId: COURSE_ID,
      scores: {
        fakeQuiz: {
          score: 7,
          maxScore: 10,
          published: true,
          updatedAt: "fake-updated-at",
        },
      },
      updatedAt: "fake-updated-at",
    });
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: await readFile("firestore.rules", "utf8"),
      ...firestoreHostConfig(),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seedFakeData();
});

after(async () => {
  await testEnv.cleanup();
});

describe("Firestore security rules", () => {
  it("anonymous users cannot read scores", async () => {
    await assertFails(
      getDoc(doc(anonymousDb(), "courses", COURSE_ID, "studentScores", STUDENT_A_UID)),
    );
  });

  it("public users can read public courses", async () => {
    await assertSucceeds(getDoc(doc(anonymousDb(), "courses", COURSE_ID)));
  });

  it("student A can read student A scores", async () => {
    await assertSucceeds(
      getDoc(doc(studentADb(), "courses", COURSE_ID, "studentScores", STUDENT_A_UID)),
    );
  });

  it("student A can query only student A enrollment records", async () => {
    await assertSucceeds(
      getDocs(
        query(
          collectionGroup(studentADb(), "enrollments"),
          where("uid", "==", STUDENT_A_UID),
        ),
      ),
    );

    await assertFails(
      getDocs(
        query(
          collectionGroup(studentADb(), "enrollments"),
          where("uid", "==", STUDENT_B_UID),
        ),
      ),
    );
  });

  it("student A cannot read student B scores", async () => {
    await assertFails(
      getDoc(doc(studentADb(), "courses", COURSE_ID, "studentScores", STUDENT_B_UID)),
    );
  });

  it("student cannot write scores", async () => {
    await assertFails(
      setDoc(doc(studentADb(), "courses", COURSE_ID, "studentScores", STUDENT_A_UID), {
        uid: STUDENT_A_UID,
        courseId: COURSE_ID,
        scores: {},
        updatedAt: "fake-updated-at",
      }),
    );
  });

  it("student cannot create admin documents", async () => {
    await assertFails(
      setDoc(doc(studentADb(), "admins", STUDENT_A_UID), {
        email: "student-a@example.test",
        createdAt: "fake-created-at",
      }),
    );
  });

  it("admin can read and write courses", async () => {
    await assertSucceeds(getDoc(doc(adminDb(), "courses", PRIVATE_COURSE_ID)));

    await assertSucceeds(
      setDoc(doc(adminDb(), "courses", "fake-admin-course"), {
        title: "Fake Admin Course",
        slug: "fake-admin-course",
        term: "Fake Term",
        year: 2026,
        description: "Fake admin-created course.",
        isPublic: false,
        createdAt: "fake-created-at",
        updatedAt: "fake-updated-at",
      }),
    );
  });

  it("admin can write enrollments", async () => {
    await assertSucceeds(
      setDoc(doc(adminDb(), "courses", COURSE_ID, "enrollments", "student-c-test-uid"), {
        uid: "student-c-test-uid",
        studentId: "fake-student-c",
        displayName: "Fake Student C",
        email: "student-c@example.test",
        status: "active",
        createdAt: "fake-created-at",
      }),
    );
  });

  it("admin can write roster entries by student ID", async () => {
    await assertSucceeds(
      setDoc(doc(adminDb(), "courses", COURSE_ID, "roster", "6612345678902"), {
        studentId: "6612345678902",
        email: "6612345678902@student.sru.ac.th",
        section: "P02",
        status: "active",
        source: "manual",
        createdAt: "fake-created-at",
        updatedAt: "fake-updated-at",
      }),
    );
  });

  it("rostered student can read own roster and create own enrollment", async () => {
    await assertSucceeds(
      getDocs(
        query(
          collectionGroup(rosterStudentDb(), "roster"),
          where("email", "==", STUDENT_ROSTER_EMAIL),
        ),
      ),
    );

    await assertSucceeds(
      setDoc(doc(rosterStudentDb(), "courses", COURSE_ID, "enrollments", STUDENT_ROSTER_UID), {
        uid: STUDENT_ROSTER_UID,
        studentId: STUDENT_ROSTER_ID,
        displayName: "Fake Roster Student",
        email: STUDENT_ROSTER_EMAIL,
        section: "P01",
        status: "active",
        source: "student-self-link",
        createdAt: "fake-created-at",
        updatedAt: "fake-updated-at",
      }),
    );
  });

  it("non-rostered student cannot create enrollment", async () => {
    await assertFails(
      setDoc(doc(nonRosterStudentDb(), "courses", COURSE_ID, "enrollments", "non-roster-student-uid"), {
        uid: "non-roster-student-uid",
        studentId: "6612345678999",
        displayName: "Fake Non Roster Student",
        email: "6612345678999@student.sru.ac.th",
        status: "active",
        source: "student-self-link",
        createdAt: "fake-created-at",
        updatedAt: "fake-updated-at",
      }),
    );
  });

  it("admin can write student scores", async () => {
    await assertSucceeds(
      setDoc(doc(adminDb(), "courses", COURSE_ID, "studentScores", STUDENT_A_UID), {
        uid: STUDENT_A_UID,
        courseId: COURSE_ID,
        scores: {
          fakeQuiz: {
            score: 9,
            maxScore: 10,
            published: true,
            updatedAt: "fake-updated-at",
          },
        },
        updatedAt: "fake-updated-at",
      }),
    );
  });
});
