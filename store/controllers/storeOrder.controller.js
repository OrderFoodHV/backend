// store/controllers/storeOrder.controller.js
const { ok, success, fail, created } = require("../../src/utils/response");
const storeOrderService = require("../services/storeOrder.service");

const handleServiceError = (res, next, err) => {
  if (err.message.includes("|")) {
    const [msg, code] = err.message.split("|");
    return fail(res, parseInt(code), msg);
  }
  next(err);
};

// 🌟 THÊM MỚI: Thuật toán tính tiền ship động theo cự ly chuẩn hãng Grab
const calculateShippingFee = (distanceInKm) => {
  const baseFee = 15000; // 2km đầu tiên mặc định 15k
  if (!distanceInKm || distanceInKm <= 2) return baseFee;
  return baseFee + Math.round((distanceInKm - 2) * 5000); // Các km tiếp theo cộng 5.000đ/km
};

exports.getOrders = async (req, res, next) => {
  try {
    const data = await storeOrderService.getOrders(
      req.params.storeId,
      req.query,
    );
    return ok(res, data);
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const { storeId, orderId } = req.params;
    const data = await storeOrderService.getOrderDetail(storeId, orderId);
    return res
      .status(200)
      .json({ status: "success", success: true, data: data });
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { storeId, orderId } = req.params;
    const { status, note } = req.body;
    const db = require("../../config/db");

    const message = await storeOrderService.updateOrderStatus(
      storeId,
      orderId,
      status,
      note,
    );

    if (global._io) {
      const notiService = require("../../src/services/notifications.service");

      // 🛠️ TRƯỜNG HỢP 1: STORE BẤM NHẬN ĐƠN -> ĐẨY USER SANG VÒNG TRÒN SỐ 2 VÀ TÍNH SHIP THEO KM
      if (status === "Quán đã nhận đơn") {
        // A. Kích hoạt bộ đàm nổ vòng tròn số 2 (preparing) trên app Khách ngay lập tức
        global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
          status: "preparing",
          message:
            "Cửa hàng đã xác nhận đơn và đang chuẩn bị món ăn ngon lành nhen sếp!",
        });

        const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [
          orderId,
        ]);
        const orderDetail = orders && orders.length > 0 ? orders[0] : null;

        if (orderDetail) {
          // Bóc tách khoảng cách km động (nếu trống tự động random từ 1.5 đến 7.5km để test luồng)
          const distance =
            orderDetail.distance || (Math.random() * 6 + 1.5).toFixed(1);
          const dynamicShipFee = calculateShippingFee(distance);

          // Ghi đè cập nhật tiền ship động và cự ly thật vào cơ sở dữ liệu
          await db.query(
            "UPDATE orders SET shipping_fee = ?, distance = ? WHERE id = ?",
            [dynamicShipFee, distance, orderId],
          );

          const [items] = await db.query(
            `SELECT oi.quantity, p.name FROM order_items oi 
             JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
            [orderId],
          );

          // Phát radar thời gian thực bắn sang cho app Shipper hiển thị tiền và số cây
          global._io.to("shipper_global_room").emit("broadcast_new_order", {
            orderId: parseInt(orderId),
            restaurant: "Food App Store",
            distance: parseFloat(distance),
            shipping_fee: dynamicShipFee,
            total_price: Number(orderDetail.total_price),
            address: orderDetail.address,
            note: orderDetail.note || "Không có ghi chú",
            customer_name: orderDetail.customer_name || "Khách hàng",
            customer_phone: orderDetail.customer_phone || "0987654321",
            items: items || [],
          });

          await notiService.createNotification({
            userId: orderDetail.user_id,
            role: "user",
            title: "Quán đã nhận đơn! 🍳",
            content: `Đơn hàng #${orderId} đã được nhà hàng xác nhận và đang bắt đầu chế biến món ăn ngon lành cho sếp.`,
            type: "order",
          });
        }
      }

      // 🛠️ TRƯỜNG HỢP 2: STORE BẤM TỪ CHỐI ĐƠN
      if (status === "Đơn đã bị hủy") {
        global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
          status: "cancelled",
          message: "Rất tiếc, cửa hàng đã từ chối đơn hàng này của bạn!",
        });

        const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [
          orderId,
        ]);
        const orderDetail = orders && orders.length > 0 ? orders[0] : null;
        if (orderDetail) {
          await notiService.createNotification({
            userId: orderDetail.user_id,
            role: "user",
            title: "Đơn hàng bị từ chối ❌",
            content: `Cửa hàng đã từ chối đơn hàng #${orderId} của sếp do quá tải hoặc hết món mất rồi.`,
            type: "order",
          });
        }
      }

      // 🛠️ TRƯỜNG HỢP 3: STORE BẤM GIAO CHO TÀI XẾ -> ĐẨY USER SANG VÒNG TRÒN SỐ 3 (ĐANG GIAO)
      if (status === "Đang giao hàng") {
        global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
          status: "delivering",
          message:
            "Tài xế đã nhận túi đồ ăn và đang phóng hết tốc lực đi giao!",
        });

        const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [
          orderId,
        ]);
        const orderDetail = orders && orders.length > 0 ? orders[0] : null;
        if (orderDetail) {
          await notiService.createNotification({
            userId: orderDetail.user_id,
            role: "user",
            title: "Đơn hàng đang đến! 🏍️",
            content: `Túi đồ ăn đơn #${orderId} đã rời quán, tài xế đang phi như bay tới chỗ sếp nhen.`,
            type: "order",
          });
        }
      }
    }

    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const data = await storeOrderService.getOrderStats(req.params.storeId);
    return ok(res, data);
  } catch (err) {
    next(err);
  }
};
