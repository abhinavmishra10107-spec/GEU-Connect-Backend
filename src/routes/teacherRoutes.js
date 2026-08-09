const router = require("express").Router();
const ctrl = require("../controllers/teacherController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/", requireAuth, ctrl.listTeachers);
router.get("/:id", requireAuth, ctrl.getTeacher);
router.get("/:id/assignments", requireAuth, ctrl.teacherAssignments);
router.get("/:id/notes", requireAuth, ctrl.teacherNotes);
router.get("/:id/attendance-log", requireAuth, ctrl.teacherAttendanceLog);
router.patch("/:id/admin", requireAuth, requireRole("admin"), ctrl.adminUpdateTeacher);

module.exports = router;
