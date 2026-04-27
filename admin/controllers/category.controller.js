const db = require("../../config/db");

// Quản lý danh mục gốc - Lấy danh sách danh mục gốc
exports.getRootCategories = (req, res) => {
  db.query(
    "SELECT id, name, description, image, status, created_at FROM categories WHERE parent_id IS NULL ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// Thêm danh mục gốc mới
exports.createRootCategory = (req, res) => {
  const { name, description, image } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
  }

  db.query(
    "INSERT INTO categories (name, description, image, parent_id) VALUES (?, ?, ?, NULL)",
    [name, description, image],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Thêm danh mục gốc thành công", id: results.insertId });
    }
  );
};

// Cập nhật danh mục gốc
exports.updateRootCategory = (req, res) => {
  const { id } = req.params;
  const { name, description, image, status } = req.body;

  db.query(
    "UPDATE categories SET name = ?, description = ?, image = ?, status = ? WHERE id = ? AND parent_id IS NULL",
    [name, description, image, status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật danh mục gốc thành công" });
    }
  );
};

// Xóa danh mục gốc
exports.deleteRootCategory = (req, res) => {
  const { id } = req.params;
  
  // Kiểm tra có danh mục con không
  db.query(
    "SELECT COUNT(*) as count FROM categories WHERE parent_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results[0].count > 0) {
        return res.status(400).json({ message: "Không thể xóa danh mục có danh mục con" });
      }
      
      db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Xóa danh mục gốc thành công" });
      });
    }
  );
};

// Cập nhật trạng thái danh mục
exports.updateCategoryStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE categories SET status = ? WHERE id = ? AND parent_id IS NULL",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Cập nhật trạng thái danh mục thành công" });
    }
  );
};