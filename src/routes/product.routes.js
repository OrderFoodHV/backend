const router = require("express").Router();
const product = require("../controllers/product.controller");

// Lấy toàn bộ Menu
router.get("/", product.getAll);

router.get("/categories", product.getCategories);

// Lấy chi tiết 1 món (VD: /products/1)
router.get("/:id", product.getOne);

module.exports = router;
