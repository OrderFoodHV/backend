// src/controllers/order.controller.js
const orderService = require("../services/order.service");
const catchAsync = require("../utils/catchAsync");
// 🌟 THÊM MỚI: Import service thông báo để ghi lịch sử cho User khi đặt đơn thành công
const notiService = require("../services/notifications.service");

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  console.log("🧨 DỮ LIỆU THỰC TẾ BE NHẬN ĐƯỢC LÀ:", req.body);

  const finalData = req.body.data ? req.body.data : req.body;

  let store_id = finalData.store_id;
  if (!store_id && finalData.items && finalData.items.length > 0) {
    store_id = finalData.items[0].store_id;
  }
  const { address, items, total_price, note, shipping_fee, service_fee, distance, voucher_code, store_voucher_code } = finalData;
  const paymentMethod = finalData.payment_method_value || (finalData.payment_method ? (finalData.payment_method.value || finalData.payment_method) : 'COD');

  if (!address) {
    const error = new Error("Vui lòng nhập địa chỉ giao hàng!");
    error.statusCode = 400;
    throw error;
  }

  const { orderId, finalStoreId } = await orderService.checkout(
    userId,
    store_id,
    address,
    items,
    total_price,
    shipping_fee || 0,
    service_fee || 0,
    note || null,
    distance || null,
    voucher_code || null,
    paymentMethod,
    store_voucher_code || null,
  );

  const orderPayloadForStore = {
    order_id: orderId,
    address,
    total_price: total_price || "Đang tính toán",
    status: "pending",
    note: note || null,
    created_at: new Date(),
  };

  // Bắn tín hiệu đích danh vào phòng của Cửa hàng đó
  global._io.to(`store_room_${finalStoreId}`).emit("new_order", {
    success: true,
    message: "🔊 Ting Ting! Có đơn hàng mới tinh nè sếp ơi!",
    data: orderPayloadForStore,
  });
  console.log(
    `🚀 Đã phát tín hiệu nổ đơn thành công đến phòng: store_room_${finalStoreId}`,
  );

  // ========================================================
  // 🌟 THÊM MỚI: Ghi vết thông báo vào trang Lịch sử thông báo của User và Store (Giai đoạn 1)
  // ========================================================
  await notiService.createNotification({
    userId: userId,
    role: "user",
    title: "Đặt hàng thành công! 🛒",
    content: `Đơn hàng #${orderId} của sếp đã được gửi tới cửa hàng. Đang chờ quán xác nhận nhen!`,
    type: "order",
  });

  await notiService.createNotification({
    storeId: finalStoreId,
    role: "store",
    title: "Đơn hàng mới tinh! 🔊",
    content: `🔊 Ting ting! Có đơn hàng #${orderId} mới tinh! Vào chuẩn bị món ngay sếp ơi.`,
    type: "order",
  });
  // ========================================================

  let paymentUrl = null;
  if (paymentMethod === 'vnpay') {
    const vnpayUtil = require("../utils/vnpay");
    paymentUrl = vnpayUtil.buildPaymentUrl(req, {
      orderId: orderId,
      amount: total_price
    });
  }

  res.status(201).json({
    status: "success",
    message: "Đặt hàng thành công!",
    success: true,
    result: {
      order_id: orderId,
      address,
      total_price,
      order_status: "pending",
      payment_url: paymentUrl
    },
  });
});

exports.getHistory = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orders = await orderService.getOrders(userId);
  res.status(200).json({ status: "success", data: orders });
});

exports.reorder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  const newOrder = await orderService.reorder(userId, orderId);

