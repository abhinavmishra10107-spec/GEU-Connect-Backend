const mongoose = require("mongoose");

const AttendanceRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceSession" },
    date: { type: String, required: true }, // display date, e.g. "09 Aug 2026"
    time: { type: String, required: true }, // display time, e.g. "9:00 AM"
    status: { type: String, enum: ["Present", "Absent", "Rescheduled"], default: "Present" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AttendanceRecord", AttendanceRecordSchema);
