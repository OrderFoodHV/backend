const { ok } = require("../../utils/response");
const revenueService = require("../services/revenue.service");

/**
 * 1. Tổng quan doanh thu
 * GET /api/store/:storeId/revenue/summary?period=day|week|month|year&from=&to=
 */
exports.getSummary = async (req, res, next) => {
  try {
    const data = await revenueService.getSummary(req.params.storeId, req.query);
    return ok(res, data, "Lấy tổng quan doanh thu thành công");
  } catch (err) {
    next(err);
  }
};

/**
 * 2. Doanh thu theo thời gian (cho biểu đồ)
 * GET /api/store/:storeId/revenue/chart?period=day|week|month&from=&to=
 */
exports.getChart = async (req, res, next) => {
  try {
    const data = await revenueService.getChart(req.params.storeId, req.query);
    return ok(res, data, "Lấy biểu đồ doanh thu thành công");
  } catch (err) {
    next(err);
  }
};

/**
 * 3. Top sản phẩm bán chạy
 * GET /api/store/:storeId/revenue/top-products?limit=10&from=&to=
 */
exports.getTopProducts = async (req, res, next) => {
  try {
    const data = await revenueService.getTopProducts(req.params.storeId, req.query);
    return ok(res, data, "Lấy top sản phẩm bán chạy thành công");
  } catch (err) {
    next(err);
  }
};
