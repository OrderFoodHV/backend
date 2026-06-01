const paymentRepo = require("../repositories/payment.repository");
const orderRepo = require("../repositories/order.repository");
const notiService = require("./notifications.service");

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

exports.verifyMockPayment = async (orderId, userId, amount) => {
  // 1. Kiểm tra đơn hàng
  const order = await orderRepo.findOrderById(orderId);

  if (!order) {
    const error = new Error("Không tìm thấy đơn hàng!");
    error.statusCode = 404;
    throw error;
  }

  // Check if order belongs to the user
  if (order.user_id != userId) {
    const error = new Error("Đơn hàng không thuộc về bạn!");
    error.statusCode = 403;
    throw error;
  }

  if (order.payment_status === "paid") {
    return { message: "Đơn hàng đã được thanh toán trước đó!" };
  }

  // 2. So sánh số tiền (phải nhập đúng số tiền trả ko dc nhập thiếu hay thừa)
  const expectedAmount = Number(order.total_price);
  const paidAmount = Number(amount);

  if (paidAmount !== expectedAmount) {
    const error = new Error(`Số tiền không khớp! Cần thanh toán đúng ${expectedAmount.toLocaleString()} đ`);
    error.statusCode = 400;
    throw error;
  }

  // 3. Ghi nhận lịch sử thanh toán
  const paymentId = await paymentRepo.createPayment({
    order_id: orderId,
    amount: paidAmount,
    payment_method: order.payment_method || 'BankTransfer',
    status: "completed",
  });

  // 4. Cập nhật đơn hàng thành "Đã thanh toán"
  await paymentRepo.updateOrderPaymentStatus(orderId, true);

  // 5. Thêm ordertracking log
  const db = require("../../config/db");
  await db("order_tracking").insert({
    order_id: orderId,
    status: "Đã thanh toán",
    description: "Khách hàng đã thanh toán trực tuyến thành công",
    created_at: new Date()
  }).catch(e => console.error("Error inserting order_tracking:", e));

  // 6. Gửi thông báo đến store và user
  // Thông báo cho user
  await notiService.createNotification({
    userId: order.user_id,
    role: "user",
    title: "Thanh toán thành công 🎉",
    content: `Đơn hàng #${orderId} của bạn đã được thanh toán thành công số tiền ${paidAmount.toLocaleString()} đ.`,
    type: "order"
  });

  // Thông báo cho store
  await notiService.createNotification({
    storeId: order.store_id,
    role: "store",
    title: "Đơn hàng đã thanh toán 💰",
    content: `Đơn hàng #${orderId} đã được khách thanh toán trực tuyến số tiền ${paidAmount.toLocaleString()} đ.`,
    type: "order"
  });

  // 7. Phát Socket event real-time cập nhật trạng thái đơn hàng / thanh toán cho các client đang kết nối
  if (global._io) {
    // Phát tín hiệu phòng đơn hàng
    global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
      orderId,
      status: order.status,
      payment_status: "paid",
      message: `Đơn hàng #${orderId} đã được thanh toán trực tuyến.`
    });
    // Phát tín hiệu tới shop
    global._io.to(`store_room_${order.store_id}`).emit("new_order", {
      orderId,
      message: `Đơn hàng #${orderId} đã thanh toán trực tuyến thành công!`
    });
  }

  return { paymentId, message: "Thanh toán giả lập thành công!" };
};

exports.processVnpayIpn = async (orderId, rspCode, amount) => {
  // 1. Kiểm tra đơn hàng
  const order = await orderRepo.findOrderById(orderId);
  if (!order) {
    return { code: '01', message: 'Order not found' };
  }

  // 2. Kiểm tra số tiền
  if (Number(order.total_price) !== amount) {
    return { code: '04', message: 'Invalid amount' };
  }

  // 3. Kiểm tra trạng thái thanh toán hiện tại
  if (order.payment_status === 'paid') {
    return { code: '02', message: 'Order already confirmed' };
  }

  // 4. Kiểm tra RspCode từ VNPay
  if (rspCode === '00') {
    // Thanh toán thành công
    await paymentRepo.createPayment({
      order_id: orderId,
      amount: amount,
      payment_method: 'vnpay',
      status: "completed",
    });

    await paymentRepo.updateOrderPaymentStatus(orderId, true);

    const db = require("../../config/db");
    await db("order_tracking").insert({
      order_id: orderId,
      status: "Đã thanh toán",
      description: "Khách hàng đã thanh toán trực tuyến qua VNPay",
      created_at: new Date()
    }).catch(e => console.error("Error inserting order_tracking:", e));

    // Thông báo
    await notiService.createNotification({
      userId: order.user_id,
      role: "user",
      title: "Thanh toán VNPay thành công 🎉",
      content: `Đơn hàng #${orderId} của bạn đã được thanh toán thành công qua VNPay.`,
      type: "order"
    });

    await notiService.createNotification({
      storeId: order.store_id,
      role: "store",
      title: "Đơn hàng thanh toán VNPay 💰",
      content: `Đơn hàng #${orderId} đã thanh toán trực tuyến qua VNPay.`,
      type: "order"
    });

    if (global._io) {
      global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
        orderId,
        status: order.status,
        payment_status: "paid",
        message: `Đơn hàng #${orderId} đã được thanh toán qua VNPay.`
      });
      global._io.to(`store_room_${order.store_id}`).emit("new_order", {
        orderId,
        message: `Đơn hàng #${orderId} thanh toán VNPay thành công!`
      });
    }

    return { code: '00', message: 'Confirm Success' };
  } else {
    // Thanh toán thất bại hoặc các lỗi khác
    await paymentRepo.createPayment({
      order_id: orderId,
      amount: amount,
      payment_method: 'vnpay',
      status: "failed",
    });
    return { code: '00', message: 'Payment failed' };
  }
};
