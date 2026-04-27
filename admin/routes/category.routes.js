const router = require("express").Router();
const category = require("../controllers/category.controller");
const verifyAdmin = require("../middlewares/admin.middleware");

// Tất cả routes đều cần xác thực admin
router.use(verifyAdmin);

// Quản lý danh mục gốc
router.get("/categories", category.getRootCategories);
router.post("/categories", category.createRootCategory);
router.put("/categories/:id", category.updateRootCategory);
router.delete("/categories/:id", category.deleteRootCategory);
router.put("/categories/:id/status", category.updateCategoryStatus);

module.exports = router;