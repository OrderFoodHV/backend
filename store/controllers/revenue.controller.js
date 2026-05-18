const db = require("../../config/db");
const { ok, fail } = require("../../utils/response");

/**
 * 1. Tổng quan doanh thu
 * GET /api/store/:storeId/revenue/summary?period=day|week|month|year&from=&to=
 */
exports.getSummary = async (req, res, next) => {
  try {
    const storeId = req.params.storeId;
    const { period, from, to } = req.query;

    let dateCondition = "";
    const params = [storeId];

    if (from && to) {
      dateCondition = " AND o.created_at BETWEEN ? AND ?";
      params.push(from, to);
    } else if (period) {
      const periodMap = {
        day: "INTERVAL 1 DAY",
        week: "INTERVAL 7 DAY",
        month: "INTERVAL 1 MONTH",
        year: "INTERVAL 1 YEAR",
      };
      if (periodMap[period]) {
        dateCondition = ` AND o.created_at >= DATE_SUB(NOW(), ${periodMap[period]})`;
      }
    }

    const [summary] = await db.query(
      `SELECT 
        COUNT(*) as total_orders,
        IFNULL(SUM(CASE WHEN o.status = 'completed' THEN o.total_price ELSE 0 END), 0) as total_revenue,
        IFNULL(AVG(CASE WHEN o.status = 'completed' THEN o.total_price ELSE NULL END), 0) as avg_order_value,
        COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
        COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders
      FROM orders o
      WHERE o.store_id = ? AND o.status != 'cancelled'${dateCondition}`,
      params
    );

    return ok(res, summary[0], "Lấy tổng quan doanh thu thành công");
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
    const storeId = req.params.storeId;
    const { period = "day", from, to } = req.query;

    let groupBy, dateFormat;
    switch (period) {
      case "week":
        groupBy = "YEARWEEK(o.created_at, 1)";
        dateFormat = "YEARWEEK(o.created_at, 1) as label";
        break;
      case "month":
        groupBy = "DATE_FORMAT(o.created_at, '%Y-%m')";
        dateFormat = "DATE_FORMAT(o.created_at, '%Y-%m') as label";
        break;
      case "year":
        groupBy = "YEAR(o.created_at)";
        dateFormat = "YEAR(o.created_at) as label";
        break;
      default: // day
        groupBy = "DATE(o.created_at)";
        dateFormat = "DATE(o.created_at) as label";
    }

    let dateCondition = "";
    const params = [storeId];

    if (from && to) {
      dateCondition = " AND o.created_at BETWEEN ? AND ?";
      params.push(from, to);
    }

    const [data] = await db.query(
      `SELECT 
        ${dateFormat},
        COUNT(*) as total_orders,
        IFNULL(SUM(CASE WHEN o.status = 'completed' THEN o.total_price ELSE 0 END), 0) as revenue
      FROM orders o
      WHERE o.store_id = ? AND o.status = 'completed'${dateCondition}
      GROUP BY ${groupBy}
      ORDER BY ${groupBy} ASC`,
      params
    );

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
    const storeId = req.params.storeId;
    const limit = parseInt(req.query.limit) || 10;
    const { from, to } = req.query;

    let dateCondition = "";
    const params = [storeId];

    if (from && to) {
      dateCondition = " AND o.created_at BETWEEN ? AND ?";
      params.push(from, to);
    }

    params.push(limit);

    const [data] = await db.query(
      `SELECT 
        p.id, p.name, p.image, p.price,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.store_id = ? AND o.status = 'completed'${dateCondition}
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT ?`,
      params
    );

    return ok(res, data, "Lấy top sản phẩm bán chạy thành công");
  } catch (err) {
    next(err);
  }
};
