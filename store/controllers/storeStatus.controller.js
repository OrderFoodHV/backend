const { ok, success, fail, created } = require("../../src/utils/response");
const storeStatusService = require("../services/storeStatus.service");

/**
 * Lấy trạng thái cửa hàng
 * GET /api/store/:storeId/status
 */
exports.getStatus = async (req, res, next) => {
  try {
    console.log("HELLO FROM GET STATUS! req.store =", req.store);
    const data = storeStatusService.getStoreStatus(req.store);
    return ok(res, data, "Lấy trạng thái cửa hàng thành công");
  } catch (err) {
    next(err);
  }
};

/**
 * Bật/tắt trạng thái mở cửa
 * PUT /api/store/:storeId/status/toggle
 */
exports.toggleStatus = async (req, res, next) => {
  try {
    const message = await storeStatusService.toggleStoreStatus(req.store);
    return success(res, message);
  } catch (err) {
    next(err);
  }
};
