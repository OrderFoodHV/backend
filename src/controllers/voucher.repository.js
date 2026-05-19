const db = require("../config/db"); // File cấu hình kết nối MySQL của sếp

exports.findVoucherByCode = async (code) => {
  const query = "SELECT * FROM vouchers WHERE code = ? LIMIT 1";
  const [rows] = await db.query(query, [code]);
  return rows[0];
};
