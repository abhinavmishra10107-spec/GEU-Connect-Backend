const Note = require("../models/Note");

async function listForStudent(req, res) {
  const { section } = req.query;
  const notes = await Note.find(section ? { section } : {}).populate("teacher", "name subject").sort({ createdAt: -1 });
  res.json(notes);
}

async function createNote(req, res) {
  const { teacher, title, fileUrl, fileName, youtubeLink, section } = req.body;
  const note = await Note.create({ teacher, title, fileUrl, fileName, youtubeLink, section });
  res.status(201).json(note);
}

module.exports = { listForStudent, createNote };
