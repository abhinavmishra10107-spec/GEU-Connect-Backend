const Notice = require("../models/Notice");

async function listNotices(req, res) {
  const { section } = req.query;
  const filter = section ? { $or: [{ section }, { section: "" }] } : {};
  const notices = await Notice.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(notices);
}

async function createNotice(req, res) {
  const { title, body, by, section } = req.body;
  if (!title || !by) return res.status(400).json({ error: "title and by are required" });
  const notice = await Notice.create({ title, body, by, section: section || "" });
  req.io?.emit("notice:new", notice); // push live to connected clients
  res.status(201).json(notice);
}

async function deleteNotice(req, res) {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}

module.exports = { listNotices, createNotice, deleteNotice };
