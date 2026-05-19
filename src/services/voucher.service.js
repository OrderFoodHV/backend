const voucherRepo = require("../repositories/voucher.repository");

exports.validateVoucher = async (code, orderAmount) => {
  const voucher = await voucherRepo.findVoucherByCode(code);
  if (!voucher) {
    throw new Error("Mã giảm giá không tồn tại sếp ơi!");
  }
  // Sếp có thể viết thêm điều kiện check hạn sử dụng hoặc giá trị đơn hàng tối thiểu tại đây
  return voucher;
};
