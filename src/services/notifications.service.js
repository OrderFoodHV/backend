// src/services/notifications.service.js (Phía user)
const notiRepo = require("../repositories/notifications.repository");
const db = require("../../config/db"); // Import db cấu hình của sếp

exports.getUserNotifications = async (userId, role) => {
  return await notiRepo.getNotificationsByUserId(userId, role);
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
    let insertedId = null;

    // If storeId is provided but no userId, resolve the store owner's user_id to save in database
    if (storeId && !userId) {
      const store = await db("stores").where({ id: storeId }).select("owner_id").first();
      if (store) {
        userId = store.owner_id;
      }
    }

    // Only insert to notifications table if userId is present (as it references users table)
    if (userId) {
      const [id] = await db("notifications").insert({
        user_id: userId,
        title,
        message: content, // Map content to DB column name 'message'
        type: ['order', 'promotion', 'reward', 'general', 'review'].includes(type) ? type : 'general',
        target_role: role || 'user',
        is_read: 0,
        created_at: new Date(),
      });
      insertedId = id;
    }

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
