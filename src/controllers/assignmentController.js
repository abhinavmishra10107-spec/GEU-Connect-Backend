const Assignment = require("../models/Assignment");

async function listForStudent(req, res) {
  const { section } = req.query;
  const assignments = await Assignment.find(section ? { section } : {})
    .populate("teacher", "name subject")
    .sort({ due: 1 });

  // Shape per-student view: status is Submitted only if this student has a submission
  const studentId = req.query.studentId;
  const shaped = assignments.map((a) => {
    const mine = studentId ? a.submissions.find((s) => String(s.student) === String(studentId)) : null;
    return {
      _id: a._id,
      title: a.title,
      due: a.due,
      subject: a.teacher?.subject,
      teacher: a.teacher?.name,
      status: mine ? mine.status : "Pending",
    };
  });
  res.json(shaped);
}

async function createAssignment(req, res) {
  const { teacher, title, due, fileUrl, section } = req.body;
  const assignment = await Assignment.create({ teacher, title, due, fileUrl, section });
  res.status(201).json(assignment);
}

async function submitAssignment(req, res) {
  const { studentId } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ error: "Assignment not found" });

  const existing = assignment.submissions.find((s) => String(s.student) === String(studentId));
  if (existing) {
    existing.status = "Submitted";
    existing.submittedAt = new Date();
  } else {
    assignment.submissions.push({ student: studentId, status: "Submitted", submittedAt: new Date() });
  }
  await assignment.save();
  res.json(assignment);
}

module.exports = { listForStudent, createAssignment, submitAssignment };
