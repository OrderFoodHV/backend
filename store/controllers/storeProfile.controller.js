// store/controllers/storeProfile.controller.js
const db = require("../../config/db"); // Đảm bảo đường dẫn db đúng
const { geocodeAddress } = require("../../src/utils/distanceHelper");

exports.registerStore = async (req, res) => {
  try {
    const userId = req.user.id;
    let { store_name, address, phone, latitude, longitude } = req.body;

    // Tự động giải mã địa chỉ thành tọa độ nếu Frontend không truyền
    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
      const coords = await geocodeAddress(address);
      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
    }

    // 1. Kiểm tra xem user này đã có quán chưa (Tránh lỗi Duplicate 500)
    const existingStore = await db("stores")
      .where({ owner_id: userId })
      .first();

    if (existingStore) {
      // Đã có rồi thì update lại tên và địa chỉ, đồng thời chuyển trạng thái về pending
      await db("stores").where({ owner_id: userId }).update({
        name: store_name,
        address: address,
        phone: phone,
        latitude: latitude !== undefined ? latitude : null,
        longitude: longitude !== undefined ? longitude : null,
        status: "pending",
      });
    } else {
      // Chưa có thì tạo mới ở trạng thái pending
      await db("stores").insert({
        owner_id: userId,
        name: store_name,
        address: address,
        phone: phone,
        latitude: latitude !== undefined ? latitude : null,
        longitude: longitude !== undefined ? longitude : null,
        status: "pending",
      });
    }

    res.status(201).json({
      success: true,
      message: "Gửi yêu cầu đăng ký mở quán thành công! Vui lòng chờ Admin phê duyệt.",
      storeStatus: "pending",
    });
  } catch (error) {
    console.error("Lỗi đăng ký quán:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};

exports.updateStoreProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let { name, address, phone, latitude, longitude } = req.body;

    // Tự động giải mã địa chỉ thành tọa độ nếu Frontend không truyền
    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
      const coords = await geocodeAddress(address);
      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
    }

    // Cập nhật bảng stores
    await db("stores")
      .where({ owner_id: userId })
      .update({
        name: name,
        address: address,
        phone: phone,
        latitude: latitude !== undefined ? latitude : undefined,
        longitude: longitude !== undefined ? longitude : undefined,
      });

    // Cập nhật phone bảng users
    await db("users")
      .where({ id: userId })
      .update({
        phone: phone,
      });

    const updatedStore = await db("stores").where({ owner_id: userId }).first();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin cửa hàng thành công!",
      storeId: updatedStore.id,
      storeName: updatedStore.name,
      storeAddress: updatedStore.address,
      phone: updatedStore.phone,
    });
  } catch (error) {
    console.error("Lỗi cập nhật quán:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const { storeId } = req.params;

    // 1. Lấy tỷ lệ hoa hồng của quán
    const [feeSettings] = await db.query(
      "SELECT fee_value FROM fee_settings WHERE fee_type = 'shop_commission' AND status = 'active' LIMIT 1"
    );
    let commissionPct = 20; // mặc định 20%
    if (feeSettings && feeSettings.length > 0) {
      commissionPct = Number(feeSettings[0].fee_value);
    }
    const commissionRate = commissionPct / 100;

    // 2. Tính tổng tiền món ăn (subtotal) của các đơn hàng completed
    const [subtotalRows] = await db.query(
      `SELECT SUM(oi.quantity * oi.price) as subtotal
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.store_id = ? AND o.status = 'completed'`,
      [storeId]
    );
    const subtotal = Number(subtotalRows?.[0]?.subtotal || 0);
    const netRevenue = subtotal - (subtotal * commissionRate);

    // 3. Đếm số lượng các loại đơn
    const [ordersCount] = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as success,
        COUNT(CASE WHEN status = 'cancelled' OR status = 'Đơn đã bị hủy' THEN 1 END) as cancelled
       FROM orders
       WHERE store_id = ?`,
      [storeId]
    );

    const stats = ordersCount?.[0] || { total: 0, success: 0, cancelled: 0 };

    res.status(200).json({
      success: true,
      data: {
        revenue: Math.round(netRevenue),
        total: stats.total || 0,
        success: stats.success || 0,
        cancelled: stats.cancelled || 0,
      }
    });
  } catch (error) {
    console.error("Lỗi lấy dashboard summary:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};
