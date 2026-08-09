const AttendanceRecord = require("../models/AttendanceRecord");

/**
 * Rule-based canned assistant so the demo works with zero external API keys.
 * Swap the body of this function for a call to Claude (or any LLM API) —
 * e.g. POST https://api.anthropic.com/v1/messages — when you're ready to
 * make it a real AI buddy. Keep the student's live data (attendance,
 * timetable, etc.) in the prompt so answers stay grounded in real records.
 */
async function reply(req, res) {
  const { message, studentId } = req.body;
  const q = (message || "").toLowerCase();
  let text;

  if (q.includes("attendance")) {
    const records = studentId ? await AttendanceRecord.find({ student: studentId }) : [];
    const total = records.length || 1;
    const present = records.filter((r) => r.status === "Present").length;
    const pct = Math.round((present / total) * 100);
    text = `Your overall attendance is ${pct}% (${present}/${total} classes). Required is 75%.`;
  } else if (q.includes("free")) {
    text = "Check your free periods on the Timetable card — I'll suggest something to do with the time.";
  } else if (q.includes("timetable") || q.includes("class")) {
    text = "Open Classes Today for today's rooms and timings, or Timetable for the full week + calendar.";
  } else if (q.includes("exam")) {
    text = "Your upcoming exams and past results are under the Exam card.";
  } else if (q.includes("water") || q.includes("hydrat")) {
    text = "Log your water intake from the Health & Fitness card — I'll remind you to top up between classes.";
  } else {
    text = "I can help with your timetable, attendance, exams, hydration or free-time ideas — just ask!";
  }

  res.json({ text });
}

module.exports = { reply };
