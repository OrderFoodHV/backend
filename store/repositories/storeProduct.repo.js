const db = require("../../config/db");

exports.getProducts = async (sql, params) => {
  const [data] = await db.query(sql, params);
  return data;
};

exports.insertProduct = async (params) => {
  const [result] = await db.query(
    "INSERT INTO products (store_id, name, category_id, image, price, description) VALUES (?, ?, ?, ?, ?, ?)",
    params
  );
  return result;
};

exports.updateProduct = async (params) => {
  const [result] = await db.query(
    "UPDATE products SET name = IFNULL(?, name), category_id = IFNULL(?, category_id), image = IFNULL(?, image), price = IFNULL(?, price), description = IFNULL(?, description) WHERE id = ? AND store_id = ?",
    params
  );
  return result;
};

exports.deleteProduct = async (productId, storeId) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ? AND store_id = ?", [productId, storeId]);
  return result;
};

exports.getProductAvailability = async (productId, storeId) => {
  const [products] = await db.query("SELECT available FROM products WHERE id = ? AND store_id = ?", [productId, storeId]);
  return products.length > 0 ? products[0].available : null;
};

exports.updateProductAvailability = async (productId, status) => {
  await db.query("UPDATE products SET available = ? WHERE id = ?", [status, productId]);
};

exports.bulkUpdateAvailability = async (status, productIds, storeId) => {
  const [result] = await db.query(
    "UPDATE products SET available = ? WHERE id IN (?) AND store_id = ?",
    [status, productIds, storeId]
  );
  return result;
};
