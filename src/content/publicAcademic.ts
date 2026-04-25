export type PublicCourse = {
  slug: string;
  code: string;
  title: string;
  term: string;
  summary: string;
  audience: string;
  overview: string;
  syllabus: string[];
  weeklyLessons: string[];
  resources: string[];
};

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url: string;
};

export type AcademicLink = {
  label: string;
  href: string;
  note: string;
};

export const profilePlaceholder = {
  displayName: "ดร.สิทธิโชค ทรงสอาด",
  displayNameEn: "Sittichoke Songsa-ard",
  position: "ผู้ช่วยศาสตราจารย์ สาขาวิชาคณิตศาสตร์",
  department: "สาขาวิชาคณิตศาสตร์ คณะวิทยาศาสตร์และเทคโนโลยี",
  university: "มหาวิทยาลัยราชภัฏสุราษฎร์ธานี",
  email: "sittichoke.son@sru.ac.th",
  profileImage: "/sittichoke.png",
  bio:
    "อาจารย์ประจำสาขาวิชาคณิตศาสตร์ มีความสนใจทางวิชาการด้าน fixed point theory, uniform spaces และแนวคิดเกี่ยวกับ contractions ในปริภูมิทางคณิตศาสตร์ โดยเว็บไซต์นี้ใช้เป็นพื้นที่รวบรวมข้อมูลการสอน งานวิจัย และพื้นที่รายวิชาสำหรับผู้เรียนในรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอน",
  researchInterests: [
    "Fixed point theory",
    "Uniform spaces",
    "Contractions and generalized contractions",
  ],
};

export const academicLinks: AcademicLink[] = [
  {
    label: "SRU Staff",
    href: "https://sci.sru.ac.th/staff/",
    note: "หน้ารวมบุคลากรของคณะวิทยาศาสตร์และเทคโนโลยี",
  },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/scholar?q=%22Sittichoke%20Songsa-ard%22",
    note: "ลิงก์ค้นหาผลงานด้วยชื่อภาษาอังกฤษ",
  },
  {
    label: "ORCID",
    href: "https://orcid.org/orcid-search/search?searchQuery=Sittichoke%20Songsa-ard",
    note: "ลิงก์ค้นหา ORCID ด้วยชื่อภาษาอังกฤษ",
  },
  {
    label: "GitHub",
    href: "https://github.com/search?q=%22Sittichoke+Songsa-ard%22&type=users",
    note: "ลิงก์ค้นหา GitHub users ด้วยชื่อภาษาอังกฤษ",
  },
];

export const publications: Publication[] = [
  {
    title: "Fixed points in uniform spaces",
    authors: "Phichet Chaoha และ Sittichoke Songsa-ard",
    venue: "Fixed Point Theory and Applications",
    year: "2014",
    url: "https://fixedpointtheoryandalgorithms.springeropen.com/articles/10.1186/1687-1812-2014-134",
  },
  {
    title: "Generalization of alpha-G-Contractions to j-G-Contractions on Uniform Spaces",
    authors: "Sittichoke Songsa-ard และ Atthakorn Sakda",
    venue: "Journal of Applied Science and Emerging Technology",
    year: "2025",
    url: "https://ph01.tci-thaijo.org/index.php/JASCI/article/view/260436",
  },
];

