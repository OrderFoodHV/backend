const router = require("express").Router();
const partner = require("../controllers/partner.controller");
const verifyAdmin = require("../middlewares/admin.middleware");

// Tất cả routes đều cần xác thực admin
router.use(verifyAdmin);

// Quản lý đối tác
router.get("/partners", partner.getPartners);
router.put("/partners/:id", partner.updatePartner);
router.delete("/partners/:id", partner.deletePartner);
router.post("/partners/:id/approve", partner.approvePartner);

module.exports = router;