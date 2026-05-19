const { ok, success, fail, created } = require("../../src/utils/response");
const storeVoucherService = require("../services/storeVoucher.service");

// Helper xử lý lỗi custom từ Service
const handleServiceError = (res, next, err) => {
  if (err.message && err.message.includes("|")) {
    const [msg, code] = err.message.split("|");
    return fail(res, parseInt(code), msg);
  }
  next(err);
};

exports.getVouchers = async (req, res, next) => {
  try {
    const data = await storeVoucherService.getVouchers(
      req.params.storeId,
      req.query,
    );
    return ok(res, data);
  } catch (err) {
    next(err);
  }
};

exports.createVoucher = async (req, res, next) => {
  try {
    const data = await storeVoucherService.createVoucher(
      req.params.storeId,
      req.body,
    );
    return created(res, data, "Tạo voucher thành công");
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.updateVoucher = async (req, res, next) => {
  try {
    const message = await storeVoucherService.updateVoucher(
      req.params.storeId,
      req.params.voucherId,
      req.body,
    );
    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.deleteVoucher = async (req, res, next) => {
  try {
    const message = await storeVoucherService.deleteVoucher(
      req.params.storeId,
      req.params.voucherId,
    );
    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.toggleVoucher = async (req, res, next) => {
  try {
    const message = await storeVoucherService.toggleVoucher(
      req.params.storeId,
      req.params.voucherId,
    );
    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};
