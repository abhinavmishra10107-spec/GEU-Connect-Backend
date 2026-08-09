const router = require("express").Router();
const ctrl = require("../controllers/assignmentController");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, ctrl.listForStudent); // ?section=C1&studentId=...
router.post("/", requireAuth, ctrl.createAssignment); // teacher uploads
router.post("/:id/submit", requireAuth, ctrl.submitAssignment); // student submits

module.exports = router;
