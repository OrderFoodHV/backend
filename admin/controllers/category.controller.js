const db = require("../../config/db");
const { ok, created, success, fail } = require("../../utils/response");

exports.getRootCategories = async (req, res, next) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, description, image, status, created_at FROM categories WHERE parent_id IS NULL ORDER BY created_at DESC"
    );
    return ok(res, results);
  } catch (err) { next(err); }
};

exports.createRootCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return fail(res, 400, "Tên danh mục là bắt buộc");
    const [results] = await db.query(
      "INSERT INTO categories (name, description, image, parent_id) VALUES (?, ?, ?, NULL)",
      [name, description, image]
    );
    return created(res, { id: results.insertId }, "Thêm danh mục gốc thành công");
  } catch (err) { next(err); }
};

exports.updateRootCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, status } = req.body;
    const [result] = await db.query(
      "UPDATE categories SET name = ?, description = ?, image = ?, status = ? WHERE id = ? AND parent_id IS NULL",
      [name, description, image, status, id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy danh mục");
    return success(res, "Cập nhật danh mục gốc thành công");
  } catch (err) { next(err); }
};

exports.deleteRootCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra danh mục con
    const [children] = await db.query("SELECT COUNT(*) as count FROM categories WHERE parent_id = ?", [id]);
    if (children[0].count > 0) return fail(res, 400, "Không thể xóa danh mục đang có danh mục con");

    // Kiểm tra sản phẩm đang dùng danh mục này
    const [products] = await db.query("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [id]);
    if (products[0].count > 0) return fail(res, 400, `Không thể xóa danh mục đang có ${products[0].count} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.`);

    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy danh mục");
    return success(res, "Xóa danh mục gốc thành công");
  } catch (err) { next(err); }
};

exports.updateCategoryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) return fail(res, 400, "Trạng thái không hợp lệ");
    const [result] = await db.query("UPDATE categories SET status = ? WHERE id = ? AND parent_id IS NULL", [status, id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy danh mục");
    return success(res, "Cập nhật trạng thái danh mục thành công");
  } catch (err) { next(err); }
};