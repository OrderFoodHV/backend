const router = require("express").Router();
const partner = require("../controllers/partner.controller");

// Bảo vệ đã được áp dụng ở admin/routes/index.js

// Quản lý đối tác
router.get("/partners", partner.getPartners);
router.put("/partners/:id", partner.updatePartner);
router.delete("/partners/:id", partner.deletePartner);
router.post("/partners/:id/approve", partner.approvePartner);

module.exports = router;