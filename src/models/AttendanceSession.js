const mongoose = require("mongoose");

/**
 * A live QR attendance session started by a teacher.
 * `code` rotates every QR_REFRESH_MS (see sockets/index.js) so a screenshot
 * of the QR cannot be reused a few seconds later — the student must be
 * physically present, looking at the live-updating projector/screen.
 */
const AttendanceSessionSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    live: { type: Boolean, default: true },
    code: { type: String, required: true },
    codeIssuedAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    markedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AttendanceSession", AttendanceSessionSchema);
