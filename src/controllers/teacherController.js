const Teacher = require("../models/Teacher");
const Assignment = require("../models/Assignment");
const Note = require("../models/Note");
const AttendanceRecord = require("../models/AttendanceRecord");

async function listTeachers(req, res) {
  const { section } = req.query;
  const filter = section ? { section } : {};
  res.json(await Teacher.find(filter));
}

async function getTeacher(req, res) {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return res.status(404).json({ error: "Teacher not found" });
  res.json(teacher);
}

async function adminUpdateTeacher(req, res) {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(teacher);
}

async function teacherAssignments(req, res) {
  res.json(await Assignment.find({ teacher: req.params.id }).sort({ due: 1 }));
}

async function teacherNotes(req, res) {
  res.json(await Note.find({ teacher: req.params.id }).sort({ createdAt: -1 }));
}

/** Class-wise attendance log for one teacher's subject, most recent first. */
async function teacherAttendanceLog(req, res) {
  const records = await AttendanceRecord.find({ teacher: req.params.id })
    .populate("student", "name roll studentId")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(records);
}

module.exports = { listTeachers, getTeacher, adminUpdateTeacher, teacherAssignments, teacherNotes, teacherAttendanceLog };
