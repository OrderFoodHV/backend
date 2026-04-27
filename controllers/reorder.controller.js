const db = require("../config/db");

// Lấy danh sách đơn hàng đã hoàn thành/có thể đặt lại
exports.getReorderableOrders = (req, res) => {
  const userId = req.params.userId;
  db.query(
    `SELECT o.*, s.name as store_name, s.id as store_id
     FROM orders o 
     LEFT JOIN stores s ON o.store_id = s.id 
     WHERE o.user_id = ? AND o.status IN ('completed', 'cancelled') 
     ORDER BY o.created_at DESC`,
    [userId],
    (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(data);
    }
  );
};

// Lấy chi tiết đơn cũ để đặt lại
exports.getOrderDetails = (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.params.userId;

  db.query(
    `SELECT o.*, s.name as store_name, s.id as store_id
     FROM orders o 
     LEFT JOIN stores s ON o.store_id = s.id 
     WHERE o.id = ? AND o.user_id = ?`,
    [orderId, userId],
    (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
      if (orders.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
      }

      // Lấy các sản phẩm trong đơn cũ
      db.query(
        `SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image, p.available
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId],
        (err, items) => {
          if (err) return res.status(500).json({ error: err.message });
          
          res.json({
            order: orders[0],
            items: items
          });
        }
      );
    }
  );
};

// Đặt lại đơn hàng từ đơn cũ
exports.reorder = (req, res) => {
  const { user_id, original_order_id, address, voucher_id } = req.body;

  // Lấy thông tin đơn cũ
  db.query(
    "SELECT * FROM orders WHERE id = ? AND user_id = ?",
    [original_order_id, user_id],
    (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
      if (orders.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy đơn hàng gốc" });
      }

      const oldOrder = orders[0];

      // Lấy các sản phẩm từ đơn cũ
      db.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [original_order_id],
        (err, orderItems) => {
          if (err) return res.status(500).json({ error: err.message });
          if (orderItems.length === 0) {
            return res.status(400).json({ error: "Đơn hàng gốc không có sản phẩm" });
          }

          // Kiểm tra sản phẩm còn hàng không
          const availableItems = [];
          let totalPrice = 0;
          
          const checkAvailability = (index) => {
            if (index >= orderItems.length) {
              // Tạo đơn mới
              createNewOrder();
              return;
            }

            const item = orderItems[index];
            db.query(
              "SELECT id, name, price, available FROM products WHERE id = ?",
              [item.product_id],
              (err, products) => {
                if (err || products.length === 0 || !products[0].available) {
                  checkAvailability(index + 1);
                  return;
                }

                const product = products[0];
                availableItems.push({
                  product_id: product.id,
                  quantity: item.quantity,
                  price: product.price
                });
                totalPrice += parseFloat(product.price) * item.quantity;
                checkAvailability(index + 1);
              }
            );
          };

          const createNewOrder = () => {
            if (availableItems.length === 0) {
              return res.status(400).json({ error: "Tất cả sản phẩm đã hết hàng" });
            }

            // Áp dụng voucher nếu có
            let finalPrice = totalPrice;
            let appliedVoucherId = null;

            const applyVoucher = (callback) => {
              if (!voucher_id) {
                callback();
                return;
              }

              db.query(
                "SELECT * FROM vouchers WHERE id = ? AND is_active = TRUE AND expired_at > NOW() AND used_count < max_uses",
                [voucher_id],
                (err, vouchers) => {
                  if (err || vouchers.length === 0) {
                    callback();
                    return;
                  }

                  const voucher = vouchers[0];
                  if (voucher.discount_percent > 0) {
                    finalPrice = totalPrice * (1 - voucher.discount_percent / 100);
                  } else if (voucher.discount_amount > 0) {
                    finalPrice = totalPrice - voucher.discount_amount;
                  }

                  if (finalPrice < 0) finalPrice = 0;
                  appliedVoucherId = voucher_id;
                  callback();
                }
              );
            };

            applyVoucher(() => {
              // Tạo đơn hàng mới
              db.query(
                `INSERT INTO orders (user_id, store_id, total_price, status, payment_status, address, voucher_id) 
                 VALUES (?, ?, ?, 'pending', 'unpaid', ?, ?)`,
                [user_id, oldOrder.store_id, finalPrice, address, appliedVoucherId],
                (err, result) => {
                  if (err) return res.status(500).json({ error: err.message });

                  const newOrderId = result.insertId;

                  // Thêm các sản phẩm vào đơn mới
                  const insertItems = (index) => {
                    if (index >= availableItems.length) {
                      // Cập nhật voucher đã dùng
                      if (appliedVoucherId) {
                        db.query(
                          "UPDATE vouchers SET used_count = used_count + 1 WHERE id = ?",
                          [appliedVoucherId],
                          (err) => { if (err) console.error("Lỗi cập nhật voucher:", err); }
                        );
                      }

                      return res.status(201).json({
                        message: "Đặt lại đơn hàng thành công",
                        new_order_id: newOrderId,
                        items_count: availableItems.length,
                        total_price: finalPrice
                      });
                    }

                    const item = availableItems[index];
                    db.query(
                      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                      [newOrderId, item.product_id, item.quantity, item.price],
                      (err) => {
                        if (err) console.error("Lỗi thêm item:", err);
                        insertItems(index + 1);
                      }
                    );
                  };

                  insertItems(0);
                }
              );
            });
          };

          checkAvailability(0);
        }
      );
    }
  );
};

// Đặt lại một sản phẩm từ đơn cũ
exports.reorderSingleItem = (req, res) => {
  const { user_id, product_id, quantity, address } = req.body;

  // Lấy thông tin sản phẩm
  db.query(
    "SELECT * FROM products WHERE id = ? AND available = TRUE",
    [product_id],
    (err, products) => {
      if (err) return res.status(500).json({ error: err.message });
      if (products.length === 0) {
        return res.status(400).json({ error: "Sản phẩm không còn hàng" });
      }

      const product = products[0];
      const totalPrice = parseFloat(product.price) * quantity;

      // Tạo đơn hàng mới với 1 sản phẩm
      db.query(
        `INSERT INTO orders (user_id, store_id, total_price, status, payment_status, address) 
         VALUES (?, ?, ?, 'pending', 'unpaid', ?)`,
        [user_id, product.store_id, totalPrice, address],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          const newOrderId = result.insertId;

          db.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
            [newOrderId, product_id, quantity, product.price],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });

              res.status(201).json({
                message: "Đặt lại sản phẩm thành công",
                new_order_id: newOrderId,
                product_name: product.name,
                quantity: quantity,
                total_price: totalPrice
              });
            }
          );
        }
      );
    }
  );
};