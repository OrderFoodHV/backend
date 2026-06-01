const db = require("../../config/db");

exports.getSummary = async (storeId, dateCondition, params) => {
  const [feeSettings] = await db.query(
    "SELECT fee_value FROM fee_settings WHERE fee_type = 'shop_commission' AND status = 'active' LIMIT 1"
  );
  let commissionPct = 20;
  if (feeSettings && feeSettings.length > 0) {
    commissionPct = Number(feeSettings[0].fee_value);
  }
  const factor = (100 - commissionPct) / 100;

  const [summary] = await db.query(
    `SELECT 
      COUNT(*) as total_orders,
      IFNULL(SUM(CASE WHEN o.status = 'completed' THEN (SELECT SUM(oi.quantity * oi.price) FROM order_items oi WHERE oi.order_id = o.id) * ${factor} ELSE 0 END), 0) as total_revenue,
      IFNULL(AVG(CASE WHEN o.status = 'completed' THEN (SELECT SUM(oi.quantity * oi.price) FROM order_items oi WHERE oi.order_id = o.id) * ${factor} ELSE NULL END), 0) as avg_order_value,
      COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
      COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
      COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders
    FROM orders o
    WHERE o.store_id = ? ${dateCondition}`,
    params
  );
  return summary[0];
};

exports.getChart = async (storeId, groupBy, dateFormat, dateCondition, params) => {
  const [feeSettings] = await db.query(
    "SELECT fee_value FROM fee_settings WHERE fee_type = 'shop_commission' AND status = 'active' LIMIT 1"
  );
  let commissionPct = 20;
  if (feeSettings && feeSettings.length > 0) {
    commissionPct = Number(feeSettings[0].fee_value);
  }
  const factor = (100 - commissionPct) / 100;

  const [data] = await db.query(
    `SELECT 
      ${dateFormat},
      COUNT(*) as total_orders,
      IFNULL(SUM(CASE WHEN o.status = 'completed' THEN (SELECT SUM(oi.quantity * oi.price) FROM order_items oi WHERE oi.order_id = o.id) * ${factor} ELSE 0 END), 0) as revenue
    FROM orders o
    WHERE o.store_id = ? AND o.status = 'completed'${dateCondition}
    GROUP BY ${groupBy}
    ORDER BY ${groupBy} ASC`,
    params
  );
  return data;
};

exports.getTopProducts = async (storeId, limit, dateCondition, params) => {
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
  return data;
};
