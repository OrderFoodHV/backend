const db = require("../config/db");
const { ok } = require("../utils/response");

// Lấy lịch sử tracking của một đơn hàng
exports.getTracking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at ASC",
      [id]
    );
    return ok(res, result);
  } catch (err) {
    next(err);
  }
};
