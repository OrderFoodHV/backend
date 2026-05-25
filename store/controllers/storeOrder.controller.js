const { ok, success, fail, created } = require("../../src/utils/response");
const storeOrderService = require("../services/storeOrder.service");

// Helper xử lý lỗi custom từ Service (GIỮ NGUYÊN)
const handleServiceError = (res, next, err) => {
  if (err.message.includes("|")) {
    const [msg, code] = err.message.split("|");
    return fail(res, parseInt(code), msg);
  }
  next(err);
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
    const data = await storeOrderService.getOrderDetail(
      req.params.storeId,
      req.params.orderId,
    );
    return ok(res, data);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

// 🌟 SỬA HÀM NÀY: TÍCH HỢP SOCKET.IO KHI STORE ĐỔI TRẠNG THÁI ĐƠN
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { storeId, orderId } = req.params;
    const { status, note } = req.body;

    // 1. Chạy nghiệp vụ DB cũ của sếp qua Service
    const message = await storeOrderService.updateOrderStatus(
      storeId,
      orderId,
      status,
      note,
    );

    // ========================================================
    // ⚡ BÙA REAL-TIME SOCKET.IO: ĐIỀU PHỐI ĐƠN HÀNG GIỮA CÁC BÊN
    // ========================================================
    if (global._io) {
      // TRƯỜNG HỢP A: Quán bấm "Nhận đơn" (confirmed) -> Giai đoạn 2
      if (status === "confirmed" || status === "preparing") {
        // 1. Bắn tin nhắn vào phòng riêng của đơn: Báo cho Khách biết quán đang nấu
        global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
          status: "preparing",
          message: "Quán đang chuẩn bị món ăn cho bạn nhen!",
        });

        // 2. Phát còi báo động lên phòng chung của hệ thống Shipper để các xế vào giật đơn
        global._io.to("shipper_global_room").emit("broadcast_new_order", {
          orderId: orderId,
          storeId: storeId,
          restaurant: "Cửa hàng InOrder", // Sếp có thể query tên quán thật nhét vào đây
          price: 15000, // Tiền ship
        });
      }

      // TRƯỜNG HỢP B: Quán làm món xong và giao đồ cho Shipper (delivering) -> Giai đoạn 5
      if (status === "delivering") {
        // Bắn vào phòng đơn: Báo cho Khách biết tài xế đã lấy hàng và đang phóng đi
        global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
          status: "delivering",
          message: "Tài xế đã lấy hàng và đang trên đường giao đến bạn!",
        });
      }
    }
    // ========================================================

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
