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
const calculateShippingFee = async (distanceInKm) => {
  const db = require("../../config/db");
  const [feeSettings] = await db.query(
    "SELECT * FROM fee_settings WHERE fee_type = 'shipping_fee' AND status = 'active' LIMIT 1"
  );
  
  let baseFee = 15000;
  let baseDistance = 2;
  let extraFeePerKm = 5000;

  if (feeSettings && feeSettings.length > 0) {
    const setting = feeSettings[0];
    baseFee = Number(setting.fee_value);
    baseDistance = Number(setting.condition_value || 0);
    extraFeePerKm = Number(setting.extra_value || 0);
  }

  if (!distanceInKm || distanceInKm <= baseDistance) {
    return baseFee;
  }
  return baseFee + Math.round((distanceInKm - baseDistance) * extraFeePerKm);
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

        const [orders] = await db.query(
          `SELECT o.*, u.name AS customer_name, u.phone AS customer_phone 
           FROM orders o 
           JOIN users u ON o.user_id = u.id 
           WHERE o.id = ?`,
          [orderId]
        );
        const orderDetail = orders && orders.length > 0 ? orders[0] : null;

        if (orderDetail) {
          let distance = orderDetail.distance ? Number(orderDetail.distance) : null; // Sử dụng khoảng cách đã tính lúc checkout nếu có

          // Lấy thông tin & tọa độ của Cửa hàng (luôn lấy để phục vụ bán kính định vị shipper)
          const [storeRows] = await db.query(
            "SELECT latitude, longitude, address FROM stores WHERE id = ?",
            [storeId]
          );
          const storeLoc = storeRows && storeRows.length > 0 ? storeRows[0] : null;
          let storeLat = storeLoc?.latitude;
          let storeLng = storeLoc?.longitude;

          const { getOSRMDistance, geocodeAddress, calculateHaversineDistance } = require("../../src/utils/distanceHelper");

          // 1. Phân giải tọa độ Quán nếu chưa có
          if (!storeLat || !storeLng) {
            const storeAddress = storeLoc?.address || (req.store && req.store.address);
            if (storeAddress) {
              console.log(`🔍 [On-the-fly Geocode Store] Cửa hàng chưa có tọa độ, tiến hành tìm cho: ${storeAddress}`);
              const coords = await geocodeAddress(storeAddress);
              if (coords) {
                storeLat = coords.latitude;
                storeLng = coords.longitude;
                // Lưu lại DB để lần sau dùng luôn
                await db.query("UPDATE stores SET latitude = ?, longitude = ? WHERE id = ?", [storeLat, storeLng, storeId]);
              }
            }
          }

          if (!distance) {
            // Lấy thông tin & tọa độ của Địa chỉ khách hàng
            const [addressRows] = await db.query(
              "SELECT id, latitude, longitude, address FROM user_address WHERE user_id = ? AND address = ?",
              [orderDetail.user_id, orderDetail.address]
            );
            const addressLoc = addressRows && addressRows.length > 0 ? addressRows[0] : null;

            // 2. Phân giải tọa độ Khách hàng (lấy từ DB hoặc Geocode tức thời)
            let destLat = addressLoc?.latitude;
            let destLng = addressLoc?.longitude;
            if (!destLat || !destLng) {
              const destAddress = orderDetail.address;
              if (destAddress) {
                console.log(`🔍 [On-the-fly Geocode Customer] Địa chỉ khách chưa có tọa độ, tiến hành tìm cho: ${destAddress}`);
                const coords = await geocodeAddress(destAddress);
                if (coords) {
                  destLat = coords.latitude;
                  destLng = coords.longitude;
                  // Lưu lại DB để lần sau dùng luôn nếu tìm được bản ghi tương ứng
                  if (addressLoc && addressLoc.id) {
                    await db.query("UPDATE user_address SET latitude = ?, longitude = ? WHERE id = ?", [destLat, destLng, addressLoc.id]);
                  }
                }
              }
            }

            // 3. Tính khoảng cách qua OSRM (hoặc Haversine bên trong helper)
            if (storeLat && storeLng && destLat && destLng) {
              distance = await getOSRMDistance(storeLat, storeLng, destLat, destLng);
            }

            // Nếu thiếu tọa độ hoặc cả 2 giải pháp tính khoảng cách đều thất bại, tự động fallback random
            if (!distance) {
              distance = parseFloat((Math.random() * 6 + 1.5).toFixed(1));
              console.log(`⚠️ Không có đủ tọa độ định vị, chuyển sang lấy cự ly ngẫu nhiên: ${distance} km`);
            }
          }

          const dynamicShipFee = await calculateShippingFee(distance);

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

          // Debug: xác nhận req.store chứa đúng dữ liệu khi emit
          console.log("🏪 [DEBUG] req.store khi emit cho shipper:", JSON.stringify(req.store));

          // 🌟 THUẬT TOÁN ĐỊNH VỊ PHÂN PHỐI ĐƠN HÀNG THEO BÁN KÍNH GPS (5km)
          const [onlineShippers] = await db.query(
            "SELECT user_id, latitude, longitude FROM shippers WHERE status = 'idle' AND latitude IS NOT NULL AND longitude IS NOT NULL"
          );

          let targetedShippersCount = 0;
          const maxRadiusKm = 5.0; // Bán kính nổ đơn cho tài xế gần quán là 5km

          if (onlineShippers && onlineShippers.length > 0 && storeLat && storeLng) {
            onlineShippers.forEach((shipper) => {
              const distToStore = calculateHaversineDistance(
                storeLat,
                storeLng,
                shipper.latitude,
                shipper.longitude
              );
              if (distToStore !== null && distToStore <= maxRadiusKm) {
                console.log(`🎯 [Dispatcher] Nổ đơn #${orderId} tới Shipper User #${shipper.user_id} (Khoảng cách tới quán: ${distToStore} km)`);
                global._io.to(`user_room_${shipper.user_id}`).emit("broadcast_new_order", {
                  orderId: parseInt(orderId),
                  restaurant: req.store.name,
                  restaurant_address: req.store.address || "Chưa cập nhật địa chỉ",
                  distance: parseFloat(distance),
                  shipping_fee: dynamicShipFee,
                  total_price: Number(orderDetail.total_price),
                  address: orderDetail.address,
                  note: orderDetail.note || "Không có ghi chú",
                  customer_name: orderDetail.customer_name || "Khách hàng",
                  customer_phone: orderDetail.customer_phone || "0987654321",
                  items: items || [],
                });
                targetedShippersCount++;
              }
            });
          }

          // C. Fallback: Nếu không có tài xế nào trong bán kính 5km, phát rộng rãi cho shipper_global_room
          if (targetedShippersCount === 0) {
            console.log(`⚠️ [Dispatcher Fallback] Không tìm thấy tài xế nào trong bán kính ${maxRadiusKm}km. Phát rộng rãi cho shipper_global_room.`);
            global._io.to("shipper_global_room").emit("broadcast_new_order", {
              orderId: parseInt(orderId),
              restaurant: req.store.name,
              restaurant_address: req.store.address || "Chưa cập nhật địa chỉ",
              distance: parseFloat(distance),
              shipping_fee: dynamicShipFee,
              total_price: Number(orderDetail.total_price),
              address: orderDetail.address,
              note: orderDetail.note || "Không có ghi chú",
              customer_name: orderDetail.customer_name || "Khách hàng",
              customer_phone: orderDetail.customer_phone || "0987654321",
              items: items || [],
            });
          }

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
