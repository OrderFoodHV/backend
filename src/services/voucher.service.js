const voucherRepo = require("../repositories/voucher.repository");
const db = require("../../config/db");

exports.validateVoucher = async (code, orderAmount, storeId) => {
  let voucher = await voucherRepo.findVoucherByCode(code);
  let isStoreVoucher = false;

  if (!voucher && storeId) {
    const storeVoucher = await db("store_vouchers")
      .where({ code, store_id: storeId })
      .first();

    if (storeVoucher) {
      isStoreVoucher = true;
      voucher = {
        id: storeVoucher.id,
        code: storeVoucher.code,
        discount_percent: storeVoucher.discount_type === 'percent' ? Number(storeVoucher.discount_value) : 0,
        discount_amount: storeVoucher.discount_type === 'fixed' ? Number(storeVoucher.discount_value) : 0,
        min_order_amount: storeVoucher.min_order_amount,
        max_uses: storeVoucher.quantity,
        used_count: storeVoucher.used_count,
        expired_at: storeVoucher.end_date,
        is_active: storeVoucher.status === 'active',
        is_store_voucher: true,
        store_id: storeVoucher.store_id
      };
    }
  }

  if (!voucher) {
    throw new Error("Mã giảm giá không tồn tại sếp ơi!");
  }

  // Kiểm tra trạng thái hoạt động của mã từ cột is_active BOOLEAN
  if (!voucher.is_active) {
    throw new Error("Mã giảm giá này hiện đã bị vô hiệu hóa hoặc tạm dừng!");
  }

  // Kiểm tra hạn sử dụng định dạng DATETIME của schema mới
  if (new Date() > new Date(voucher.expired_at)) {
    throw new Error("Mã giảm giá này đã quá hạn sử dụng rồi nhen sếp!");
  }

  // Kiểm tra xem số lượng dùng đã chạm đỉnh max_uses chưa
  if (voucher.used_count >= voucher.max_uses) {
    throw new Error("Mã giảm giá này đã được sử dụng hết lượt!");
  }

  // Kiểm tra giá trị đơn hàng tối thiểu áp dụng mã (min_order_amount DECIMAL)
  if (Number(orderAmount) < Number(voucher.min_order_amount)) {
    throw new Error(
      `Đơn hàng phải đạt tối thiểu ${Number(voucher.min_order_amount)}đ để dùng mã này.`,
    );
  }

  return voucher;
};

exports.getActiveSystemVouchers = async () => {
  const now = new Date();
  return await db("vouchers")
    .where({ is_active: 1 })
    .andWhere("expired_at", ">", now);
};

exports.getActiveStoreVouchers = async (storeId) => {
  const now = new Date();
  return await db("store_vouchers")
    .where({ store_id: storeId, status: "active" })
    .andWhere("end_date", ">", now);
};
