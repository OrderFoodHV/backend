const db = require("../../config/db");

exports.getVouchers = async (sql, params) => {
  const [data] = await db.query(sql, params);
  return data;
};

exports.insertVoucher = async (params) => {
  const [result] = await db.query(
    `INSERT INTO store_vouchers (store_id, code, discount_type, discount_value, min_order_amount, max_discount, quantity, start_date, end_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params
  );
  return result;
};

exports.updateVoucher = async (params) => {
  const [result] = await db.query(
    `UPDATE store_vouchers SET code = IFNULL(?, code), discount_type = IFNULL(?, discount_type), discount_value = IFNULL(?, discount_value),
     min_order_amount = IFNULL(?, min_order_amount), max_discount = IFNULL(?, max_discount), quantity = IFNULL(?, quantity),
     start_date = IFNULL(?, start_date), end_date = IFNULL(?, end_date) WHERE id = ? AND store_id = ?`,
    params
  );
  return result;
};

exports.deleteVoucher = async (voucherId, storeId) => {
  const [result] = await db.query("DELETE FROM store_vouchers WHERE id = ? AND store_id = ?", [voucherId, storeId]);
  return result;
};

exports.getVoucherStatus = async (voucherId, storeId) => {
  const [vouchers] = await db.query("SELECT status FROM store_vouchers WHERE id = ? AND store_id = ?", [voucherId, storeId]);
  return vouchers.length > 0 ? vouchers[0].status : null;
};

exports.updateVoucherStatus = async (voucherId, status) => {
  await db.query("UPDATE store_vouchers SET status = ? WHERE id = ?", [status, voucherId]);
};
