// src/controllers/shipper.controller.js
const db = require("../../config/db"); // Đường dẫn đến file config db của sếp
const shipperService = require("../services/shipper.service");
const catchAsync = require("../utils/catchAsync");
// 🌟 THÊM MỚI: Import service thông báo lõi để ghi vết lịch sử thông báo
const notiService = require("../services/notifications.service");

exports.registerShipper = catchAsync(async (req, res) => {
  const userId = req.user.id; // Lấy ID từ Token
  const { vehicle, phone } = req.body;
  //1. Kiểm tra xem đã tồn tại shipper chưa (Sửa lỗi Duplicate)
  const existingShipper = await db("shippers")
    .where({ user_id: userId })
    .first();
  if (existingShipper) {
    // Nếu có rồi thì Update
    await db("shippers").where({ user_id: userId }).update({
      vehicle: vehicle,
      phone: phone,
      status: "pending",
    });
  } else {
    // 1. Lưu vào bảng shipper_profiles (hoặc bảng shippers)
    await db("shippers").insert({
      user_id: userId,
      vehicle: vehicle,
      phone: phone,
      status: "pending",
    });
  }
  // 2. Tắt công tắc is_shipper trong bảng users (chờ duyệt)
  await db("users").where({ id: userId }).update({ is_shipper: 0 });

  res.status(201).json({ success: true, message: "Đăng ký thành công!" });
});

exports.viewAvailableOrders = catchAsync(async (req, res) => {
  const orders = await shipperService.getAvailableOrders();
  res.status(200).json({ success: true, data: orders });
});

// 🌟 SỬA HÀM NÀY: TÀI XẾ BẤM NHẬN ĐƠN + LƯU LỊCH SỬ THÔNG BÁO
exports.accept = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const message = await shipperService.acceptOrder(userId, orderId);

  const shipper = await db("shippers")
    .join("users", "users.id", "=", "shippers.user_id")
    .select("users.user_name", "shippers.vehicle", "shippers.phone")
    .where("shippers.user_id", userId)
    .first();

  const order = await db("orders").where({ id: orderId }).first();

  if (global._io) {
    // 1. Báo Real-time cho Khách
    global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
      status: "delivering", // Nhảy luôn sang điểm vòng tròn số 3 (Đang giao)
      driver: {
        name: shipperInfo.name || "Tài xế InOrder",
        avatar: shipperInfo.avatar || "https://i.imgur.com/6VBx3io.png",
        vehicle: shipperInfo.vehicle || "Wave Alpha",
        licensePlate: shipperInfo.license_plate || "29H1 - 999.99",
      },
    });

    // 2. 🌟 THÊM MỚI: BÁO CHO MÁY CỦA CHỦ QUÁN BIẾT LÀ ĐÃ CÓ TÀI XẾ CHỐT ĐƠN NÀY RỒI
    if (order) {
      global._io
        .to(`store_room_${order.store_id}`)
        .emit("order_status_updated", {
          type: "driver_found",
          orderId: orderId,
          message: "Đơn hàng của bạn đã có tài xế nhận!",
        });
    }
  }

  res.status(200).json({ success: true, message });
});

// 🌟 SỬA HÀM NÀY: TÀI XẾ GIAO THÀNH CÔNG + LƯU LỊCH SỬ THÔNG BÁO
exports.complete = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  // 1. Nghiệp vụ DB cũ của sếp
  const message = await shipperService.completeOrder(userId, orderId);

  // Móc thông tin đơn hàng để lấy ID khách hàng phục vụ lưu thông báo lịch sử
  const order = await db("orders").where({ id: orderId }).first();

  if (global._io) {
    // 2. Kích hoạt nổ pháo hoa bên giao diện Khách hàng thời gian thực
    global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
      status: "completed",
    });

    // 3. 🌟 THÊM MỚI: Lưu lịch sử thông báo hoàn tất cho cả Khách hàng và Tài xế
    if (order) {
      // Thông báo cho Khách
      await notiService.createNotification({
        userId: order.user_id,
        role: "user",
        title: "Giao hàng thành công! 🎉",
        content: `Đơn hàng #${orderId} đã được giao tận tay bạn. Chúc bạn ăn ngon miệng!`,
        type: "order_status",
      });

      // Thông báo cộng tiền vào ví cho Tài xế
      await notiService.createNotification({
        userId: userId, // ID tài khoản tài xế
        role: "shipper",
        title: "Thu nhập được cộng! 💰",
        content: `Bạn đã nhận được +15.000đ từ việc hoàn thành đơn hàng #${orderId}.`,
        type: "wallet",
      });
    }
  }

  res.status(200).json({ success: true, message });
});

// Xử lý Thống kê & Ví thu nhập Tài Xế (GIỮ NGUYÊN 100%)
exports.getWallet = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const shipper = await db("shippers").where({ user_id: userId }).first();

  if (!shipper) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy hồ sơ tài xế!" });
  }

  const EARN_PER_ORDER = 15000;
  const completedOrders = await db("orders")
    .select("id", "total_price", "created_at")
    .where({ shipper_id: shipper.id, status: "completed" })
    .orderBy("created_at", "desc");

  let balance = 0;
  let todayEarn = 0;
  let todayOrders = 0;
  const history = [];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  completedOrders.forEach((order) => {
    const orderDate = new Date(order.created_at);
    balance += EARN_PER_ORDER;
    if (orderDate >= startOfToday) {
      todayEarn += EARN_PER_ORDER;
      todayOrders += 1;
    }
    history.push({
      id: order.id,
      type: "earn",
      amount: EARN_PER_ORDER,
      title: `Giao thành công đơn #${order.id}`,
      time: orderDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: orderDate.toLocaleDateString("vi-VN"),
      created_at: order.created_at,
    });
  });

  res.status(200).json({
    success: true,
    data: { balance, todayEarn, todayOrders, history },
  });
});

exports.updateStatus = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.body; // 'idle' or 'offline'

  if (!["idle", "offline"].includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Trạng thái không hợp lệ!" });
  }

  await db("shippers").where({ user_id: userId }).update({ status });
  res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công!" });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { vehicle, phone } = req.body;

  await db("shippers").where({ user_id: userId }).update({
    vehicle,
    phone
  });

  res.status(200).json({ success: true, message: "Cập nhật hồ sơ tài xế thành công!" });
});
