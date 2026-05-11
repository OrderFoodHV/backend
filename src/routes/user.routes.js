const router = require("express").Router();
const user = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Xem profile của mình
router.get("/me", verifyToken, user.getMe);

// Cập nhật profile của mình
router.patch("/update-me", verifyToken, user.updateMe);

module.exports = router;
