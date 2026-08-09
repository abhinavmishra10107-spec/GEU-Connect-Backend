const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { signToken } = require("../utils/token");

/**
 * Student login: college doesn't issue passwords for this prototype, so
 * identity is verified with Student ID + official email (both must match
 * an existing record). Swap this for real SSO/college-ERP auth in production.
 */
async function loginStudent(req, res) {
  const { studentId, email } = req.body;
  if (!studentId || !email) return res.status(400).json({ error: "studentId and email are required" });

  const student = await Student.findOne({ studentId, email: email.toLowerCase().trim() });
  if (!student) return res.status(401).json({ error: "No student found with that ID and email" });

  const token = signToken({ id: student._id, role: student.role, kind: "student" });
  res.json({ token, student });
}

/** Simple admin login for the demo — checks an admin-role student record. */
async function loginAdmin(req, res) {
  const { studentId, email } = req.body;
  const admin = await Student.findOne({ studentId, email: email?.toLowerCase().trim(), role: "admin" });
  if (!admin) return res.status(401).json({ error: "Not an admin account" });
  const token = signToken({ id: admin._id, role: "admin", kind: "student" });
  res.json({ token, admin });
}

/** Teacher login by email + phone (stand-in for a real faculty SSO). */
async function loginTeacher(req, res) {
  const { email, phone } = req.body;
  const teacher = await Teacher.findOne({ email: email?.toLowerCase().trim(), phone });
  if (!teacher) return res.status(401).json({ error: "No teacher found with that email and phone" });
  const token = signToken({ id: teacher._id, role: "teacher", kind: "teacher" });
  res.json({ token, teacher });
}

async function me(req, res) {
  if (req.user.kind === "teacher") {
    const teacher = await Teacher.findById(req.user.id);
    return res.json({ kind: "teacher", teacher });
  }
  const student = await Student.findById(req.user.id);
  res.json({ kind: "student", student });
}

module.exports = { loginStudent, loginAdmin, loginTeacher, me };
