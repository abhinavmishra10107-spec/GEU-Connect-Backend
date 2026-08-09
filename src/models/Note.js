const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    youtubeLink: { type: String, default: "" },
    section: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
