const router = require("express").Router();
const category = require("../controllers/category.controller");

// Bảo vệ đã được áp dụng ở admin/routes/index.js

// Quản lý danh mục gốc
router.get("/categories", category.getRootCategories);
router.post("/categories", category.createRootCategory);
router.put("/categories/:id", category.updateRootCategory);
router.delete("/categories/:id", category.deleteRootCategory);
router.put("/categories/:id/status", category.updateCategoryStatus);

module.exports = router;