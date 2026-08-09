const router = require("express").Router();
const ctrl = require("../controllers/examController");
const { requireAuth } = require("../middleware/auth");

router.get("/upcoming", requireAuth, ctrl.upcoming);
router.get("/results", requireAuth, ctrl.results);
router.get("/seating", requireAuth, ctrl.seating);
router.post("/", requireAuth, ctrl.createExamEntry); // teacher / exam cell

module.exports = router;
