const router = require("express").Router();
const ctrl = require("../controllers/chatController");
const { requireAuth } = require("../middleware/auth");

router.get("/:room/history", requireAuth, ctrl.history);

// Live send/receive happens over Socket.IO — see src/sockets/index.js.

module.exports = router;
