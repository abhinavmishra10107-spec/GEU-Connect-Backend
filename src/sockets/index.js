const crypto = require("crypto");
const AttendanceSession = require("../models/AttendanceSession");
const AttendanceRecord = require("../models/AttendanceRecord");
const ChatMessage = require("../models/ChatMessage");

// teacherId -> { intervalId, sessionId }
// One rotating-QR interval per live session, held in memory on this server
// instance. For multi-instance deployments, move this to Redis and use the
// socket.io Redis adapter so all instances see the same rotation.
const liveSessions = new Map();

function genCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function sessionRoom(teacherId) {
  return `attendance-session-${teacherId}`;
}

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    /* ---------------------------------------------------------------
       ATTENDANCE HUB — teacher broadcasts, students capture
       --------------------------------------------------------------- */

    // Teacher starts a live QR session for their class.
    socket.on("session:start", async ({ teacherId, section, subject }, ack) => {
      try {
        // End any previous live session for this teacher first.
        const prev = liveSessions.get(teacherId);
        if (prev) {
          clearInterval(prev.intervalId);
          await AttendanceSession.findByIdAndUpdate(prev.sessionId, { live: false, endedAt: new Date() });
        }

        const code = genCode();
        const session = await AttendanceSession.create({
          teacher: teacherId, section, subject, live: true, code, codeIssuedAt: new Date(),
        });

        const refreshMs = Number(process.env.QR_REFRESH_MS) || 5000;
        const intervalId = setInterval(async () => {
          const newCode = genCode();
          await AttendanceSession.findByIdAndUpdate(session._id, { code: newCode, codeIssuedAt: new Date() });
          io.to(sessionRoom(teacherId)).emit("session:update", {
            live: true, code: newCode, sessionId: session._id, subject, section,
          });
        }, refreshMs);

        liveSessions.set(teacherId, { intervalId, sessionId: session._id });

        io.to(sessionRoom(teacherId)).emit("session:update", {
          live: true, code, sessionId: session._id, subject, section,
        });
        ack?.({ ok: true, sessionId: session._id, code });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    // Teacher ends the session.
    socket.on("session:end", async ({ teacherId }, ack) => {
      try {
        const entry = liveSessions.get(teacherId);
        if (entry) {
          clearInterval(entry.intervalId);
          await AttendanceSession.findByIdAndUpdate(entry.sessionId, { live: false, endedAt: new Date() });
          liveSessions.delete(teacherId);
        }
        io.to(sessionRoom(teacherId)).emit("session:update", { live: false });
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    // Anyone (teacher screen or student) joins a session's room to receive updates.
    socket.on("session:join", async ({ teacherId }, ack) => {
      socket.join(sessionRoom(teacherId));
      const entry = liveSessions.get(teacherId);
      if (entry) {
        const session = await AttendanceSession.findById(entry.sessionId);
        ack?.({ live: true, code: session.code, sessionId: session._id, subject: session.subject, section: session.section });
      } else {
        ack?.({ live: false });
      }
    });

    // Student captures the currently-displayed QR code to mark attendance.
    // Rejected if the session isn't live, the code is stale (already rotated),
    // or the student already marked this session — preventing replay/proxy marking.
    socket.on("attendance:capture", async ({ teacherId, studentId, code, date, time }, ack) => {
      try {
        const entry = liveSessions.get(teacherId);
        if (!entry) return ack?.({ ok: false, reason: "No live session" });

        const session = await AttendanceSession.findById(entry.sessionId);
        if (!session || !session.live) return ack?.({ ok: false, reason: "Session ended" });
        if (session.code !== code) return ack?.({ ok: false, reason: "QR code expired — try scanning again" });
        if (session.markedStudents.some((s) => String(s) === String(studentId))) {
          return ack?.({ ok: false, reason: "Already marked for this session" });
        }

        const record = await AttendanceRecord.create({
          student: studentId, teacher: teacherId, session: session._id,
          date: date || new Date().toLocaleDateString("en-GB"), time: time || new Date().toLocaleTimeString(),
          status: "Present",
        });
        session.markedStudents.push(studentId);
        await session.save();

        io.to(sessionRoom(teacherId)).emit("session:studentMarked", { studentId, count: session.markedStudents.length });
        ack?.({ ok: true, record });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    /* ---------------------------------------------------------------
       CHAT — class group chat, CR chat, teacher query chat all share
       this generic room-based messaging (kind differentiates them).
       --------------------------------------------------------------- */
    socket.on("chat:join", ({ room }) => socket.join(room));

    socket.on("chat:send", async ({ room, kind, senderName, senderRole, text }, ack) => {
      try {
        const message = await ChatMessage.create({ room, kind, senderName, senderRole, text });
        io.to(room).emit("chat:message", message);
        ack?.({ ok: true, message });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    socket.on("disconnect", () => {
      // Rooms are cleaned up automatically by socket.io; live sessions keep
      // running on their interval regardless of any one socket disconnecting.
    });
  });
}

module.exports = { registerSocketHandlers };
