const db = require("../../config/db");
const { fail } = require("../../utils/response");

/**
 * Middleware: Kiểm tra user hiện tại có sở hữu store nào không
 * Gắn req.stores = danh sách stores của user
 */
exports.verifyStoreOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [stores] = await db.query(
      "SELECT * FROM stores WHERE owner_id = ? AND status = 'active'",
      [userId]
    );
    if (stores.length === 0) {
      return fail(res, 403, "Bạn không sở hữu cửa hàng nào hoặc cửa hàng chưa được kích hoạt");
    }
    req.stores = stores;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: Kiểm tra user có quyền truy cập store cụ thể (theo :storeId param)
 * Phải đặt SAU verifyToken
 * Gắn req.store = store object
 */
exports.verifyStoreAccess = async (req, res, next) => {
  try {
    console.log("verifyStoreAccess CALLED! URL:", req.originalUrl, "StoreId:", req.params.storeId);
    const userId = req.user.id;
    const storeId = req.params.storeId;

    if (!storeId) {
      return fail(res, 400, "Thiếu storeId");
    }

    const [stores] = await db.query(
      "SELECT * FROM stores WHERE id = ? AND owner_id = ?",
      [storeId, userId]
    );

    if (stores.length === 0) {
      return fail(res, 403, "Bạn không có quyền truy cập cửa hàng này");
    }

    req.store = stores[0];
    next();
  } catch (err) {
    next(err);
  }
};
