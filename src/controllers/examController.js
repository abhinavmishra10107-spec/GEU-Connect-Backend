const Exam = require("../models/Exam");

async function upcoming(req, res) {
  const { section } = req.query;
  res.json(await Exam.find({ type: "upcoming", ...(section && { section }) }).sort({ date: 1 }));
}

async function results(req, res) {
  const { studentId } = req.query;
  res.json(await Exam.find({ type: "result", student: studentId }));
}

async function seating(req, res) {
  const { studentId } = req.query;
  res.json(await Exam.find({ type: "seating", student: studentId }));
}

async function createExamEntry(req, res) {
  const entry = await Exam.create(req.body);
  res.status(201).json(entry);
}

module.exports = { upcoming, results, seating, createExamEntry };
