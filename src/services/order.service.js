const orderRepo = require("../repositories/order.repository");
const cartRepo = require("../repositories/cart.repository");

exports.checkout = async (
  userId,
  shippingAddress,
  itemsFromFE,
  totalPriceFE,
  paymentMethod,
) => {
  let cartItems = itemsFromFE; // Ưu tiên lấy món ăn FE truyền lên luôn

  // Nếu FE không gửi items (Tức là bấm từ nút Giỏ hàng), thì mới đi tìm trong DB
  if (!cartItems || cartItems.length === 0) {
    cartItems = await cartRepo.getCartDetails(userId);
  }

  if (!cartItems || cartItems.length === 0) {
    const error = new Error("Chưa có món ăn nào để đặt!");
    error.statusCode = 400;
    throw error;
  }

  // Nếu FE đã tính total_price thì lấy luôn, không thì tự tính lại
  const finalTotal =
    totalPriceFE ||
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Đẩy xuống Repo lưu vào DB
  const orderId = await orderRepo.createOrderTransaction(
    userId,
    cartItems,
    shippingAddress,
    finalTotal,
  );

  return orderId;
};

// Hàm móc lịch sử
exports.getOrders = async (userId) => {
  return await orderRepo.findOrdersByUser(userId);
};
