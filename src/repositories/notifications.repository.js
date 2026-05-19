const db = require("../../config/db");

exports.getNotificationsByUserId = async (userId) => {
  const query =
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
  // SỬA THÀNH CÚ PHÁP KNEX CHUẨN:
  const [rows] = await db.raw("SELECT * FROM notifications WHERE ...");
  return rows;
};

exports.markAsReadRepository = async (userId) => {
  const query = "UPDATE notifications SET is_read = 1 WHERE user_id = ?";
  const [result] = await db.query(query, [userId]);
  return result.affectedRows;
};
