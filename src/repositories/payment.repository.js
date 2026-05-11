const db = require("../../config/db");

// 1. Tạo bản ghi thanh toán (Khớp 100% với bảng payments)
exports.createPayment = async (paymentData) => {
  const [id] = await db("payments").insert({
    order_id: paymentData.order_id,
    method: paymentData.payment_method, // 'cash', 'vnpay'...
    status: paymentData.status, // 'completed'
    // paid_at: db.fn.now() // (Tùy chọn) Thêm giờ thanh toán luôn
  });
  return id;
};

// 2. Cập nhật trạng thái thanh toán (Khớp 100% với bảng orders)
exports.updateOrderPaymentStatus = async (orderId, isPaid) => {
  // Biến true/false thành chữ 'paid'/'unpaid' cho đúng chuẩn ENUM
  const paymentStatusEnum = isPaid ? "paid" : "unpaid";

  return await db("orders")
    .where({ id: orderId })
    .update({ payment_status: paymentStatusEnum });
};
