const router = require("express").Router();
const ctrl = require("../controllers/noticeController");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, ctrl.listNotices);
router.post("/", requireAuth, ctrl.createNotice); // teachers, CRs, or admin
router.delete("/:id", requireAuth, ctrl.deleteNotice);

module.exports = router;
