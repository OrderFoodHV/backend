const repo = require("../repositories/storeProduct.repo");

exports.getProducts = async (storeId, query) => {
  const { category_id, search, available } = query;
  let sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.store_id = ?";
  const params = [storeId];
  if (category_id) { sql += " AND p.category_id = ?"; params.push(category_id); }
  if (search) { sql += " AND p.name LIKE ?"; params.push(`%${search}%`); }
  if (available !== undefined) { sql += " AND p.available = ?"; params.push(available === "true" ? 1 : 0); }
  sql += " ORDER BY p.name ASC";
  
  return await repo.getProducts(sql, params);
};

exports.createProduct = async (storeId, data) => {
  const { name, category_id = null, image = null, price, description = null } = data;
  if (!name || !price) throw new Error("Thiếu tên hoặc giá sản phẩm|400");
  
  const result = await repo.insertProduct([storeId, name, category_id, image, price, description]);
  return { id: result.insertId };
};

exports.updateProduct = async (storeId, productId, data) => {
  const { name = null, category_id = null, image = null, price = null, description = null } = data;
  const result = await repo.updateProduct([name, category_id, image, price, description, productId, storeId]);
  
  if (result.affectedRows === 0) throw new Error("Không tìm thấy sản phẩm|404");
  return "Cập nhật món ăn thành công";
};

exports.deleteProduct = async (storeId, productId) => {
  const result = await repo.deleteProduct(productId, storeId);
  if (result.affectedRows === 0) throw new Error("Không tìm thấy sản phẩm|404");
  return "Xóa món ăn thành công";
};

exports.toggleAvailability = async (storeId, productId) => {
  const available = await repo.getProductAvailability(productId, storeId);
  if (available === null) throw new Error("Không tìm thấy sản phẩm|404");
  
  const newStatus = available ? 0 : 1;
  await repo.updateProductAvailability(productId, newStatus);
  return newStatus ? "Đã MỞ bán món ăn" : "Đã TẮT bán món ăn";
};

exports.bulkToggle = async (storeId, data) => {
  const { product_ids, available } = data;
  if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
    throw new Error("Thiếu danh sách product_ids|400");
  }
  if (available === undefined) throw new Error("Thiếu trạng thái available (true/false)|400");
  
  const status = available ? 1 : 0;
  const result = await repo.bulkUpdateAvailability(status, product_ids, storeId);
  return `Đã cập nhật ${result.affectedRows} sản phẩm`;
};
