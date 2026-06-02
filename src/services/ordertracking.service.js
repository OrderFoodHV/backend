const orderRepo = require("../repositories/order.repository");
const trackingRepo = require("../repositories/ordertracking.repository");

exports.getUserHistory = async (userId) => {
  return await orderRepo.findOrdersByUser(userId);
};

exports.getOrderDetails = async (orderId, userId) => {
  const orders = await orderRepo.findOrdersByUser(userId);
  const isOwner = orders.find((o) => o.id == orderId);

  if (!isOwner) {
    const error = new Error("Đơn hàng không tồn tại hoặc không phải của bạn!");
    error.statusCode = 403;
    throw error;
  }

  const items = await orderRepo.findOrderItemsDetails(orderId);
  // Móc thêm cả mốc thời gian luân chuyển đơn từ bảng order_tracking ra trả về cho FE vẽ timeline
  const timelines = await trackingRepo.getTrackingLogsByOrderId(orderId);

  // Lấy đánh giá của đơn hàng (nếu có)
  const orderReviewRepo = require("../repositories/order_review.repository");
  const review = await orderReviewRepo.getReviewByOrderId(orderId);

  return {
    order_info: isOwner,
    items: items,
    timelines: timelines,
    review: review || null,
  };
};

exports.changeStatus = async (orderId, newStatus) => {
  const allowedStatuses = [
    "pending",
    "confirmed",
    "delivering",
    "completed",
    "cancelled",
    "disputed",
  ];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error("Trạng thái không hợp lệ!");
  }

  // 1. Cập nhật trạng thái chính ở bảng orders
  await orderRepo.updateOrderStatus(orderId, newStatus);

  try {
    const dbConfig = require("../../config/db");
    const order = await dbConfig("orders").where({ id: orderId }).first();
    if (order) {
      const notiService = require("./notifications.service");
      let notiTitle = "";
      let notiContent = "";
      if (newStatus === "confirmed") {
        notiTitle = "Quán đã nhận đơn! 🍳";
        notiContent = `Đơn hàng #${orderId} đã được nhà hàng xác nhận và đang chế biến món ăn.`;
      } else if (newStatus === "delivering") {
        notiTitle = "Tài xế đang giao hàng! 🏍️";
        notiContent = `Đơn hàng #${orderId} đã được bàn giao cho tài xế và đang trên đường giao tới sếp nhen!`;
      } else if (newStatus === "completed") {
        notiTitle = "Giao hàng thành công! 🎉";
        notiContent = `Đơn hàng #${orderId} đã được giao thành công tới sếp. Chúc sếp ngon miệng!`;
      } else if (newStatus === "cancelled") {
        notiTitle = "Đơn hàng đã bị hủy ❌";
        notiContent = `Đơn hàng #${orderId} của sếp đã bị hủy.`;
      }

      if (notiTitle && notiContent) {
        await notiService.createNotification({
          userId: order.user_id,
          role: "user",
          title: notiTitle,
          content: notiContent,
          type: "order",
        });
      }
    }
  } catch (err) {
    console.error("Error creating status update notification in tracking service:", err);
  }

  if (newStatus === "disputed") {
    const order = await db("orders").where({ id: orderId }).first();
    if (order) {
      const existing = await db("disputes").where({ order_id: orderId }).first();
      if (!existing) {
        const dbConfig = require("../../config/db");
        await dbConfig("disputes").insert({
          order_id: orderId,
          user_id: order.user_id,
          reason: "Khách hàng khiếu nại chưa nhận được thức ăn!",
          status: "pending",
          created_at: new Date()
        });
      }
    }
  }

  // 2. Bắn thêm một dòng lịch sử vào bảng log order_tracking để đồng bộ thiết kế mới
  let noteMsg = `Hệ thống cập nhật trạng thái đơn thành: ${newStatus}`;
  if (newStatus === "disputed") {
    noteMsg = "Khách hàng khiếu nại chưa nhận được đồ ăn!";
  }
  await trackingRepo.insertLog(
    orderId,
    newStatus,
    noteMsg,
  );

  return `Đã chuyển đơn hàng sang trạng thái: ${newStatus}`;
};
