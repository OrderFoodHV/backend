const userRepo = require("../repositories/user.repository");

exports.getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    const error = new Error("Người dùng không tồn tại!");
    error.statusCode = 404;
    throw error;
  }
  
  // Lấy thêm trạng thái cửa hàng & tài xế
  const db = require("../../config/db");
  const [stores] = await db.query("SELECT status FROM stores WHERE owner_id = ?", [userId]);
  const [shippers] = await db.query("SELECT status, phone, vehicle FROM shippers WHERE user_id = ?", [userId]);
  
  user.storeStatus = stores.length > 0 ? stores[0].status : null;
  user.shipperStatus = shippers.length > 0 ? shippers[0].status : null;
  user.vehicle = shippers.length > 0 ? shippers[0].vehicle : null;
  user.shipperPhone = shippers.length > 0 ? shippers[0].phone : null;

  // Xóa mật khẩu trước khi trả về cho an toàn
  delete user.password;
  delete user.refresh_token;
  return user;
};

exports.updateProfile = async (userId, data) => {
  // Chỉ cho phép đổi tên, số điện thoại và ảnh đại diện
  const { name, phone, avatar } = data;
  const updateData = {};

  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (avatar !== undefined) updateData.avatar = avatar;

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
