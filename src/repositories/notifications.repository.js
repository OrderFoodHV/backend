const db = require("../../config/db");

exports.getNotificationsByUserId = async (userId, role) => {
  // Chuyển sang dùng cú pháp Query Builder của Knex cho mượt và sạch code
  let query = db("notifications").where({ user_id: userId });
  if (role) {
    query = query.where({ target_role: role });
  }
  return await query.orderBy("created_at", "desc");
};

exports.markAsReadRepository = async (userId) => {
  return await db("notifications")
    .where({ user_id: userId })
    .update({ is_read: 1 });
};
