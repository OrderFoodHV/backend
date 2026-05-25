// src/repositories/product.repository.js
const db = require("../../config/db");

exports.findAll = async () => {
  // Sửa: Bảng mới dùng cột 'available' BOOLEAN thay vì 'status'
  return await db("products").where("available", true).select("*");
};

exports.findById = async (id) => {
  return await db("products").where({ id }).first();
};
