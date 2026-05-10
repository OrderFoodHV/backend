const db = require("../config/db");
const { ok, created, fail } = require("../utils/response");

// Lấy danh sách đơn hàng đã hoàn thành/có thể đặt lại
exports.getReorderableOrders = async (req, res, next) => {
  try {
    const userId = req.user.id; // Lấy từ token, không từ URL param
    const [data] = await db.query(
      `SELECT o.*, s.name as store_name, s.id as store_id
       FROM orders o 
       LEFT JOIN stores s ON o.store_id = s.id 
       WHERE o.user_id = ? AND o.status IN ('completed', 'cancelled') 
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return ok(res, data);
  } catch (err) {
    next(err);
  }
};

// Lấy chi tiết đơn cũ để xem trước khi đặt lại
exports.getOrderDetails = async (req, res, next) => {
  try {
    const userId = req.user.id; // Lấy từ token
    const { orderId } = req.params;

    const [orders] = await db.query(
      `SELECT o.*, s.name as store_name, s.id as store_id
       FROM orders o 
       LEFT JOIN stores s ON o.store_id = s.id 
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return fail(res, 404, "Không tìm thấy đơn hàng");
    }

    const [items] = await db.query(
      `SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image, p.available
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return ok(res, { order: orders[0], items });
  } catch (err) {
    next(err);
  }
};

// Đặt lại toàn bộ đơn hàng từ đơn cũ
exports.reorder = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const user_id = req.user.id; // Lấy từ token
    const { original_order_id, address, voucher_id } = req.body;

    if (!original_order_id || !address) {
      return fail(res, 400, "Thiếu thông tin bắt buộc");
    }

    // Lấy thông tin đơn cũ
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [original_order_id, user_id]
    );

    if (orders.length === 0) {
      return fail(res, 404, "Không tìm thấy đơn hàng gốc");
    }

    const oldOrder = orders[0];

    // Lấy các sản phẩm từ đơn cũ
    const [orderItems] = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [original_order_id]
    );

    if (orderItems.length === 0) {
      return fail(res, 400, "Đơn hàng gốc không có sản phẩm");
    }

    // Kiểm tra tồn kho song song bằng Promise.all
    const productChecks = await Promise.all(
      orderItems.map((item) =>
        db.query("SELECT id, name, price, available FROM products WHERE id = ? AND available = 1", [item.product_id])
      )
    );

    const availableItems = [];
    let totalPrice = 0;

    productChecks.forEach(([rows], index) => {
      if (rows.length > 0) {
        const product = rows[0];
        availableItems.push({
          product_id: product.id,
          quantity: orderItems[index].quantity,
          price: product.price,
        });
        totalPrice += parseFloat(product.price) * orderItems[index].quantity;
      }
    });

    if (availableItems.length === 0) {
      return fail(res, 400, "Tất cả sản phẩm đã hết hàng");
    }

    // Áp dụng voucher nếu có
    let finalPrice = totalPrice;
    let appliedVoucherId = null;

    if (voucher_id) {
      const [vouchers] = await db.query(
        "SELECT * FROM vouchers WHERE id = ? AND is_active = TRUE AND expired_at > NOW() AND used_count < max_uses",
        [voucher_id]
      );

      if (vouchers.length > 0) {
        const voucher = vouchers[0];
        if (voucher.discount_percent > 0) {
          finalPrice = totalPrice * (1 - voucher.discount_percent / 100);
        } else if (voucher.discount_amount > 0) {
          finalPrice = Math.max(0, totalPrice - voucher.discount_amount);
        }
        appliedVoucherId = voucher_id;
      }
    }

    await conn.beginTransaction();

    // Tạo đơn hàng mới
    const [result] = await conn.query(
      `INSERT INTO orders (user_id, store_id, total_price, status, payment_status, address, voucher_id) 
       VALUES (?, ?, ?, 'pending', 'unpaid', ?, ?)`,
      [user_id, oldOrder.store_id, finalPrice, address, appliedVoucherId]
    );
    const newOrderId = result.insertId;

    // Thêm tất cả sản phẩm vào đơn mới
    await Promise.all(
      availableItems.map((item) =>
        conn.query(
          "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
          [newOrderId, item.product_id, item.quantity, item.price]
        )
      )
    );

    // Cập nhật voucher đã dùng
    if (appliedVoucherId) {
      await conn.query(
        "UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?",
        [appliedVoucherId]
      );
    }

    await conn.commit();

    return created(res, {
      new_order_id: newOrderId,
      items_count: availableItems.length,
      total_price: finalPrice,
    }, "Đặt lại đơn hàng thành công");
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// Đặt lại một sản phẩm từ đơn cũ
exports.reorderSingleItem = async (req, res, next) => {
  const conn = await db.getConnection();
  try {
    const user_id = req.user.id; // Lấy từ token
    const { product_id, quantity, address } = req.body;

    if (!product_id || !quantity || !address) {
      return fail(res, 400, "Thiếu thông tin bắt buộc");
    }

    // Lấy thông tin sản phẩm
    const [products] = await db.query(
      "SELECT * FROM products WHERE id = ? AND available = 1",
      [product_id]
    );

    if (products.length === 0) {
      return fail(res, 400, "Sản phẩm không còn hàng");
    }

    const product = products[0];
    const totalPrice = parseFloat(product.price) * quantity;

    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO orders (user_id, store_id, total_price, status, payment_status, address) 
       VALUES (?, ?, ?, 'pending', 'unpaid', ?)`,
      [user_id, product.store_id, totalPrice, address]
    );
    const newOrderId = result.insertId;

    await conn.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [newOrderId, product_id, quantity, product.price]
    );

    await conn.commit();

    return created(res, {
      new_order_id: newOrderId,
      product_name: product.name,
      quantity,
      total_price: totalPrice,
    }, "Đặt lại sản phẩm thành công");
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};