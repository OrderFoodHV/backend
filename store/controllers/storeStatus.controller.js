const db = require("../../config/db");
const { ok, success, fail } = require("../../utils/response");

/**
 * Lấy trạng thái cửa hàng
 * GET /api/store/:storeId/status
 */
exports.getStatus = async (req, res, next) => {
  try {
    const store = req.store; // Đã được gắn bởi verifyStoreAccess
    return ok(res, {
      id: store.id,
      name: store.name,
      is_open: store.is_open,
      status: store.status,
    }, "Lấy trạng thái cửa hàng thành công");
  } catch (err) {
    next(err);
  }
};

/**
 * Bật/tắt trạng thái mở cửa
 * PUT /api/store/:storeId/status/toggle
 */
exports.toggleStatus = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const store = req.store;

    const newStatus = store.is_open ? 0 : 1;
    await db.query("UPDATE stores SET is_open = ? WHERE id = ?", [newStatus, storeId]);

    return success(res, newStatus ? "Cửa hàng đã MỞ CỬA" : "Cửa hàng đã ĐÓNG CỬA");
  } catch (err) {
    next(err);
  }
};
