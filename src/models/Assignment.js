const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    title: { type: String, required: true },
    due: { type: Date, required: true },
    fileUrl: { type: String, default: "" },
    section: { type: String, default: "" },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        status: { type: String, enum: ["Pending", "Submitted"], default: "Pending" },
        submittedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", AssignmentSchema);
