const db = require("../../config/db");

exports.findVoucherByCode = async (code) => {
  // Chuyển sang Knex thu phục bản ghi đầu tiên thỏa mãn điều kiện
  return await db("vouchers").where({ code }).first();
};
