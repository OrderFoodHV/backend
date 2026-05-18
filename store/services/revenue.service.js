const repo = require("../repositories/revenue.repo");

exports.getSummary = async (storeId, query) => {
  const { period, from, to } = query;
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

  return await repo.getSummary(storeId, dateCondition, params);
};

exports.getChart = async (storeId, query) => {
  const { period = "day", from, to } = query;

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

  return await repo.getChart(storeId, groupBy, dateFormat, dateCondition, params);
};

exports.getTopProducts = async (storeId, query) => {
  const limit = parseInt(query.limit) || 10;
  const { from, to } = query;

  let dateCondition = "";
  const params = [storeId];

  if (from && to) {
    dateCondition = " AND o.created_at BETWEEN ? AND ?";
    params.push(from, to);
  }

  params.push(limit);

  return await repo.getTopProducts(storeId, limit, dateCondition, params);
};
