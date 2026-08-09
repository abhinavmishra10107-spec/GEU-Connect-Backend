const Student = require("../models/Student");

async function getStudent(req, res) {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
}

/** Students can only update their own phone & email (per product rules). */
async function updateContact(req, res) {
  const { phone, email } = req.body;
  if (req.user.id !== req.params.id) return res.status(403).json({ error: "Can only edit your own profile" });
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { ...(phone && { phone }), ...(email && { email: email.toLowerCase().trim() }) },
    { new: true }
  );
  res.json(student);
}

/** Admin-only full record edit (name, roll, section, etc.). */
async function adminUpdateStudent(req, res) {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
}

async function logHydration(req, res) {
  const { ml } = req.body;
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  student.hydrationLoggedMl = Math.min(student.hydrationGoalMl, student.hydrationLoggedMl + (ml || 250));
  await student.save();
  res.json(student);
}

async function listBySection(req, res) {
  const { section } = req.query;
  const filter = section ? { section } : {};
  const students = await Student.find(filter).select("-__v");
  res.json(students);
}

module.exports = { getStudent, updateContact, adminUpdateStudent, logHydration, listBySection };
