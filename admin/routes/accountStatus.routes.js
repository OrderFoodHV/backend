const router = require("express").Router();
const accountStatus = require("../controllers/accountStatus.controller");
const verifyAdmin = require("../middlewares/admin.middleware");

// Tất cả routes đều cần xác thực admin
router.use(verifyAdmin);

// Quản lý trạng thái tài khoản
router.get("/accounts", accountStatus.getAccounts);
router.get("/accounts/:id", accountStatus.getAccountDetail);
router.put("/accounts/:id/status", accountStatus.updateAccountStatus);
router.post("/accounts/:id/ban", accountStatus.banAccount);
router.post("/accounts/:id/unban", accountStatus.unbanAccount);

module.exports = router;