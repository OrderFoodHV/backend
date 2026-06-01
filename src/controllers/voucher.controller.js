const voucherService = require("../services/voucher.service");
const catchAsync = require("../utils/catchAsync");

exports.checkVoucher = catchAsync(async (req, res, next) => {
  const { code, total_price, store_id } = req.body;
  const voucher = await voucherService.validateVoucher(code, total_price, store_id);

  res.status(200).json({
    status: "success",
    data: voucher,
  });
});

exports.getSystemVouchers = catchAsync(async (req, res, next) => {
  const vouchers = await voucherService.getActiveSystemVouchers();
  res.status(200).json({
    status: "success",
    data: vouchers,
  });
});

exports.getStoreVouchers = catchAsync(async (req, res, next) => {
  const { storeId } = req.params;
  const vouchers = await voucherService.getActiveStoreVouchers(storeId);
  res.status(200).json({
    status: "success",
    data: vouchers,
  });
});
