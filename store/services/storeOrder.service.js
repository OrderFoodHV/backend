// store/services/storeOrder.service.js
const db = require("../../config/db");

// ========================================================
// ✅ HÀM LẤY DANH SÁCH ĐƠN (GIỮ NGUYÊN VẸN 100% ĐANG CHẠY NGON)
// ========================================================
exports.getOrders = async (storeId, query) => {
  const { status } = query;
  try {
    let sql = `
      SELECT o.*, u.name as customer_name, u.phone as customer_phone 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.store_id = ?
    `;
    const params = [storeId];

    if (status) {
      if (status === "completed") {
        sql += " AND (o.status = 'completed' OR o.status = 'cancelled')";
      } else {
        sql += " AND o.status = ?";
        params.push(status);
      }
    }
    sql += " ORDER BY o.created_at DESC";

    console.log(
      `🔍 [SQL EXECUTE] Chạy lệnh lấy đơn cho Store #${storeId} với trạng thái [${status}]`,
    );

    const [ordersResult] = await db.query(sql, params);
    const cleanOrders = Array.isArray(ordersResult) ? ordersResult : [];

    for (const order of cleanOrders) {
      const [itemsResult] = await db.query(
        `SELECT oi.quantity, oi.price, p.name, p.image
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id],
      );
      order.items = Array.isArray(itemsResult) ? itemsResult : [];
    }

    return {
      status: "success",
      orders: cleanOrders,
    };
  } catch (error) {
    console.error("❌ Lỗi tại storeOrderService.getOrders:", error.message);
    throw error;
  }
};

// ========================================================
// ✅ HÀM CẬP NHẬT TRẠNG THÁI (GIỮ NGUYÊN VẸN 100% ĐANG CHẠY NGON)
// ========================================================
exports.updateOrderStatus = async (storeId, orderId, status, note) => {
  try {
    const affectedRows = await db("orders")
      .where({ id: orderId, store_id: storeId })
      .update({ status: status });

    if (affectedRows === 0) {
      throw new Error("Không tìm thấy đơn hàng hoặc cửa hàng không khớp|404");
    }

    await db("order_tracking").insert({
      order_id: orderId,
      status: status,
      note: note || "Cửa hàng xử lý trạng thái đơn",
      created_at: new Date(),
    });

    if (status === "Quán đã nhận đơn") {
      return "Cửa hàng đã nhận đơn, đang tìm kiếm tài xế tốt nhất!";
    } else if (status === "Đơn đã bị hủy") {
      return "Đã hủy đơn hàng thành công!";
    }
    return "Cập nhật trạng thái đơn hàng thành công!";
  } catch (error) {
    throw error;
  }
};

// ========================================================
// 🌟 THÊM MỚI VÀO CUỐI: Hàm bóc chi tiết đơn cho nút Xem chi tiết
// ========================================================
exports.getOrderDetail = async (storeId, orderId) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as customer_name, u.phone as customer_phone 
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND o.store_id = ?`,
      [orderId, storeId],
    );

    if (!orders || orders.length === 0) {
      throw new Error("Không tìm thấy thông tin chi tiết đơn hàng này|404");
    }

    const mainOrder = orders[0];

    const [items] = await db.query(
      `SELECT oi.quantity, oi.price, p.name, p.image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId],
    );

    mainOrder.items = items || [];
    return mainOrder;
  } catch (error) {
    console.error(
      "❌ Lỗi tại storeOrderService.getOrderDetail:",
      error.message,
    );
    throw error;
  }
};
