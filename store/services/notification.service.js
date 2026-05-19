const repo = require("../repositories/notification.repo");

exports.getLatestOrderId = async (storeId) => {
  return await repo.getLatestOrderId(storeId);
};

exports.pollNewOrders = async (storeId, lastOrderId) => {
  const newOrders = await repo.getNewOrders(storeId, lastOrderId);
  
  if (newOrders.length === 0) return { orders: [], nextLastOrderId: lastOrderId };

  const nextLastOrderId = newOrders[newOrders.length - 1].id;
  
  // Lấy chi tiết items cho từng order
  for (const order of newOrders) {
    order.items = await repo.getOrderItems(order.id);
  }

  return { orders: newOrders, nextLastOrderId };
};

exports.getRecentOrders = async (storeId, minutesQuery) => {
  const minutes = parseInt(minutesQuery) || 30;
  return await repo.getRecentOrders(storeId, minutes);
};
