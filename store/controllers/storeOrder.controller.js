const { ok, success, fail } = require("../../utils/response");
const storeOrderService = require("../services/storeOrder.service");

// Helper xử lý lỗi custom từ Service
const handleServiceError = (res, next, err) => {
  if (err.message.includes("|")) {
    const [msg, code] = err.message.split("|");
    return fail(res, parseInt(code), msg);
  }
  next(err);
};

exports.getOrders = async (req, res, next) => {
  try {
    const data = await storeOrderService.getOrders(req.params.storeId, req.query);
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const data = await storeOrderService.getOrderDetail(req.params.storeId, req.params.orderId);
    return ok(res, data);
  } catch (err) { handleServiceError(res, next, err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const message = await storeOrderService.updateOrderStatus(req.params.storeId, req.params.orderId, req.body.status, req.body.note);
    return success(res, message);
  } catch (err) { handleServiceError(res, next, err); }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const data = await storeOrderService.getOrderStats(req.params.storeId);
    return ok(res, data);
  } catch (err) { next(err); }
};
