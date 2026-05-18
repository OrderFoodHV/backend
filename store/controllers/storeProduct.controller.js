const db = require("../../config/db");
const { ok, created, success, fail } = require("../../utils/response");

exports.getProducts = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const { category_id, search, available } = req.query;
    let sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.store_id = ?";
    const params = [storeId];
    if (category_id) { sql += " AND p.category_id = ?"; params.push(category_id); }
    if (search) { sql += " AND p.name LIKE ?"; params.push(`%${search}%`); }
    if (available !== undefined) { sql += " AND p.available = ?"; params.push(available === "true" ? 1 : 0); }
    sql += " ORDER BY p.name ASC";
    const [data] = await db.query(sql, params);
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const { name, category_id, image, price, description } = req.body;
    if (!name || !price) return fail(res, 400, "Thiếu tên hoặc giá sản phẩm");
    const [result] = await db.query(
      "INSERT INTO products (store_id, name, category_id, image, price, description) VALUES (?, ?, ?, ?, ?, ?)",
      [storeId, name, category_id || null, image || null, price, description || null]
    );
    return created(res, { id: result.insertId }, "Thêm món ăn thành công");
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { storeId, productId } = req.params;
    const { name, category_id, image, price, description } = req.body;
    const [result] = await db.query(
      "UPDATE products SET name = IFNULL(?, name), category_id = IFNULL(?, category_id), image = IFNULL(?, image), price = IFNULL(?, price), description = IFNULL(?, description) WHERE id = ? AND store_id = ?",
      [name, category_id, image, price, description, productId, storeId]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy sản phẩm");
    return success(res, "Cập nhật món ăn thành công");
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { storeId, productId } = req.params;
    const [result] = await db.query("DELETE FROM products WHERE id = ? AND store_id = ?", [productId, storeId]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy sản phẩm");
    return success(res, "Xóa món ăn thành công");
  } catch (err) { next(err); }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const { storeId, productId } = req.params;
    const [products] = await db.query("SELECT available FROM products WHERE id = ? AND store_id = ?", [productId, storeId]);
    if (products.length === 0) return fail(res, 404, "Không tìm thấy sản phẩm");
    const newStatus = products[0].available ? 0 : 1;
    await db.query("UPDATE products SET available = ? WHERE id = ?", [newStatus, productId]);
    return success(res, newStatus ? "Đã MỞ bán món ăn" : "Đã TẮT bán món ăn");
  } catch (err) { next(err); }
};

exports.bulkToggle = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const { product_ids, available } = req.body;
    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) return fail(res, 400, "Thiếu danh sách product_ids");
    if (available === undefined) return fail(res, 400, "Thiếu trạng thái available (true/false)");
    const [result] = await db.query(
      "UPDATE products SET available = ? WHERE id IN (?) AND store_id = ?",
      [available ? 1 : 0, product_ids, storeId]
    );
    return success(res, `Đã cập nhật ${result.affectedRows} sản phẩm`);
  } catch (err) { next(err); }
};
