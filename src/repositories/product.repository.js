const db = require("../../config/db");

// Lấy toàn bộ danh sách món ăn
exports.findAll = async () => {
  return await db("products").select("*");
};

// Lấy chi tiết 1 món ăn bằng ID
exports.findById = async (id) => {
  return await db("products").where({ id }).first();
};
