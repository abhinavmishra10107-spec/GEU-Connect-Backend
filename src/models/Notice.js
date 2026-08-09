const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    by: { type: String, required: true }, // display name of poster (teacher or CR)
    postedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "postedByModel" },
    postedByModel: { type: String, enum: ["Teacher", "Student"] },
    section: { type: String, default: "" }, // restrict to a section, blank = all
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", NoticeSchema);