export const publicCourses: PublicCourse[] = [
  {
    slug: "placeholder-calculus",
    code: "COURSE-PLACEHOLDER-101",
    title: "แคลคูลัส (ตัวอย่างรายวิชา)",
    term: "ภาคการศึกษา (รอข้อมูลยืนยัน)",
    summary:
      "พื้นที่สรุปรายวิชาแคลคูลัสสำหรับเผยแพร่ข้อมูลทั่วไป เช่น วัตถุประสงค์ เนื้อหา และแนวทางการเรียน",
    audience: "นักศึกษาที่ลงทะเบียนในรายวิชาที่ได้รับอนุมัติ",
    overview:
      "หน้านี้จะใช้แสดงเป้าหมายรายวิชา ความรู้พื้นฐานที่ควรมี ผลลัพธ์การเรียนรู้ และความคาดหวังของรายวิชา เมื่อได้รับข้อมูลจริงจากผู้สอนแล้ว",
    syllabus: [
      "ลิมิตและความต่อเนื่อง (รอรายละเอียด)",
      "อนุพันธ์และการประยุกต์ (รอรายละเอียด)",
      "ปริพันธ์และการสะสม (รอรายละเอียด)",
      "อนุกรมหรือหัวข้อแบบจำลองทางคณิตศาสตร์ (รอรายละเอียด)",
    ],
    weeklyLessons: [
      "สัปดาห์ที่ 1: แนะนำรายวิชาและทบทวนพื้นฐาน",
      "สัปดาห์ที่ 2: แนวคิดหลักของบทเรียน",
      "สัปดาห์ที่ 3: การฝึกแก้ปัญหาอย่างเป็นขั้นตอน",
      "สัปดาห์ที่ 4: ทบทวนและสังเคราะห์แนวคิด",
    ],
    resources: [
      "เอกสารประกอบการสอน (รออัปเดต)",
      "ชุดแบบฝึกหัด (รออัปเดต)",
      "รายการอ่านเพิ่มเติม (รออัปเดต)",
    ],
  },
  {
    slug: "placeholder-linear-algebra",
    code: "COURSE-PLACEHOLDER-201",
    title: "พีชคณิตเชิงเส้น (ตัวอย่างรายวิชา)",
    term: "ภาคการศึกษา (รอข้อมูลยืนยัน)",
    summary:
      "พื้นที่สรุปรายวิชาพีชคณิตเชิงเส้นสำหรับเผยแพร่ข้อมูลทั่วไปของรายวิชา",
    audience: "นักศึกษาที่ลงทะเบียนในรายวิชาที่ได้รับอนุมัติ",
    overview:
      "หน้านี้จะใช้สรุปเนื้อหาเกี่ยวกับเวกเตอร์ เมทริกซ์ การแปลงเชิงเส้น และการประยุกต์ เมื่อได้รับรายละเอียดรายวิชาที่ตรวจสอบแล้ว",
    syllabus: [
      "ระบบสมการเชิงเส้น (รอรายละเอียด)",
      "ปริภูมิเวกเตอร์ (รอรายละเอียด)",
      "การแปลงเชิงเส้น (รอรายละเอียด)",
      "ค่าเฉพาะ เวกเตอร์เฉพาะ และการประยุกต์ (รอรายละเอียด)",
    ],
    weeklyLessons: [
      "สัปดาห์ที่ 1: สัญลักษณ์ทางคณิตศาสตร์และภาพรวมรายวิชา",
      "สัปดาห์ที่ 2: วิธีการคำนวณด้วยเมทริกซ์",
      "สัปดาห์ที่ 3: กิจกรรมทำความเข้าใจแนวคิด",
      "สัปดาห์ที่ 4: อภิปรายตัวอย่างการประยุกต์",
    ],
    resources: [
      "แนวทางการอ่าน (รออัปเดต)",
      "ตัวอย่างเฉลยอย่างเป็นขั้นตอน (รออัปเดต)",
      "กิจกรรมประกอบด้วยซอฟต์แวร์คณิตศาสตร์ (รออัปเดต)",
    ],
  },
];

export const publicProjects = [
  {
    title: "คลังสื่อประกอบรายวิชา",
    summary:
      "พื้นที่สำหรับจัดระเบียบเอกสาร ตัวอย่าง ใบงาน และแหล่งอ่านเพิ่มเติมที่เผยแพร่ได้ในรายวิชาคณิตศาสตร์",
  },
  {
    title: "พื้นที่รายวิชาของอาจารย์สิทธิโชค",
    summary:
      "พื้นที่สำหรับเชื่อมการเรียนในรายวิชาที่อาจารย์สิทธิโชคเป็นผู้สอนกับข้อมูลส่วนตัวของผู้เรียน โดย enrollment และคะแนนยังคงอยู่หลังการเข้าสู่ระบบเท่านั้น",
  },
  {
    title: "กิจกรรมส่งเสริมการเรียนรู้คณิตศาสตร์",
    summary:
      "พื้นที่สำหรับกิจกรรมวิชาการ การบรรยาย หรือกิจกรรมเสริมสำหรับนักศึกษา เมื่อมีรายละเอียดที่ยืนยันแล้ว",
  },
];

export const teachingFocus = [
  {
    title: "ทำความเข้าใจนิยามและโครงสร้าง",
    body:
      "การเรียนคณิตศาสตร์ควรเริ่มจากความหมายของนิยาม ตัวอย่าง และเงื่อนไขที่ทำให้ทฤษฎีหนึ่งใช้งานได้จริง",
  },
  {
    title: "ฝึกเหตุผลเชิงพิสูจน์และการแก้ปัญหา",
    body:
      "แบบฝึกหัดและตัวอย่างควรช่วยให้นักศึกษาฝึกตรวจสอบสมมติฐาน วางลำดับเหตุผล และอธิบายคำตอบอย่างเป็นระบบ",
  },
  {
    title: "แยกสื่อ public ออกจากข้อมูลส่วนตัว",
    body:
      "สื่อที่เผยแพร่ได้ เช่น หัวข้อเรียนและเอกสารทั่วไป ควรอยู่ในหน้า public ส่วนคะแนนและ feedback รายบุคคลต้องอยู่ในพื้นที่รายวิชาหลังเข้าสู่ระบบ",
  },
];
