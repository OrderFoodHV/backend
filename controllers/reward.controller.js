const db = require("../config/db");
const { ok, success, fail } = require("../utils/response");

exports.getUserPoints = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [data] = await db.query("SELECT * FROM rewards WHERE user_id = ?", [userId]);
    return ok(res, data[0] || { user_id: userId, points: 0, total_points: 0 });
  } catch (err) { next(err); }
};

exports.getPointHistory = async (req, res, next) => {
  try {
    const [data] = await db.query("SELECT * FROM reward_history WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]);
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.addPoints = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const { user_id, order_id, points } = req.body;
    if (!user_id || !points || points <= 0) return fail(res, 400, "Thiếu thông tin hoặc điểm không hợp lệ");
    await conn.beginTransaction();
    const [data] = await conn.query("SELECT * FROM rewards WHERE user_id = ?", [user_id]);
    if (data.length === 0) {
      await conn.query("INSERT INTO rewards (user_id, points, total_points) VALUES (?, ?, ?)", [user_id, points, points]);
    } else {
      await conn.query("UPDATE rewards SET points = points + ?, total_points = total_points + ? WHERE user_id = ?", [points, points, user_id]);
    }
    await conn.query(
      "INSERT INTO reward_history (user_id, order_id, points, type, description) VALUES (?, ?, ?, 'earn', ?)",
      [user_id, order_id || null, points, `Đơn hàng #${order_id || "N/A"}`]
    );
    await conn.commit();
    return ok(res, { points }, "Cộng điểm thành công");
  } catch (err) { await conn.rollback(); next(err); } finally { conn.release(); }
};

exports.redeemPoints = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const user_id = req.user.id;
    const { points, voucher_code } = req.body;
    if (!points || points <= 0) return fail(res, 400, "Số điểm không hợp lệ");
    await conn.beginTransaction();
    const [data] = await conn.query("SELECT * FROM rewards WHERE user_id = ?", [user_id]);
    if (data.length === 0 || data[0].points < points) {
      await conn.rollback();
      return fail(res, 400, "Điểm không đủ để đổi");
    }
    await conn.query("UPDATE rewards SET points = points - ? WHERE user_id = ?", [points, user_id]);
    await conn.query(
      "INSERT INTO reward_history (user_id, points, type, description) VALUES (?, ?, 'redeem', ?)",
      [user_id, -points, `Đổi voucher: ${voucher_code || "N/A"}`]
    );
    await conn.commit();
    return ok(res, { voucher_code }, "Đổi điểm thành công");
  } catch (err) { await conn.rollback(); next(err); } finally { conn.release(); }
};