const router = require("express").Router();
const ctrl = require("../controllers/noteController");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, ctrl.listForStudent);
router.post("/", requireAuth, ctrl.createNote);

module.exports = router;
