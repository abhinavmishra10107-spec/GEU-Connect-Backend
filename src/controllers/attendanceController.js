const AttendanceRecord = require("../models/AttendanceRecord");
const AttendanceSession = require("../models/AttendanceSession");
const Teacher = require("../models/Teacher");

/** Overall + subject-wise attendance summary for one student. */
async function summaryForStudent(req, res) {
  const studentId = req.params.studentId;
  const records = await AttendanceRecord.find({ student: studentId }).populate("teacher", "name subject");

  const bySubject = {};
  for (const r of records) {
    const key = r.teacher?._id?.toString() || "unknown";
    if (!bySubject[key]) bySubject[key] = { name: r.teacher?.subject, teacher: r.teacher?.name, total: 0, present: 0 };
    bySubject[key].total += 1;
    if (r.status === "Present") bySubject[key].present += 1;
  }
  const subjects = Object.values(bySubject);
  const total = records.length;
  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;

  res.json({ summary: { total, present, absent, required: 75 }, subjects });
}

/** Current session status for a teacher (used on modal open, before sockets connect). */
async function getSessionStatus(req, res) {
  const session = await AttendanceSession.findOne({ teacher: req.params.teacherId, live: true }).sort({ createdAt: -1 });
  res.json({ live: !!session, session });
}

/** Manual REST fallback to end a session (sockets normally do this). */
async function endSession(req, res) {
  const session = await AttendanceSession.findByIdAndUpdate(req.params.sessionId, { live: false, endedAt: new Date() }, { new: true });
  res.json(session);
}

module.exports = { summaryForStudent, getSessionStatus, endSession };
