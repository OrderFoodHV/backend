// Đường dẫn: src/repositories/voucher.repository.js
const db = require("../../config/db"); // Sếp nhớ chỉnh lại đường dẫn file db này nếu máy sếp lùi 2 cấp (../../config/db) như anh em mình fix hôm nãy nhé

exports.findVoucherByCode = async (code) => {
  const query = "SELECT * FROM vouchers WHERE code = ? LIMIT 1";
  const [rows] = await db.query(query, [code]);
  return rows[0];
};
