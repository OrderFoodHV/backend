// src/controllers/shipper.controller.js
const db = require("../../config/db"); // Đường dẫn đến file config db của sếp
const shipperService = require("../services/shipper.service");
const catchAsync = require("../utils/catchAsync");

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
      status: "idle",
    });
  } else {
    // 1. Lưu vào bảng shipper_profiles (hoặc bảng shippers)
    await db("shippers").insert({
      user_id: userId,
      vehicle: vehicle,
      phone: phone,
      status: "idle",
    });
  }
  // 2. Bật công tắc is_shipper trong bảng users
  await db("users").where({ id: userId }).update({ is_shipper: 1 });

  res.status(201).json({ success: true, message: "Đăng ký thành công!" });
});

exports.viewAvailableOrders = catchAsync(async (req, res) => {
  const orders = await shipperService.getAvailableOrders();
  res.status(200).json({ success: true, data: orders });
});

// 🌟 SỬA HÀM NÀY: TÀI XẾ BẤM NHẬN ĐƠN (GIAI ĐOẠN 3)
exports.accept = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  // Chạy nghiệp vụ lưu vào DB cũ của sếp
  const message = await shipperService.acceptOrder(userId, orderId);

  // ⚡ MÓC DỮ LIỆU TÀI XẾ THẬT ĐỂ BẮN CHO USER XEM MẶT MŨI, XE CỘ
  const shipper = await db("shippers")
    .join("users", "users.id", "=", "shippers.user_id")
    .select("users.user_name", "shippers.vehicle", "shippers.phone")
    .where("shippers.user_id", userId)
    .first();

  // Bắn tin nhắn Real-time vào phòng theo dõi của Đơn hàng cho Khách xem UI đổi trạng thái
  if (global._io) {
    global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
      status: "driver_assigned", // Trạng thái: Đã tìm thấy xế
      driver: {
        name: shipper?.user_name || "Tài xế InOrder",
        avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Demo avatar link, sếp có thể thay bằng shipper.avatar nếu có cột trong DB
        vehicle: shipper?.vehicle || "Xe máy",
        licensePlate: "29H1 - 123.45", // Biển số xe mẫu, hoặc lấy từ DB nếu sếp có lưu cột license_plate
      },
    });
  }

  res.status(200).json({ success: true, message });
});

// 🌟 SỬA HÀM NÀY: TÀI XẾ GIAO THÀNH CÔNG (GIAI ĐOẠN 6)
exports.complete = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  // Chạy nghiệp vụ DB cũ của sếp
  const message = await shipperService.completeOrder(userId, orderId);

  // ⚡ BẮN LỆNH HOÀN THÀNH ĐƠN ĐỂ MÁY USER NỔ PHÁO HOA
  if (global._io) {
    global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
      status: "completed", // Trạng thái: Hoàn thành!
    });
  }

  res.status(200).json({ success: true, message });
});

// Xử lý Thống kê & Ví thu nhập Tài Xế (GIỮ NGUYÊN)
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
