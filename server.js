require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const { registerSocketHandlers } = require("./src/sockets");

const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");
const noticeRoutes = require("./src/routes/noticeRoutes");
const assignmentRoutes = require("./src/routes/assignmentRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const examRoutes = require("./src/routes/examRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const aiController = require("./src/controllers/aiController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*", credentials: true },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json());

// Make io available to controllers that want to push live updates (e.g. new notices).
app.use((req, res, next) => { req.io = io; next(); });

app.get("/api/health", (req, res) => res.json({ ok: true, service: "geu-connect-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/chat", chatRoutes);
app.post("/api/ai/reply", aiController.reply);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`[server] GEU Connect API + sockets listening on :${PORT}`));
});
