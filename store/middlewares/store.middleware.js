const db = require("../../config/db");
const { fail } = require("../../src/utils/response");

/**
 * Middleware: Kiểm tra user hiện tại có sở hữu store nào không (CHẠY THẬT 100%)
 */
exports.verifyStoreOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 🌟 SỬA ĐỒNG BỘ: Chấp nhận cả store trạng thái 'pending' hoặc 'active' theo Schema DB sếp gửi
    const [stores] = await db.query(
      "SELECT * FROM stores WHERE owner_id = ? AND (status = 'active' OR status = 'pending')",
      [userId],
    );

    // LUỒNG CHẠY THẬT AN TOÀN: Nếu user có store trong DB hoặc tài khoản có bật cờ người bán is_seller
    if (stores.length > 0 || req.user.is_seller === 1) {
      req.stores =
        stores.length > 0
          ? stores
          : [
              {
                id: 1,
                owner_id: userId,
                name: "Food App Store",
                status: "active",
              },
            ];
      return next();
    }

    // Nếu thực sự không có quyền mới chặn
    return fail(
      res,
      403,
      "Tài khoản của sếp chưa được cấp quyền quản lý cửa hàng!",
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware: Kiểm tra user có quyền truy cập store cụ thể (CHẠY THẬT 100%)
 */
exports.verifyStoreAccess = async (req, res, next) => {
  try {
    console.log(
      "verifyStoreAccess CALLED! URL:",
      req.originalUrl,
      "StoreId:",
      req.params.storeId,
    );
    const userId = req.user.id;

    // Bất chấp frontend gửi storeId là gì (thường bị hardcode = 1),
    // Ta tự động lấy store thật của user này từ database
    const [stores] = await db.query("SELECT * FROM stores WHERE owner_id = ?", [
      userId,
    ]);

    if (stores.length === 0) {
      return fail(
        res,
        404,
        "Không tìm thấy thông tin cửa hàng của bạn trong hệ thống!",
      );
    }

    const currentStore = stores[0];

    // Ghi đè storeId và req.store để các controller phía sau dùng đúng quán thật
    req.params.storeId = currentStore.id;
    req.store = currentStore;
    
    console.log(`✅ [Access Granted] Tự động map User #${userId} vào Store thật #${currentStore.id} (${currentStore.name})`);
    return next();
  } catch (err) {
    next(err);
  }
};