<<<<<<< HEAD
  res.status(200).json({
    status: "success",
    success: true,
    data: newOrder,
=======
  // Ghi vết thông báo đặt đơn thành công
  await notiService.createNotification({
    userId: userId,
    role: "user",
    title: "Đặt lại đơn hàng thành công! 🛒",
    content: `Đơn hàng mới #${newOrder.orderId} (sao chép từ đơn #${orderId}) đã được gửi tới cửa hàng.`,
    type: "order",
  });

  // Bắn socket cho Store
  const orderPayloadForStore = {
    order_id: newOrder.orderId,
    address: newOrder.address,
    total_price: newOrder.totalPrice,
    status: "pending",
    note: newOrder.note || null,
    created_at: new Date(),
  };
  global._io.to(`store_room_${newOrder.storeId}`).emit("new_order", {
    success: true,
    message: "🔊 Ting Ting! Có đơn đặt lại mới tinh nè sếp ơi!",
    data: orderPayloadForStore,
  });

  res.status(201).json({
    status: "success",
    message: "Đặt lại đơn hàng thành công!",
    success: true,
    result: {
      order_id: newOrder.orderId,
      address: newOrder.address,
      total_price: newOrder.totalPrice,
      order_status: "pending",
    },
>>>>>>> fa6c83e4b3846892ac5bb7be251187d5fdf26eca
  });
});

const orderReviewRepo = require("../repositories/order_review.repository");
const orderRepo = require("../repositories/order.repository");

exports.submitOrderReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  const { store_rating, store_comment, shipper_rating, shipper_comment, image_url } = req.body;

  if (!store_rating) {
    const error = new Error("Vui lòng đánh giá cửa hàng!");
    error.statusCode = 400;
    throw error;
  }

<<<<<<< HEAD
  console.log(`📝 Review request - orderId: ${orderId}, userId: ${userId}`);

  // Check if order exists and belongs to user
  const order = await orderRepo.findOrderById(orderId);
  console.log(`📝 Order found:`, order ? `user_id=${order.user_id}, store_id=${order.store_id}` : 'NOT FOUND');
  
  if (!order) {
    const error = new Error(`Đơn hàng #${orderId} không tồn tại!`);
    error.statusCode = 404;
    throw error;
  }
  
  if (String(order.user_id) !== String(userId)) {
    console.log(`⚠️ User mismatch: order.user_id=${order.user_id} (${typeof order.user_id}), userId=${userId} (${typeof userId})`);
    const error = new Error(`Đơn hàng không thuộc về bạn! (order user: ${order.user_id}, your id: ${userId})`);
    error.statusCode = 403;
    throw error;
  }
=======
  // Check if order exists and belongs to user
  const order = await orderRepo.findOrderById(orderId);
  if (!order || order.user_id !== userId) {
    const error = new Error("Đơn hàng không hợp lệ!");
    error.statusCode = 404;
    throw error;
  }
>>>>>>> fa6c83e4b3846892ac5bb7be251187d5fdf26eca

  // Check if already reviewed
  const existingReview = await orderReviewRepo.getReviewByOrderId(orderId);
  if (existingReview) {
    const error = new Error("Đơn hàng này đã được đánh giá!");
    error.statusCode = 400;
    throw error;
  }

  // Save review
  const reviewData = {
    order_id: orderId,
    user_id: userId,
    store_id: order.store_id,
    shipper_id: order.shipper_id || null,
    store_rating: store_rating,
    store_comment: store_comment || null,
    shipper_rating: shipper_rating || null,
    shipper_comment: shipper_comment || null,
    image_url: image_url || null
  };

  await orderReviewRepo.createReview(reviewData);

  // Update averages
  await orderReviewRepo.updateStoreRating(order.store_id);
  if (order.shipper_id) {
    await orderReviewRepo.updateShipperRating(order.shipper_id);
  }

  // Notify Store
  await notiService.createNotification({
    storeId: order.store_id,
    role: "store",
    title: "Đánh giá mới từ khách hàng ⭐",
    content: `Đơn hàng #${orderId} vừa nhận được đánh giá ${store_rating} sao từ khách hàng.`,
    type: "review"
  });

  // Notify Shipper
  if (order.shipper_id && shipper_rating) {
    await notiService.createNotification({
      shipperId: order.shipper_id,
      role: "shipper",
      title: "Đánh giá mới từ khách hàng ⭐",
      content: `Chuyến xe #${orderId} vừa nhận được đánh giá ${shipper_rating} sao từ khách hàng.`,
      type: "review"
    });
  }

  res.status(201).json({
    status: "success",
    message: "Gửi đánh giá thành công!",
  });
});
