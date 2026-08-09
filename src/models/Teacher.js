const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    subjectCode: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tint: { type: String, default: "#7dd3fc" },
    section: { type: String, default: "" }, // which section they primarily teach
    timetable: [{ time: String, room: String }],
    books: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
