const orderRepo = require("../repositories/order.repository");
const cartRepo = require("../repositories/cart.repository");

exports.checkout = async (
  userId,
  shippingAddress,
  itemsFromFE,
  totalPriceFE,
) => {
  // BƯỚC KHÔN NGOAN: Nếu FE gửi sẵn món ăn (Luồng Mua Ngay), xài luôn!
  let cartItems = itemsFromFE;

  // Nếu FE không gửi món ăn nào (Luồng đi từ Giỏ Hàng), mới mò xuống DB quét
  if (!cartItems || cartItems.length === 0) {
    cartItems = await cartRepo.getCartDetails(userId);
  }

  if (!cartItems || cartItems.length === 0) {
    const error = new Error("Không có sản phẩm nào để tiến hành đặt hàng!");
    error.statusCode = 400;
    throw error;
  }

  // Tính toán tổng tiền bảo mật
  const finalTotal =
    totalPriceFE ||
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Chuyền thông tin xuống Repo chạy Transaction khóa sổ dữ liệu
  const orderId = await orderRepo.createOrderTransaction(
    userId,
    cartItems,
    shippingAddress,
    finalTotal,
  );

  return orderId;
};

exports.getOrders = async (userId) => {
  return await orderRepo.findOrdersByUser(userId);
};
