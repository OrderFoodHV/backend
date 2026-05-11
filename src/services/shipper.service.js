const shipperRepo = require("../repositories/shipper.repository");

// Hàm Helper dùng chung để check quyền Shipper
const getShipperInfo = async (userId) => {
  const shipper = await shipperRepo.findShipperByUserId(userId);
  if (!shipper) {
    const error = new Error("Tài khoản của bạn không phải là Shipper!");
    error.statusCode = 403;
    throw error;
  }
  return shipper;
};

exports.getAvailableOrders = async (userId) => {
  await getShipperInfo(userId); // Check xem có đúng là shipper không
  return await shipperRepo.getAvailableOrders();
};

exports.acceptOrder = async (userId, orderId) => {
  const shipper = await getShipperInfo(userId);

  // Chạy Transaction
  await shipperRepo.acceptOrderTransaction(shipper.id, orderId);
  return "Nhận đơn hàng thành công! Vui lòng tới quán lấy đồ.";
};

exports.completeOrder = async (userId, orderId) => {
  const shipper = await getShipperInfo(userId);

  await shipperRepo.completeOrderTransaction(shipper.id, orderId);
  return "Giao hàng thành công! Tuyệt vời.";
};
