const repo = require("../repositories/storeOrder.repo");

exports.getOrders = async (storeId, query) => {
  const { status, page = 1, limit = 20, from, to } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = "WHERE o.store_id = ?";
  const params = [storeId];
  
  if (status) { where += " AND o.status = ?"; params.push(status); }
  if (from && to) { where += " AND o.created_at BETWEEN ? AND ?"; params.push(from, to); }

  const total = await repo.countOrders(where, params);
  const orders = await repo.getOrders(where, params, parseInt(limit), offset);

  return {
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  };
};

exports.getOrderDetail = async (storeId, orderId) => {
  const order = await repo.getOrderByIdAndStore(orderId, storeId);
  if (!order) throw new Error("Không tìm thấy đơn hàng|404");

  const items = await repo.getOrderItems(orderId);
  const tracking = await repo.getOrderTracking(orderId);

  return { ...order, items, tracking };
};

exports.updateOrderStatus = async (storeId, orderId, status, note) => {
  const validStatus = ["confirmed", "delivering", "completed", "cancelled"];
  if (!validStatus.includes(status)) throw new Error("Trạng thái không hợp lệ|400");

  const order = await repo.getOrderByIdAndStore(orderId, storeId);
  if (!order) throw new Error("Không tìm thấy đơn hàng|404");

  const transitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["delivering", "cancelled"],
    delivering: ["completed"],
    completed: [],
    cancelled: []
  };

  if (!transitions[order.status]?.includes(status)) {
    throw new Error(`Không thể chuyển từ "${order.status}" sang "${status}"|400`);
  }

  await repo.updateStatus(orderId, status);
  await repo.addTracking(orderId, status, note || null);

  const msgs = {
    confirmed: "đã được xác nhận",
    delivering: "đang được giao",
    completed: "đã hoàn thành",
    cancelled: "đã bị hủy bởi cửa hàng"
  };
  await repo.addNotification(order.user_id, `Đơn hàng #${orderId}`, `Đơn hàng ${msgs[status]}`);

  return `Đã cập nhật trạng thái thành: ${status}`;
};

exports.getOrderStats = async (storeId) => {
  const stats = await repo.getStats(storeId);
  const result = { pending: 0, confirmed: 0, delivering: 0, completed: 0, cancelled: 0 };
  stats.forEach((s) => { result[s.status] = s.count; });
  result.total = Object.values(result).reduce((a, b) => a + b, 0);
  return result;
};
