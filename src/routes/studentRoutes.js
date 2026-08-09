const router = require("express").Router();
const ctrl = require("../controllers/studentController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/", requireAuth, ctrl.listBySection);
router.get("/:id", requireAuth, ctrl.getStudent);
router.patch("/:id/contact", requireAuth, ctrl.updateContact); // student self-edit: phone/email only
router.patch("/:id/hydration", requireAuth, ctrl.logHydration);
router.patch("/:id/admin", requireAuth, requireRole("admin"), ctrl.adminUpdateStudent);

module.exports = router;
