const router = require("express").Router();
const storeProduct = require("../controllers/storeProduct.controller");

router.get("/:storeId/products", storeProduct.getProducts);
router.post("/:storeId/products", storeProduct.createProduct);
router.put("/:storeId/products/bulk-toggle", storeProduct.bulkToggle);
router.put("/:storeId/products/:productId", storeProduct.updateProduct);
router.delete("/:storeId/products/:productId", storeProduct.deleteProduct);
router.put("/:storeId/products/:productId/toggle", storeProduct.toggleAvailability);

module.exports = router;
