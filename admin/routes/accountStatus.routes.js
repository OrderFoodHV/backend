const router = require("express").Router();
const accountStatus = require("../controllers/accountStatus.controller");

// Bảo vệ đã được áp dụng ở admin/routes/index.js

// Quản lý trạng thái tài khoản
router.get("/accounts", accountStatus.getAccounts);
router.get("/accounts/:id", accountStatus.getAccountDetail);
router.put("/accounts/:id/status", accountStatus.updateAccountStatus);
router.post("/accounts/:id/ban", accountStatus.banAccount);
router.post("/accounts/:id/unban", accountStatus.unbanAccount);

module.exports = router;