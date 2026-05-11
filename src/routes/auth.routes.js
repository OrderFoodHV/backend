const router = require("express").Router();
const auth = require("../controllers/auth.controller");

router.post("/register", auth.register);
// Tạm khóa 2 ông này lại vì chưa đắp code 3 tầng vào
router.post("/login", auth.login);
//router.post("/refresh-token", auth.refreshToken);

module.exports = router;
