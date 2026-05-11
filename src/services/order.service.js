const orderRepo = require("../repositories/order.repository");
const cartRepo = require("../repositories/cart.repository"); // Mượn tạm file của giỏ hàng

exports.checkout = async (userId, shippingAddress) => {
  // 1. Móc giỏ hàng ra xem có gì không
  const cartItems = await cartRepo.getCartDetails(userId);

  if (!cartItems || cartItems.length === 0) {
    const error = new Error("Giỏ hàng đang trống, không thể đặt hàng!");
    error.statusCode = 400;
    throw error;
  }

  // 2. Tự tính toán lại tổng tiền ở Backend (Không tin tưởng data từ Frontend gửi lên để chống hack)
  const total_price = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 3. Chuyền thông tin xuống Repository để chạy Transaction
  const orderId = await orderRepo.createOrderTransaction(
    userId,
    cartItems,
    shippingAddress,
    total_price,
  );

  return orderId;
};
