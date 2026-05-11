const paymentRepo = require("../repositories/payment.repository");
const orderRepo = require("../repositories/order.repository");

exports.processPayment = async (orderId, userId, amount, method) => {
  // 1. Kiểm tra đơn hàng có đúng của ông này không
  const orders = await orderRepo.findOrdersByUser(userId);
  const order = orders.find((o) => o.id == orderId);

  if (!order) {
    const error = new Error("Không tìm thấy đơn hàng để thanh toán!");
    error.statusCode = 404;
    throw error;
  }

  // 2. Ghi nhận lịch sử thanh toán
  const paymentId = await paymentRepo.createPayment({
    order_id: orderId,
    amount: amount,
    payment_method: method, // 'vnpay', 'momo', 'cash'
    status: "completed",
  });

  // 3. Cập nhật đơn hàng thành "Đã thanh toán"
  await paymentRepo.updateOrderPaymentStatus(orderId, true);

  return { paymentId, message: "Thanh toán thành công!" };
};
