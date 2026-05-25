const voucherRepo = require("../repositories/voucher.repository");

exports.validateVoucher = async (code, orderAmount) => {
  const voucher = await voucherRepo.findVoucherByCode(code);
  if (!voucher) {
    throw new Error("Mã giảm giá không tồn tại sếp ơi!");
  }

  // Kiểm tra trạng thái hoạt động của mã từ cột is_active BOOLEAN
  if (!voucher.is_active) {
    throw new Error("Mã giảm giá này hiện đã bị vô hiệu hóa!");
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
