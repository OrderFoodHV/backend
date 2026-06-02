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
    .select("users.name as user_name", "shippers.vehicle", "shippers.phone", "users.avatar")
    .where("shippers.user_id", userId)
    .first();

  const order = await db("orders").where({ id: orderId }).first();

  if (global._io) {
    // 1. Báo Real-time cho Khách
    global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
      status: "delivering", // Nhảy luôn sang điểm vòng tròn số 3 (Đang giao)
      driver: {
        name: (shipper ? shipper.user_name : null) || "Tài xế InOrder",
        avatar: (shipper ? shipper.avatar : null) || "https://i.imgur.com/6VBx3io.png",
        vehicle: (shipper ? shipper.vehicle : null) || "Wave Alpha",
        licensePlate: "29H1 - 999.99",
      },
    });

    // 2. 🌟 THÊM MỚI: BÁO CHO MÁY CỦA CHỦ QUÁN BIẾT LÀ ĐÃ CÓ TÀI XẾ CHỐT ĐƠN NÀY RỒI
    if (order) {
      const driverName = (shipper ? shipper.user_name : "") || "Tài xế";
      // Ghi vết thông báo cho Khách hàng
      await notiService.createNotification({
        userId: order.user_id,
        role: "user",
        title: "Tài xế đã nhận đơn! 🏍️",
        content: `Tài xế ${driverName} đang di chuyển đến quán để lấy món ăn cho sếp nhen.`,
        type: "order",
      });

      // Ghi vết thông báo cho Cửa hàng
      await notiService.createNotification({
        storeId: order.store_id,
        role: "store",
        title: "Tài xế đã nhận đơn! 🏍️",
        content: `Tài xế ${driverName} đang đến quán lấy đơn hàng #${orderId}.`,
        type: "order",
      });

      // Ghi vết thông báo cho Tài xế
      await notiService.createNotification({
        userId: userId,
        role: "shipper",
        title: "Nhận đơn thành công! 🏍️",
        content: `Bạn đã nhận đơn hàng #${orderId}. Hãy di chuyển đến quán để lấy món.`,
        type: "order",
      });

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
  const { deliveryPhoto } = req.body;

  // 1. Nghiệp vụ DB cũ của sếp
  const result = await shipperService.completeOrder(userId, orderId, deliveryPhoto);
  const message = result.message;
  const earnAmount = result.shipperEarn || 0;

  // Móc thông tin đơn hàng để lấy ID khách hàng phục vụ lưu thông báo lịch sử
  const order = await db("orders").where({ id: orderId }).first();

  if (global._io) {
    // 2. Kích hoạt nổ pháo hoa bên giao diện Khách hàng thời gian thực
    global._io.to(`order_room_${orderId}`).emit("order_status_updated", {
      status: "completed",
      deliveryPhoto: order ? order.delivery_photo : null
    });

    // 3. 🌟 THÊM MỚI: Lưu lịch sử thông báo hoàn tất cho cả Khách hàng, Tài xế và Cửa hàng
    if (order) {
      // Thông báo cho Khách (User)
      await notiService.createNotification({
        userId: order.user_id,
        role: "user",
        title: "Giao hàng thành công! 🎉",
        content: `Đơn hàng #${orderId} đã được giao thành công tới sếp. Chúc sếp ngon miệng!`,
        type: "order",
      });

      // Thông báo cho Tài xế (1. Thu nhập được cộng)
      await notiService.createNotification({
        userId: userId,
        role: "shipper",
        title: "Thu nhập được cộng! 💰",
        content: `Bạn đã nhận được +${earnAmount.toLocaleString("vi-VN")}đ từ việc hoàn thành đơn hàng #${orderId}.`,
        type: "wallet",
      });

      // Thông báo cho Tài xế (2. Hoàn thành chuyến đi)
      await notiService.createNotification({
        userId: userId,
        role: "shipper",
        title: "Hoàn thành chuyến đi! 🏍️",
        content: `Hoàn thành chuyến đi. Phí ship +${earnAmount.toLocaleString("vi-VN")}đ đã được cộng vào ví của bạn.`,
        type: "wallet",
      });

      // Thông báo cộng doanh thu cho Cửa hàng
      await notiService.createNotification({
        storeId: order.store_id,
        role: "store",
        title: "Đơn hàng hoàn thành! 🎉",
        content: `Đơn hàng #${orderId} đã giao thành công. Doanh thu của bạn đã được cộng +${(result.storeEarn || 0).toLocaleString("vi-VN")}đ.`,
        type: "order",
      });
    }
  }

  res.status(200).json({ success: true, message, earnAmount });
});

