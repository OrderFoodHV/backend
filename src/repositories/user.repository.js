const db = require("../../config/db");

// Móc 1 user bằng email
exports.findByEmail = async (email) => {
  // Thay vì: "SELECT * FROM users WHERE email = ?"
  return await db("users").where({ email }).first();
};

// Nhét user mới vào DB
exports.create = async (userData) => {
  // Trả về một mảng chứa ID vừa tạo
  const [id] = await db("users").insert(userData);
  return id;
};
// Móc User bằng ID
exports.findById = async (id) => {
  return await db("users").where({ id }).first();
};

// Cập nhật thông tin User
exports.update = async (id, updateData) => {
  return await db("users").where({ id }).update(updateData);
};
exports.deleteUserById = async (userId) => {
  const query = "DELETE FROM users WHERE id = ?";
  const [result] = await db.query(query, [userId]);
  return result.affectedRows; // Trả về số lượng bản ghi đã bị xóa thật sự
};
