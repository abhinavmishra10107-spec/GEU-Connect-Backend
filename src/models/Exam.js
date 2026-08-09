const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["upcoming", "result", "seating"], required: true },
    subject: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }, // set for result/seating entries
    date: { type: String, default: "" },
    time: { type: String, default: "" },
    room: { type: String, default: "" },
    marks: { type: Number },
    total: { type: Number },
    grade: { type: String },
    seat: { type: String },
    row: { type: String },
    section: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
