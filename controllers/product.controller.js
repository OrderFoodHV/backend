const db = require("../config/db");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// 1. Lấy tất cả sản phẩm
exports.getAll = (req, res) => {
  db.query("SELECT * FROM products", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};

// 2. Lấy chi tiết một sản phẩm
exports.getOne = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0)
        return res.status(404).json({ message: "Không thấy sản phẩm" });
      res.json(data[0]);
    },
  );
};

// 3. TẠO SẢN PHẨM MỚI (Có xử lý WebP đúng ý thầy)
exports.create = async (req, res) => {
  try {
    const { store_id, category_id, name, price, description } = req.body;
    let imagePath = null;

    // Nếu Admin có upload ảnh
    if (req.file) {
      const fileName = `product-${Date.now()}.webp`;
      const uploadDir = path.join(__dirname, "../uploads/");

      // Kiểm tra nếu thư mục uploads chưa có thì tạo mới
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const outputPath = path.join(uploadDir, fileName);

      // Xử lý: Nén, Resize và Chuyển sang WebP
      await sharp(req.file.buffer)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(outputPath);

      imagePath = `/uploads/${fileName}`;
    }

    const sql =
      "INSERT INTO products (store_id, category_id, name, image, price, description) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [store_id, category_id, name, imagePath, price, description],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({
          message: "Tạo sản phẩm thành công!",
          id: result.insertId,
          image: imagePath,
        });
      },
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
