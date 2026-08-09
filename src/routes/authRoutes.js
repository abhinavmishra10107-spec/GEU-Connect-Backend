const router = require("express").Router();
const { loginStudent, loginAdmin, loginTeacher, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.post("/login/student", loginStudent);
router.post("/login/admin", loginAdmin);
router.post("/login/teacher", loginTeacher);
router.get("/me", requireAuth, me);

module.exports = router;
