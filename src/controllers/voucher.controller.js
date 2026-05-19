const voucherService = require("../services/voucher.service");
const catchAsync = require("../utils/catchAsync");

exports.checkVoucher = catchAsync(async (req, res, next) => {
  const { code, total_price } = req.body;
  const voucher = await voucherService.validateVoucher(code, total_price);

  res.status(200).json({
    status: "success",
    data: voucher,
  });
});
