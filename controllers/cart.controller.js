const db = require("../config/db");

// 1. Thêm sản phẩm vào giỏ hàng
exports.addToCart = (req, res) => {
  const user_id = req.user.id;
  const { product_id, quantity } = req.body;

  // Validate input
  if (!product_id) {
    return res.status(400).json({ message: "Thiếu product_id" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({
      message: "Số lượng sản phẩm phải lớn hơn 0",
    });
  }

  // ✅ B1: Check product tồn tại TRƯỚC
  db.query(
    "SELECT id FROM products WHERE id = ?",
    [product_id],
    (err, product) => {
      if (err) return res.status(500).json(err);

      if (product.length === 0) {
        return res.status(404).json({
          message: "Sản phẩm không tồn tại!",
        });
      }

      // ✅ B2: Sau khi product OK → mới xử lý cart
      db.query(
        "SELECT id FROM carts WHERE user_id = ?",
        [user_id],
        (err, carts) => {
          if (err) return res.status(500).json(err);

          let cartId;

          if (carts.length === 0) {
            // chưa có cart → tạo mới
            db.query(
              "INSERT INTO carts (user_id) VALUES (?)",
              [user_id],
              (err, result) => {
                if (err) return res.status(500).json(err);

                cartId = result.insertId;
                insertOrUpdateItem(cartId, product_id, quantity, res);
              },
            );
          } else {
            // đã có cart
            cartId = carts[0].id;
            insertOrUpdateItem(cartId, product_id, quantity, res);
          }
        },
      );
    },
  );
};

// 👉 Hàm dùng chung
const insertOrUpdateItem = (cartId, productId, quantity, res) => {
  const sql = `
    INSERT INTO cart_items (cart_id, product_id, quantity) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(sql, [cartId, productId, quantity], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Đã thêm vào giỏ hàng!",
    });
  });
};

// 2. Cập nhật số lượng sản phẩm
exports.updateCartItem = (req, res) => {
  const user_id = req.user.id;
  const { product_id, quantity } = req.body;

  db.query(
    "SELECT id FROM carts WHERE user_id = ?",
    [user_id],
    (err, carts) => {
      if (err || carts.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy giỏ hàng",
        });
      }

      const cartId = carts[0].id;

      if (quantity <= 0) {
        // xóa nếu quantity <= 0
        db.query(
          "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
          [cartId, product_id],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({
              message: "Đã xóa sản phẩm khỏi giỏ hàng",
            });
          },
        );
      } else {
        db.query(
          "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
          [quantity, cartId, product_id],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({
              message: "Cập nhật số lượng thành công",
            });
          },
        );
      }
    },
  );
};

// 3. Xóa sản phẩm khỏi giỏ
exports.removeFromCart = (req, res) => {
  const user_id = req.user.id;
  const { product_id } = req.body;

  db.query(
    "SELECT id FROM carts WHERE user_id = ?",
    [user_id],
    (err, carts) => {
      if (err || carts.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy giỏ hàng",
        });
      }

      db.query(
        "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
        [carts[0].id, product_id],
        (err) => {
          if (err) return res.status(500).json(err);

          res.json({
            message: "Đã xóa sản phẩm khỏi giỏ",
          });
        },
      );
    },
  );
};

// 4. Lấy giỏ hàng
exports.getCart = (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT 
      ci.product_id,
      p.name,
      p.image,
      p.price,
      ci.quantity,
      CAST(p.price * ci.quantity AS DECIMAL(10,2)) as total
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    JOIN products p ON ci.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};
