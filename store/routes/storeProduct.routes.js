const router = require("express").Router({ mergeParams: true });
const { verifyStoreAccess } = require("../middlewares/store.middleware");
const storeProduct = require("../controllers/storeProduct.controller");

router.use(verifyStoreAccess);

router.get("/", storeProduct.getProducts);
router.post("/", storeProduct.createProduct);
router.put("/bulk-toggle", storeProduct.bulkToggle);
router.put("/:productId/toggle", storeProduct.toggleAvailability);
router.put("/:productId", storeProduct.updateProduct);
router.delete("/:productId", storeProduct.deleteProduct);

module.exports = router;
