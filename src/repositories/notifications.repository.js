const db = require("../../config/db");

exports.getNotificationsByUserId = async (userId) => {
  // Chuyển sang dùng cú pháp Query Builder của Knex cho mượt và sạch code
  return await db("notifications")
    .where({ user_id: userId })
    .orderBy("created_at", "desc");
};

exports.markAsReadRepository = async (userId) => {
  return await db("notifications")
    .where({ user_id: userId })
    .update({ is_read: 1 });
};
