const db = require("../../config/db");

exports.createOrderTransaction = async (
  userId,
  cartItems,
  shippingAddress,
  totalAmount,
) => {
  // Bắt đầu Transaction
  return await db.transaction(async (trx) => {
    // 1. Nhét dữ liệu vào bảng orders
    const [orderId] = await trx("orders").insert({
      user_id: userId,
      address: shippingAddress,
      total_price: totalAmount,
      status: "pending", // Đơn mới đang chờ xử lý
    });

    // 2. Chuẩn bị danh sách món ăn để nhét vào bảng order_items
    const orderItemsData = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
    await trx("order_items").insert(orderItemsData);

    // 3. Xóa sạch giỏ hàng của khách (Tìm giỏ hàng rồi xóa các items)
    const cart = await trx("carts").where({ user_id: userId }).first();
    if (cart) {
      await trx("cart_items").where({ cart_id: cart.id }).del();
    }

    // Nếu chạy êm xuôi đến đây, tự động lưu (Commit)
    return orderId;
  });
};

// Lấy danh sách tất cả đơn hàng của 1 khách
exports.findOrdersByUser = async (userId) => {
  return await db("orders").where({ user_id: userId }).orderBy("id", "desc"); // Đơn mới nhất xếp lên đầu
};

// Lấy chi tiết các món ăn trong 1 đơn hàng cụ thể
exports.findOrderItemsDetails = async (orderId) => {
  return await db("order_items as oi")
    .join("products as p", "oi.product_id", "p.id")
    .where("oi.order_id", orderId)
    .select("p.name", "p.image", "oi.quantity", "oi.price");
};

// Đổi trạng thái đơn hàng (Dành cho Shipper/Admin)
exports.updateOrderStatus = async (orderId, newStatus) => {
  return await db("orders")
    .where({ id: orderId })
    .update({ status: newStatus });
};
