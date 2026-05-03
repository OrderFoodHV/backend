const router = require("express").Router();
const product = require("../controllers/product.controller");
const multer = require("multer");
//1. Cấu hình Multer để "hứng" ảnh vào RAM (Memory Storage)
const storage = multer.memoryStorage(); // Lưu ảnh vào RAM tạm thời để Sharp xử lý
const upload = multer({ storage: storage });

router.get("/", product.getAll);
router.get("/:id", product.getOne);
router.post("/create", upload.single("image"), productController.create);

module.exports = router;
