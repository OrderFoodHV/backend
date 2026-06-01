const db = require("../../config/db");

exports.getAvailableOrders = async () => {
  return await db("orders")
    .where({ status: "Quán đã nhận đơn", shipper_id: null })
    .select("id", "total_price", "address", "created_at");
};

exports.acceptOrder = async (userId, orderId) => {
  return await db.transaction(async (trx) => {
    const shipper = await trx("shippers").where({ user_id: userId }).first();
    if (!shipper) throw new Error("Tài xế không tồn tại");

    // 1. Cập nhật đơn hàng: Gán shipper_id nhưng GIỮ NGUYÊN trạng thái 'Quán đã nhận đơn' để cửa hàng xác nhận giao
    const affectedRows = await trx("orders")
      .where({ id: orderId, status: "Quán đã nhận đơn", shipper_id: null })
      .update({
        shipper_id: shipper.id,
      });

    if (affectedRows === 0)
      throw new Error("Đơn hàng đã có người nhận hoặc không tồn tại!");

    // 2. Ghi vào order_tracking
    await trx("order_tracking").insert({
      order_id: orderId,
      status: "Tài xế nhận đơn",
      note: "Tài xế đã nhận đơn và đang di chuyển tới quán.",
    });

    return "Đã nhận đơn thành công!";
  });
};

exports.completeOrder = async (userId, orderId, deliveryPhoto) => {
  return await db.transaction(async (trx) => {
    const shipper = await trx("shippers").where({ user_id: userId }).first();
    if (!shipper) throw new Error("Tài xế không tồn tại");

    // 1. Cập nhật trạng thái, trạng thái thanh toán và ảnh bằng chứng giao hàng
    await trx("orders")
      .where({ id: orderId, shipper_id: shipper.id })
      .update({ 
        status: "completed",
        payment_status: "paid",
        delivery_photo: deliveryPhoto || null
      });

    // 2. Ghi log hoàn thành
    await trx("order_tracking").insert({
      order_id: orderId,
      status: "completed",
      note: "Đơn hàng đã được giao thành công.",
    });

    // 3. Thực hiện chia tiền (wallet/split logic)
    const order = await trx("orders").where({ id: orderId }).first();
    if (order) {
      // 3.1. Tính tiền tài xế
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

      // Cập nhật ví tài xế
      const existingWallet = await trx("shipper_wallets").where({ shipper_id: shipper.id }).first();
      if (existingWallet) {
        await trx("shipper_wallets")
          .where({ shipper_id: shipper.id })
          .increment("balance", shipperEarn);
      } else {
        await trx("shipper_wallets").insert({
          shipper_id: shipper.id,
          balance: shipperEarn,
          updated_at: new Date()
        });
      }

      // 3.2. Tính tiền quán (store)
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

      // Ghi nhận log wallet_transactions (cho shipper)
      await trx("wallet_transactions").insert({
        shipper_id: shipper.id,
        amount: shipperEarn,
        type: "order_revenue",
        description: `Thu nhập giao đơn #${orderId}`,
        created_at: new Date(),
      });
    }

    return "Đã hoàn thành đơn!";
  });
};
