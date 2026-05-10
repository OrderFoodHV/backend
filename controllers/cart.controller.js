const db = require("../config/db");
const { ok, success, fail } = require("../utils/response");

const insertOrUpdateItem = async (conn, cartId, productId, quantity) => {
  await conn.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [cartId, productId, quantity]
  );
};

exports.addToCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;
    if (!product_id) return fail(res, 400, "Thiếu product_id");
    if (!quantity || quantity <= 0) return fail(res, 400, "Số lượng sản phẩm phải lớn hơn 0");
    const [product] = await db.query("SELECT id FROM products WHERE id = ?", [product_id]);
    if (product.length === 0) return fail(res, 404, "Sản phẩm không tồn tại!");
    let [carts] = await db.query("SELECT id FROM carts WHERE user_id = ?", [user_id]);
    let cartId;
    if (carts.length === 0) {
      const [result] = await db.query("INSERT INTO carts (user_id) VALUES (?)", [user_id]);
      cartId = result.insertId;
    } else { cartId = carts[0].id; }
    await insertOrUpdateItem(db, cartId, product_id, quantity);
    return success(res, "Đã thêm vào giỏ hàng!");
  } catch (err) { next(err); }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;
    const [carts] = await db.query("SELECT id FROM carts WHERE user_id = ?", [user_id]);
    if (carts.length === 0) return fail(res, 404, "Không tìm thấy giỏ hàng");
    const cartId = carts[0].id;
    if (quantity <= 0) {
      await db.query("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [cartId, product_id]);
      return success(res, "Đã xóa sản phẩm khỏi giỏ hàng");
    }
    await db.query("UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?", [quantity, cartId, product_id]);
    return success(res, "Cập nhật số lượng thành công");
  } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;
    const [carts] = await db.query("SELECT id FROM carts WHERE user_id = ?", [user_id]);
    if (carts.length === 0) return fail(res, 404, "Không tìm thấy giỏ hàng");
    await db.query("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?", [carts[0].id, product_id]);
    return success(res, "Đã xóa sản phẩm khỏi giỏ");
  } catch (err) { next(err); }
};

exports.getCart = async (req, res, next) => {
  try {
    const [result] = await db.query(
      `SELECT ci.product_id, p.name, p.image, p.price, ci.quantity,
              CAST(p.price * ci.quantity AS DECIMAL(10,2)) as total
       FROM carts c JOIN cart_items ci ON c.id = ci.cart_id JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    return ok(res, result);
  } catch (err) { next(err); }
};
