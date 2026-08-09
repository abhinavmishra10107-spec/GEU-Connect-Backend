const router = require("express").Router();
const ctrl = require("../controllers/attendanceController");
const { requireAuth } = require("../middleware/auth");

router.get("/summary/:studentId", requireAuth, ctrl.summaryForStudent);
router.get("/session/:teacherId", requireAuth, ctrl.getSessionStatus);
router.post("/session/:sessionId/end", requireAuth, ctrl.endSession);

// NOTE: starting a session, rotating the QR code every 5s, and capturing
// attendance all happen over Socket.IO in real time — see src/sockets/index.js.
// REST here only covers read/status + a manual end-session fallback.

module.exports = router;
