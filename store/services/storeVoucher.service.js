const repo = require("../repositories/storeVoucher.repo");

exports.getVouchers = async (storeId, query) => {
  const { status } = query;
  let sql = "SELECT * FROM store_vouchers WHERE store_id = ?";
  const params = [storeId];
  if (status) { sql += " AND status = ?"; params.push(status); }
  sql += " ORDER BY created_at DESC";
  
  return await repo.getVouchers(sql, params);
};

exports.createVoucher = async (storeId, data) => {
  const { code, discount_type, discount_value, min_order_amount = null, max_discount = null, quantity = null, start_date = null, end_date } = data;
  
  if (!code || !discount_type || !discount_value || !end_date) {
    throw new Error("Thiếu thông tin bắt buộc (code, discount_type, discount_value, end_date)|400");
  }
  
  try {
    const result = await repo.insertVoucher([
      storeId, code, discount_type, discount_value, 
      min_order_amount, max_discount, quantity, start_date, end_date
    ]);
    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Mã voucher này đã tồn tại trong cửa hàng|409");
    }
    throw err;
  }
};

exports.updateVoucher = async (storeId, voucherId, data) => {
  const { code = null, discount_type = null, discount_value = null, min_order_amount = null, max_discount = null, quantity = null, start_date = null, end_date = null } = data;
  
  const result = await repo.updateVoucher([
    code, discount_type, discount_value, min_order_amount, 
    max_discount, quantity, start_date, end_date, voucherId, storeId
  ]);
  
  if (result.affectedRows === 0) throw new Error("Không tìm thấy voucher|404");
  return "Cập nhật voucher thành công";
};

exports.deleteVoucher = async (storeId, voucherId) => {
  const result = await repo.deleteVoucher(voucherId, storeId);
  if (result.affectedRows === 0) throw new Error("Không tìm thấy voucher|404");
  return "Xóa voucher thành công";
};

exports.toggleVoucher = async (storeId, voucherId) => {
  const status = await repo.getVoucherStatus(voucherId, storeId);
  if (status === null) throw new Error("Không tìm thấy voucher|404");
  
  const newStatus = status === "active" ? "inactive" : "active";
  await repo.updateVoucherStatus(voucherId, newStatus);
  return `Voucher đã ${newStatus === "active" ? "BẬT" : "TẮT"}`;
};
