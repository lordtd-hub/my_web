import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, setDoc } from "firebase/firestore";

const projectId = "demo-personal-academic-learning-portal-local";
const authEmulatorOrigin = "http://127.0.0.1:9099";
const firestoreHost = "127.0.0.1";
const firestorePort = 8080;
const apiKey = "fake-local-emulator-key";
const password = "local-test-password";
const courseId = "local-smac001";
const studentId = "6612345678901";
const studentEmail = `${studentId}@student.sru.ac.th`;

const accounts = {
  admin: {
    displayName: "อาจารย์ทดสอบ",
    email: "teacher-admin@example.test",
    password,
  },
  student: {
    displayName: "นักศึกษาทดสอบ",
    email: studentEmail,
    password,
  },
  nonRosterStudent: {
    displayName: "นักศึกษานอก roster",
    email: "6612345678999@student.sru.ac.th",
    password,
  },
};

async function identityToolkitRequest(path, body) {
  const response = await fetch(`${authEmulatorOrigin}${path}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error?.message ?? "Unknown Auth Emulator error";
    const error = new Error(message);
    error.code = message;
    throw error;
  }

  return payload;
}

async function signInAccount(account) {
  return identityToolkitRequest(
    "/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword",
    {
      email: account.email,
      password: account.password,
      returnSecureToken: true,
    },
  );
}

async function createOrSignInAccount(account) {
  try {
    const createdAccount = await identityToolkitRequest(
      "/identitytoolkit.googleapis.com/v1/accounts:signUp",
      {
        email: account.email,
        password: account.password,
        returnSecureToken: true,
      },
    );

    await identityToolkitRequest(
      "/identitytoolkit.googleapis.com/v1/accounts:update",
      {
        idToken: createdAccount.idToken,
        displayName: account.displayName,
        returnSecureToken: true,
      },
    );

    return createdAccount;
  } catch (error) {
    if (error instanceof Error && error.code === "EMAIL_EXISTS") {
      const signedInAccount = await signInAccount(account);

      await identityToolkitRequest(
        "/identitytoolkit.googleapis.com/v1/accounts:update",
        {
          idToken: signedInAccount.idToken,
          displayName: account.displayName,
          returnSecureToken: true,
        },
      );

      return signedInAccount;
    }

    throw error;
  }
}

async function seedFirestore({ adminUid, studentUid }) {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: firestoreHost,
      port: firestorePort,
    },
  });

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    const now = "local-emulator-seed";

    await setDoc(doc(db, "admins", adminUid), {
      email: accounts.admin.email,
      createdAt: now,
    });

    await setDoc(doc(db, "courses", courseId), {
      title: "แคลคูลัส 1",
      slug: "smac001-calculus-1-local",
      courseCode: "SMAC001",
      term: "ภาคเรียนที่ 1/2569",
      year: 2569,
      description: "ข้อมูลปลอมสำหรับทดสอบ Local Emulator QA เท่านั้น",
      isPublic: true,
      portalEnabled: true,
      sections: ["P01", "P02"],
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    await setDoc(doc(db, "courses", courseId, "roster", studentId), {
      studentId,
      email: studentEmail,
      displayName: accounts.student.displayName,
      section: "P01",
      status: "active",
      source: "registrar-import",
      createdAt: now,
      updatedAt: now,
    });

    await setDoc(doc(db, "courses", courseId, "enrollments", studentUid), {
      uid: studentUid,
      studentId,
      displayName: accounts.student.displayName,
      email: studentEmail,
      section: "P01",
      source: "admin",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    await setDoc(doc(db, "courses", courseId, "scoreItems", "quiz-1"), {
      title: "Quiz 1",
      maxScore: 10,
      category: "quiz",
      isPublished: true,
      order: 1,
      createdAt: now,
      updatedAt: now,
    });

    await setDoc(doc(db, "courses", courseId, "scoreItems", "midterm"), {
      title: "Midterm",
      maxScore: 40,
      category: "midterm",
      isPublished: true,
      order: 2,
      createdAt: now,
      updatedAt: now,
    });

    await setDoc(doc(db, "courses", courseId, "studentScores", studentUid), {
      uid: studentUid,
      courseId,
      scores: {
        "quiz-1": {
          score: 8,
          maxScore: 10,
          published: true,
          updatedAt: now,
        },
        midterm: {
          score: 30,
          maxScore: 40,
          feedback: "ข้อมูลปลอมสำหรับทดสอบเท่านั้น",
          published: true,
          updatedAt: now,
        },
      },
      updatedAt: now,
    });
  });

  await testEnv.cleanup();
}

async function main() {
  console.log("Seeding Firebase local emulators...");

  const [admin, student, nonRosterStudent] = await Promise.all([
    createOrSignInAccount(accounts.admin),
    createOrSignInAccount(accounts.student),
    createOrSignInAccount(accounts.nonRosterStudent),
  ]);

  await seedFirestore({
    adminUid: admin.localId,
    studentUid: student.localId,
  });

  console.log("Local Emulator QA seed complete.");
  console.log("");
  console.log("Test accounts:");
  console.log(`- Admin: ${accounts.admin.email} / ${password}`);
  console.log(`- Student: ${accounts.student.email} / ${password}`);
  console.log(
    `- Non-roster student: ${accounts.nonRosterStudent.email} / ${password}`,
  );
  console.log("");
  console.log("Seeded course:");
  console.log(`- ${courseId}: SMAC001 แคลคูลัส 1`);
  console.log("");
  console.log("Generated UIDs:");
  console.log(`- admin uid: ${admin.localId}`);
  console.log(`- student uid: ${student.localId}`);
  console.log(`- non-roster uid: ${nonRosterStudent.localId}`);
}

main().catch((error) => {
  console.error("");
  console.error("Seed failed.");
  console.error(
    "Make sure Firebase emulators are running with: npm run qa:emulators",
  );
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
