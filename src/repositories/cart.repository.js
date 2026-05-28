const db = require("../../config/db");

exports.findCartByUserId = async (user_id) => {
  return await db("carts").where({ user_id }).first();
};

exports.createCart = async (user_id) => {
  const [id] = await db("carts").insert({ user_id });
  return id;
};

exports.findCartItem = async (cart_id, product_id) => {
  return await db("cart_items").where({ cart_id, product_id }).first();
};

// Hàm này dùng tính năng .increment() của Knex cực xịn, tự cộng dồn không cần viết SQL dài
exports.incrementItemQty = async (cart_id, product_id, quantity) => {
  return await db("cart_items")
    .where({ cart_id, product_id })
    .increment("quantity", quantity);
};

exports.addCartItem = async (cart_id, product_id, quantity) => {
  return await db("cart_items").insert({ cart_id, product_id, quantity });
};

// Knex xử lý câu lệnh JOIN nhiều bảng cực mượt
exports.getCartDetails = async (user_id) => {
  return await db("carts as c")
    .join("cart_items as ci", "c.id", "ci.cart_id")
    .join("products as p", "ci.product_id", "p.id")
    .where("c.user_id", user_id)
    .select(
      "ci.product_id",
      "p.name",
      "p.image",
      "p.price",
      "p.store_id", // Thêm store_id vào cart details để kiểm tra trùng quán
      "ci.quantity",
      db.raw("CAST(p.price * ci.quantity AS DECIMAL(10,2)) as total"),
    );
};

exports.clearCartItems = async (cart_id) => {
  return await db("cart_items").where({ cart_id }).delete();
};

exports.deleteCartItem = async (cart_id, product_id) => {
  return await db("cart_items").where({ cart_id, product_id }).delete();
};
