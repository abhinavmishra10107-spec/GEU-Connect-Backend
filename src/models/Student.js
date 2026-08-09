const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    course: { type: String, default: "B.Tech" },
    branch: { type: String, default: "" },
    sem: { type: Number, default: 1 },
    section: { type: String, default: "" },
    roll: { type: Number, default: 0 },
    age: { type: Number, default: null },
    height: { type: Number, default: null }, // cm
    weight: { type: Number, default: null }, // kg
    hometown: { type: String, default: "" },
    hydrationLoggedMl: { type: Number, default: 0 },
    hydrationGoalMl: { type: Number, default: 2800 },
    role: { type: String, enum: ["student", "cr", "admin"], default: "student" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
