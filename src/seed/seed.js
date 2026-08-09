/**
 * Seeds the database with the same dummy data used in the frontend prototype,
 * so the API is immediately demoable. Run with: npm run seed
 */
require("dotenv").config();
const connectDB = require("../config/db");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Notice = require("../models/Notice");
const Assignment = require("../models/Assignment");
const Note = require("../models/Note");
const Exam = require("../models/Exam");
const AttendanceRecord = require("../models/AttendanceRecord");

async function seed() {
  await connectDB();
  console.log("[seed] clearing existing data…");
  await Promise.all([
    Student.deleteMany({}), Teacher.deleteMany({}), Notice.deleteMany({}),
    Assignment.deleteMany({}), Note.deleteMany({}), Exam.deleteMany({}), AttendanceRecord.deleteMany({}),
  ]);

  console.log("[seed] creating students…");
  const student = await Student.create({
    name: "Aryan Bidhuri", studentId: "24021732", email: "aryanbidhuri3@gmail.com",
    phone: "+91 98765 43210", course: "B.Tech", branch: "Computer Science & Engineering",
    sem: 5, section: "C1", roll: 17, age: 20, height: 175, weight: 68,
    hometown: "Kotdwar (~6 hrs by road/rail)", hydrationLoggedMl: 1300, role: "student",
  });
  const cr = await Student.create({
    name: "Meenal Rawat", studentId: "24021705", email: "meenal.rawat@geu.ac.in",
    phone: "+91 91234 56780", course: "B.Tech", branch: "Computer Science & Engineering",
    sem: 5, section: "C1", roll: 5, role: "cr",
  });
  await Student.create({
    name: "GEU Admin", studentId: "ADMIN001", email: "admin@geu.ac.in", role: "admin",
  });

  console.log("[seed] creating teachers…");
  const [aayush, himanshu, saumitra, priya] = await Teacher.create([
    { name: "Aayush Kumar", subject: "CEC — Communication & Ethics", phone: "+91 90000 11111", email: "aayush.kumar@geu.ac.in", tint: "#7dd3fc", section: "C1", timetable: [{ time: "Mon 9:00–9:55", room: "LH-204" }, { time: "Wed 11:00–11:55", room: "LH-204" }, { time: "Fri 9:00–9:55", room: "LH-204" }], books: ["Business Communication — Meenakshi Raman", "Ethics & Values — R.C. Sharma"] },
    { name: "Himanshu Namdev", subject: "System Design — TCS 504", phone: "+91 90000 22222", email: "himanshu.namdev@geu.ac.in", tint: "#c4b5fd", section: "C1", timetable: [{ time: "Mon 11:00–11:55", room: "LH-108" }, { time: "Tue 2:00–2:55", room: "Lab-3" }, { time: "Thu 10:00–10:55", room: "LH-108" }], books: ["Designing Data-Intensive Applications — Martin Kleppmann"] },
    { name: "Dr Saumitra Chattopadhyay", subject: "TCS597(E) Elective G1", phone: "+91 90000 33333", email: "saumitra.c@geu.ac.in", tint: "#fdba74", section: "C1", timetable: [{ time: "Tue 9:00–9:55", room: "LH-310" }, { time: "Thu 9:00–9:55", room: "LH-310" }], books: ["Reference handout shared in class"] },
    { name: "Priya Chauhan", subject: "Data Structures — TCS 302", phone: "+91 90000 44444", email: "priya.chauhan@geu.ac.in", tint: "#fda4af", section: "C1", timetable: [{ time: "Mon 1:00–1:55", room: "LH-115" }, { time: "Wed 9:00–9:55", room: "LH-115" }, { time: "Fri 11:00–11:55", room: "Lab-1" }], books: ["Data Structures — Seymour Lipschutz"] },
  ]);

  console.log("[seed] creating notices…");
  await Notice.create([
    { title: "System Design class rescheduled", by: "Himanshu Namdev (Faculty)", body: "Tuesday 2:00 PM lab session moved to 5:00 PM, Lab-3.", section: "C1" },
    { title: "Additional class — CEC", by: "Aayush Kumar (Faculty)", body: "Additional doubt-clearing class Saturday 10:00 AM, LH-204.", section: "C1" },
    { title: "Elective G1 suspended tomorrow", by: "Meenal Rawat (CR)", body: "Dr Chattopadhyay is unavailable; Thursday's elective class stands suspended.", section: "C1" },
  ]);

  console.log("[seed] creating assignments…");
  await Assignment.create([
    { teacher: aayush._id, title: "Reflective Essay — Ethics in Tech", due: new Date("2026-08-12"), section: "C1", submissions: [] },
    { teacher: aayush._id, title: "Group Presentation Slides", due: new Date("2026-08-02"), section: "C1", submissions: [{ student: student._id, status: "Submitted", submittedAt: new Date() }] },
    { teacher: himanshu._id, title: "HLD — Ride-sharing App", due: new Date("2026-08-14"), section: "C1", submissions: [] },
    { teacher: himanshu._id, title: "LLD — Rate Limiter", due: new Date("2026-08-03"), section: "C1", submissions: [{ student: student._id, status: "Submitted", submittedAt: new Date() }] },
    { teacher: priya._id, title: "AVL Tree Implementation", due: new Date("2026-08-10"), section: "C1", submissions: [{ student: student._id, status: "Submitted", submittedAt: new Date() }] },
    { teacher: saumitra._id, title: "Research Note — Emerging Tech", due: new Date("2026-08-20"), section: "C1", submissions: [] },
  ]);

  console.log("[seed] creating notes…");
  await Note.create([
    { teacher: aayush._id, title: "Unit 3 — Professional Ethics", fileName: "CEC_Unit3.pdf", youtubeLink: "https://youtube.com/watch?v=example1", section: "C1" },
    { teacher: himanshu._id, title: "Scalability & Load Balancing", fileName: "SysDesign_Scalability.pdf", youtubeLink: "https://youtube.com/watch?v=example2", section: "C1" },
    { teacher: saumitra._id, title: "Elective Module 1 Slides", fileName: "Elective_Mod1.pdf", youtubeLink: "https://youtube.com/watch?v=example3", section: "C1" },
    { teacher: priya._id, title: "Trees & Graphs Notes", fileName: "DS_TreesGraphs.pdf", youtubeLink: "https://youtube.com/watch?v=example4", section: "C1" },
  ]);

  console.log("[seed] creating exam entries…");
  await Exam.create([
    { type: "upcoming", subject: "System Design (TCS 504)", teacher: himanshu._id, date: "22 Aug 2026", time: "10:00 AM", room: "Exam Hall B", section: "C1" },
    { type: "upcoming", subject: "CEC", teacher: aayush._id, date: "24 Aug 2026", time: "10:00 AM", room: "Exam Hall B", section: "C1" },
    { type: "result", subject: "Data Structures", student: student._id, marks: 42, total: 50, grade: "A" },
    { type: "result", subject: "Elective G1", student: student._id, marks: 35, total: 50, grade: "B+" },
    { type: "seating", subject: "System Design", student: student._id, room: "Exam Hall B", seat: "B-14", row: "Row 3" },
  ]);

  console.log("[seed] creating attendance history…");
  await AttendanceRecord.create([
    { student: student._id, teacher: aayush._id, date: "05 Aug 2026", time: "9:00 AM", status: "Present" },
    { student: student._id, teacher: aayush._id, date: "01 Aug 2026", time: "9:00 AM", status: "Present" },
    { student: student._id, teacher: aayush._id, date: "29 Jul 2026", time: "9:00 AM", status: "Absent" },
    { student: student._id, teacher: himanshu._id, date: "06 Aug 2026", time: "11:00 AM", status: "Present" },
    { student: student._id, teacher: himanshu._id, date: "30 Jul 2026", time: "11:00 AM", status: "Present" },
    { student: student._id, teacher: saumitra._id, date: "07 Aug 2026", time: "9:00 AM", status: "Present" },
    { student: student._id, teacher: saumitra._id, date: "05 Aug 2026", time: "9:00 AM", status: "Absent" },
    { student: student._id, teacher: priya._id, date: "06 Aug 2026", time: "1:00 PM", status: "Present" },
  ]);

  console.log("[seed] done ✔");
  console.log(`[seed] Login with studentId="24021732" email="aryanbidhuri3@gmail.com"`);
  console.log(`[seed] Admin login studentId="ADMIN001" email="admin@geu.ac.in"`);
  process.exit(0);
}

seed().catch((err) => { console.error("[seed] failed:", err); process.exit(1); });
