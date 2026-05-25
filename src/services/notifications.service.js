// src/services/notifications.service.js (Phía user)
const notiRepo = require("../repositories/notifications.repository");
const db = require("../../config/db"); // Import db cấu hình của sếp

exports.getUserNotifications = async (userId) => {
  return await notiRepo.getNotificationsByUserId(userId);
};

exports.readAllNotifications = async (userId) => {
  return await notiRepo.markAsReadRepository(userId);
};

// 🌟 THÊM MỚI: Hàm "Thần thánh" tạo thông báo, lưu DB và bắn Real-time Socket vạn năng
exports.createNotification = async ({
  userId,
  storeId,
  role,
  title,
  content,
  type,
}) => {
  try {
    // 1. Ghi vết vào Database bảng notifications để lưu lịch sử
    const [insertedId] = await db("notifications").insert({
      user_id: userId || null,
      store_id: storeId || null,
      role: role, // 'user', 'store', hoặc 'shipper'
      title,
      content,
      type, // 'new_order', 'order_status', 'wallet'
      is_read: 0,
      created_at: new Date(),
    });

    const notiPayload = {
      id: insertedId,
      title,
      content,
      type,
      created_at: new Date(),
    };

    // 2. ⚡ KÍCH HOẠT SOCKET.IO BẮN ĐÍCH DANH VÀO ĐIỆN THOẠI NGƯỜI NHẬN REAL-TIME
    if (global._io) {
      if (role === "user" && userId) {
        global._io
          .to(`user_room_${userId}`)
          .emit("receive_notification", notiPayload);
      } else if (role === "store" && storeId) {
        global._io
          .to(`store_room_${storeId}`)
          .emit("receive_notification", notiPayload);
      } else if (role === "shipper" && userId) {
        // Phòng riêng của tài xế dựa theo user_id tài khoản của họ
        global._io
          .to(`user_room_${userId}`)
          .emit("receive_notification", notiPayload);
      }
    }

    return insertedId;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo:", error);
  }
};
