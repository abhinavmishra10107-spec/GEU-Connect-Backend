const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, index: true }, // e.g. "class-C1", "cr-<studentId>", "query-<teacherId>-<studentId>", "ai-<studentId>"
    kind: { type: String, enum: ["class", "cr", "query", "ai"], required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ["student", "teacher", "ai"], default: "student" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
