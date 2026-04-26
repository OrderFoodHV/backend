const db = require("../config/db");

// 1. Tạo đơn hàng mới (Create Order)
exports.createOrder = (req, res) => {
  const user_id = req.user.id; // LẤY TỪ TOKEN
  const { address } = req.body;

  // RÀO CHẮN: Kiểm tra địa chỉ
  if (!address || address.trim() === "") {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập địa chỉ giao hàng!" });
  }

  // Bước 1: Tìm giỏ hàng và tự tính tổng tiền (Backend tự tính, không tin Frontend)
  const getCartSql = `
    SELECT c.id as cart_id, IFNULL(SUM(p.price * ci.quantity), 0) as real_total
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = ?
    GROUP BY c.id
  `;

  db.query(getCartSql, [user_id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0 || results[0].real_total === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    const cartId = results[0].cart_id;
    const realTotal = results[0].real_total;

    // Bước 2: Tạo đơn hàng vào bảng orders
    const createOrderSql =
      "INSERT INTO orders (user_id, total_price, address, status) VALUES (?, ?, ?, 'pending')";

    db.query(
      createOrderSql,
      [user_id, realTotal, address],
      (err, orderResult) => {
        if (err) return res.status(500).json(err);

        const newOrderId = orderResult.insertId;

        // Bước 3: Chép dữ liệu sang order_items (lấy luôn cả giá của sản phẩm lúc đặt)
        const copyItemsSql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        SELECT ?, ci.product_id, ci.quantity, p.price 
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = ?
      `;

        db.query(copyItemsSql, [newOrderId, cartId], (err) => {
          if (err) return res.status(500).json(err);

          // Bước 4: Xóa sạch giỏ hàng
          db.query(
            "DELETE FROM cart_items WHERE cart_id = ?",
            [cartId],
            (err) => {
              if (err) return res.status(500).json(err);
              res.json({
                message: "Đặt hàng thành công!",
                order_id: newOrderId,
                total_paid: realTotal,
              });
            },
          );
        });
      },
    );
  });
};

// 2. Lấy danh sách đơn hàng của user đang đăng nhập
exports.getUserOrders = (req, res) => {
  const user_id = req.user.id; // LẤY TỪ TOKEN

  db.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [user_id],
    (err, orders) => {
      if (err) return res.status(500).json(err);
      res.json(orders);
    },
  );
};

// 3. Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, order_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: `Đã cập nhật trạng thái đơn hàng thành: ${status}` });
    },
  );
};
// 4. Lấy chi tiết đơn hàng
exports.getOrderDetail = (req, res) => {
  const user_id = req.user.id; // từ token
  const { id } = req.params;

  const sql = `
    SELECT o.id, o.total_price, o.address, o.order_status, o.payment_status,
           oi.product_id, oi.quantity, oi.price,
           p.name, p.image
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = ? AND o.user_id = ?
  `;

  db.query(sql, [id, user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json(data);
  });
};
