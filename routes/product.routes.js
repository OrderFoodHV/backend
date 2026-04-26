const router = require("express").Router();
const product = require("../controllers/product.controller");

router.get("/", product.getAll);
router.get("/:id", product.getOne);

module.exports = router;