// Xử lý Thống kê & Ví thu nhập Tài Xế
exports.getWallet = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const shipper = await db("shippers").where({ user_id: userId }).first();

  if (!shipper) {
    return res
      .status(404)
      .json({ success: false, message: "Không tìm thấy hồ sơ tài xế!" });
  }

  const [feeSettings] = await db.query(
    "SELECT fee_value FROM fee_settings WHERE fee_type = 'shipper_commission' AND status = 'active' LIMIT 1"
  );
  let commissionPct = 20; // Mặc định 20%
  if (feeSettings && feeSettings.length > 0) {
    commissionPct = Number(feeSettings[0].fee_value);
  }
  const shipperFactor = (100 - commissionPct) / 100;

  const completedOrders = await db("orders")
    .select("id", "total_price", "shipping_fee", "created_at")
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
    const shippingFeeVal = Number(order.shipping_fee) || 15000;
    const earnAmount = Math.round(shippingFeeVal * shipperFactor);
    balance += earnAmount;
    if (orderDate >= startOfToday) {
      todayEarn += earnAmount;
      todayOrders += 1;
    }
    history.push({
      id: order.id,
      type: "earn",
      amount: earnAmount,
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

exports.updateLocation = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ success: false, message: "Thiếu vĩ độ hoặc kinh độ!" });
  }

  await db("shippers").where({ user_id: userId }).update({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    updated_at: db.fn.now()
  });

  res.status(200).json({ success: true, message: "Cập nhật vị trí GPS thành công!" });
});

exports.getCurrentOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const shipper = await db("shippers").where({ user_id: userId }).first();
  if (!shipper) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ tài xế!" });
  }

  // Lấy đơn hàng đang active của shipper này: status là 'Quán đã nhận đơn' hoặc 'Đang giao hàng'
  const activeOrder = await db("orders")
    .where({ shipper_id: shipper.id })
    .whereIn("status", ["Quán đã nhận đơn", "Đang giao hàng"])
    .first();

  if (!activeOrder) {
    return res.status(200).json({ success: true, data: null });
  }

  // Lấy thêm thông tin nhà hàng và món ăn
  const store = await db("stores").where({ id: activeOrder.store_id }).first();
  const customer = await db("users").where({ id: activeOrder.user_id }).first();
  const items = await db("order_items")
    .join("products", "products.id", "=", "order_items.product_id")
    .select("products.name", "order_items.quantity", "order_items.price")
    .where({ order_id: activeOrder.id });

  const formattedOrder = {
    orderId: activeOrder.id,
    restaurant: store ? store.name : "Nhà hàng",
    restaurant_address: store ? store.address : "Địa chỉ quán",
    distance: activeOrder.distance,
    shipping_fee: activeOrder.shipping_fee,
    total_price: activeOrder.total_price,
    address: activeOrder.address,
    note: activeOrder.note || "Không có ghi chú",
    customer_name: customer ? customer.name : "Khách hàng",
    customer_phone: customer ? customer.phone : "Chưa cập nhật số điện thoại",
    items: items || [],
    status: activeOrder.status,
  };

  res.status(200).json({ success: true, data: formattedOrder });
});
