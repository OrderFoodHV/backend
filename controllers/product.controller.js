const db = require("../config/db");
const { ok, fail } = require("../utils/response");

exports.getAll = async (req, res, next) => {
  try {
    const { category_id, search, available } = req.query;
    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];
    if (category_id) { sql += " AND category_id = ?"; params.push(category_id); }
    if (search) { sql += " AND name LIKE ?"; params.push(`%${search}%`); }
    if (available !== undefined) { sql += " AND available = ?"; params.push(available === "true" ? 1 : 0); }
    sql += " ORDER BY name ASC";
    const [data] = await db.query(sql, params);
    return ok(res, data);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const [data] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (data.length === 0) return fail(res, 404, "Không tìm thấy sản phẩm");
    return ok(res, data[0]);
  } catch (err) { next(err); }
};
