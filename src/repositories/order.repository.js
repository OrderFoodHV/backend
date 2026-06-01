const db = require("../../config/db");

exports.createOrderTransaction = async (
  userId,
  storeId,
  cartItems,
  shippingAddress,
  totalAmount,
  shippingFee,
  serviceFee,
  note,
  distance,
) => {
  return await db.transaction(async (trx) => {
    // 1. Insert và lấy ID chuẩn nhất
    const [orderId] = await trx("orders").insert({
      user_id: userId,
      store_id: storeId, // Đã thêm storeId
      address: shippingAddress,
      total_price: totalAmount,
      shipping_fee: shippingFee || 0,
      service_fee: serviceFee || 0,
      distance: distance || null, // Lưu khoảng cách thực tế
      note: note || null,
      status: "pending",
      created_at: new Date(),
    });

    const orderItemsData = cartItems.map((item) => ({
      order_id: orderId, // Dùng ID này
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
    await trx("order_items").insert(orderItemsData);

    // Xóa giỏ hàng...
    return orderId; // Trả về con số (ví dụ: 101)
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
// Mở file order.repository.js bên Backend và sửa lại hàm này:
exports.updateOrderStatus = async (orderId, newStatus) => {
  const updateData = { status: newStatus };

  //Nếu đơn hàng chuyển sang hoàn thành, tự động thu tiền luôn (Đổi thành paid)
  if (newStatus === "completed" || newStatus === "delivered") {
    updateData.payment_status = "paid";
  }

  return await db("orders").where({ id: orderId }).update(updateData);
};
