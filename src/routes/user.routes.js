const router = require("express").Router();
const user = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Xem profile của mình
router.get("/me", verifyToken, user.getMe);

// Cập nhật profile của mình
router.patch("/update-me", verifyToken, user.updateMe);
// Cổng API xóa vĩnh viễn tài khoản đăng nhập
router.delete("/delete-account", verifyToken, user.deleteMe);
module.exports = router;
