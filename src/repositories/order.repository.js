const db = require("../../config/db");

exports.createOrderTransaction = async (
  userId,
  storeId,
  cartItems,
  shippingAddress,
  totalAmount,
  shippingFee,
  serviceFee,
  note,
  distance,
  voucherId, // 🔥 Thêm voucherId
  paymentMethod, // 🔥 Thêm paymentMethod
  storeVoucherId, // 🔥 Thêm storeVoucherId
) => {
  return await db.transaction(async (trx) => {
    // 1. Insert và lấy ID chuẩn nhất
    const [orderId] = await trx("orders").insert({
      user_id: userId,
      store_id: storeId, // Đã thêm storeId
      address: shippingAddress,
      total_price: totalAmount,
      shipping_fee: shippingFee || 0,
      service_fee: serviceFee || 0,
      distance: distance || null, // Lưu khoảng cách thực tế
      note: note || null,
      status: "pending",
      voucher_id: voucherId || null, // 🔥 Ghi nhận voucher_id
      store_voucher_id: storeVoucherId || null, // 🔥 Ghi nhận store_voucher_id
      payment_method: paymentMethod || "COD", // 🔥 Lưu phương thức thanh toán
      created_at: new Date(),
    });

    const orderItemsData = cartItems.map((item) => ({
      order_id: orderId, // Dùng ID này
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
    await trx("order_items").insert(orderItemsData);

    // 2. Ghi nhận lượt sử dụng voucher (nếu có)
    if (voucherId) {
      await trx("voucher_usages").insert({
        user_id: userId,
        voucher_id: voucherId,
        used_at: new Date(),
      });
      await trx("vouchers").where({ id: voucherId }).increment("used_count", 1);
    }

    if (storeVoucherId) {
      await trx("store_vouchers").where({ id: storeVoucherId }).increment("used_count", 1);
    }

    // Xóa giỏ hàng...
    // Xóa tất cả cart items của user này
    const cart = await trx("carts").where({ user_id: userId }).first();
    if (cart) {
      await trx("cart_items").where({ cart_id: cart.id }).del();
    }

    return orderId; // Trả về con số (ví dụ: 101)
  });
};

// Lấy danh sách tất cả đơn hàng của 1 khách
exports.findOrdersByUser = async (userId) => {
  return await db("orders").where({ user_id: userId }).orderBy("id", "desc"); // Đơn mới nhất xếp lên đầu
};

// Lấy chi tiết các món ăn trong 1 đơn hàng cụ thể
exports.findOrderItemsDetails = async (orderId) => {
  return await db("order_items as oi")
    .join("products as p", "oi.product_id", "p.id")
    .where("oi.order_id", orderId)
    .select("p.name", "p.image", "oi.quantity", "oi.price");
};

exports.updateOrderStatus = async (orderId, newStatus) => {
  const updateData = { status: newStatus };

  //Nếu đơn hàng chuyển sang hoàn thành, tự động thu tiền luôn (Đổi thành paid)
  if (newStatus === "completed" || newStatus === "delivered") {
    updateData.payment_status = "paid";
  }

  return await db.transaction(async (trx) => {
    const order = await trx("orders").where({ id: orderId }).first();
    if (!order) return 0;

    // Chỉ thực hiện chia tiền nếu đơn chuyển sang completed/delivered và trước đó chưa ghi nhận thanh toán
    const willPay = (newStatus === "completed" || newStatus === "delivered") && order.payment_status !== "paid";

    const affectedRows = await trx("orders").where({ id: orderId }).update(updateData);

    if (willPay) {
      // 1. Tính tiền tài xế
      if (order.shipper_id) {
        const [shipperFeeSettings] = await trx("fee_settings")
          .where({ fee_type: "shipper_commission", status: "active" })
          .limit(1);
        let shipperCommissionPct = 20; // Mặc định 20%
        if (shipperFeeSettings) {
          shipperCommissionPct = Number(shipperFeeSettings.fee_value);
        }
        const shipperFactor = (100 - shipperCommissionPct) / 100;
        const shippingFeeVal = Number(order.shipping_fee) || 15000;
        const tipAmountVal = Number(order.tip_amount) || 0;
        const shipperEarn = Math.round(shippingFeeVal * shipperFactor) + tipAmountVal;

        const existingWallet = await trx("shipper_wallets").where({ shipper_id: order.shipper_id }).first();
        if (existingWallet) {
          await trx("shipper_wallets")
            .where({ shipper_id: order.shipper_id })
            .increment("balance", shipperEarn);
        } else {
          await trx("shipper_wallets").insert({
            shipper_id: order.shipper_id,
            balance: shipperEarn,
            updated_at: new Date()
          });
        }

        await trx("wallet_transactions").insert({
          shipper_id: order.shipper_id,
          amount: shipperEarn,
          type: "order_revenue",
          description: `Thu nhập giao đơn #${orderId}`,
          created_at: new Date(),
        });

        // 🌟 Gửi thông báo đến tài xế về thu nhập mới
        const shipperObj = await trx("shippers").where({ id: order.shipper_id }).first();
        if (shipperObj) {
          const notiService = require("../services/notifications.service");
          await notiService.createNotification({
            userId: shipperObj.user_id,
            role: "shipper",
            title: "Thu nhập được cộng! 💰",
            content: `Bạn đã nhận được +${shipperEarn.toLocaleString("vi-VN")}đ từ việc hoàn thành đơn hàng #${orderId}.`,
            type: "order"
          }).catch(err => console.error("Lỗi gửi thông báo ví tài xế:", err));
        }
      }

      // 2. Tính tiền quán (store)
      const items = await trx("order_items").where({ order_id: orderId });
      const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

      // Tính voucher của shop nếu có
      let storeVoucherDiscount = 0;
      if (order.store_voucher_id) {
        const storeVoucher = await trx("store_vouchers").where({ id: order.store_voucher_id }).first();
        if (storeVoucher) {
          if (storeVoucher.discount_type === 'percent') {
            storeVoucherDiscount = (subtotal * Number(storeVoucher.discount_value)) / 100;
            if (Number(storeVoucher.max_discount) > 0) {
              storeVoucherDiscount = Math.min(storeVoucherDiscount, Number(storeVoucher.max_discount));
            }
          } else {
            storeVoucherDiscount = Number(storeVoucher.discount_value);
          }
        }
      }

      const netFoodPrice = Math.max(0, subtotal - storeVoucherDiscount);

      // Lấy tỷ lệ hoa hồng quán
      const [shopFeeSettings] = await trx("fee_settings")
        .where({ fee_type: "shop_commission", status: "active" })
        .limit(1);
      let shopCommissionPct = 20; // Mặc định 20%
      if (shopFeeSettings) {
        shopCommissionPct = Number(shopFeeSettings.fee_value);
      }
      const shopFactor = (100 - shopCommissionPct) / 100;
      const storeEarn = Math.round(netFoodPrice * shopFactor);

      // Cập nhật số dư quán
      await trx("stores")
        .where({ id: order.store_id })
        .increment("balance", storeEarn);
    }

    return affectedRows;
  });
};

exports.findOrderById = async (orderId) => {
  return await db("orders").where({ id: orderId }).first();
};

exports.findOrderItems = async (orderId) => {
  return await db("order_items").where({ order_id: orderId });
};
