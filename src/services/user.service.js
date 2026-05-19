const userRepo = require("../repositories/user.repository");

exports.getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    const error = new Error("Người dùng không tồn tại!");
    error.statusCode = 404;
    throw error;
  }
  // Xóa mật khẩu trước khi trả về cho an toàn
  delete user.password;
  delete user.refresh_token;
  return user;
};

exports.updateProfile = async (userId, data) => {
  // Chỉ cho phép đổi tên và số điện thoại ở đây thôi
  const { name, phone } = data;
  const updateData = {};

  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;

  if (Object.keys(updateData).length === 0) {
    const error = new Error("Không có thông tin nào để cập nhật!");
    error.statusCode = 400;
    throw error;
  }

  await userRepo.update(userId, updateData);
  return "Cập nhật hồ sơ thành công!";
};
exports.deleteAccount = async (userId) => {
  const affectedRows = await userRepo.deleteUserById(userId);
  if (affectedRows === 0) {
    throw new Error("Không tìm thấy tài khoản để xóa sếp ơi!");
  }
  return "Đã xóa tài khoản vĩnh viễn khỏi cơ sở dữ liệu!";
};
