const orderRepo = require("../repositories/order.repository");
const cartRepo = require("../repositories/cart.repository");

exports.checkout = async (
  userId,
  storeId, // 🔥 Thêm tham số nhận dạng Quán
  shippingAddress,
  itemsFromFE,
  totalPriceFE,
) => {
  let cartItems = Array.isArray(itemsFromFE) ? itemsFromFE : [];
  if (cartItems.length === 0) {
    cartItems = await cartRepo.getCartDetails(userId);
  }

  if (!cartItems || cartItems.length === 0) {
    const error = new Error("Không có sản phẩm nào để tiến hành đặt hàng!");
    error.statusCode = 400;
    throw error;
  }

  // Nếu FE không gửi storeId, bốc đại store_id của món ăn đầu tiên trong giỏ hàng để cứu nguy
  const finalStoreId = storeId || cartItems[0]?.store_id || 1;

  const finalTotal =
    totalPriceFE ||
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Gọi Repo chạy Transaction (Nhớ truyền finalStoreId vào nhen sếp)
  // Sếp mở file order.repository.js gài thêm store_id vào câu lệnh trx("orders").insert luôn nhé!
  const orderId = await orderRepo.createOrderTransaction(
    userId,
    finalStoreId, // Đảm bảo Repo nhận được trường này để insert vào DB
    cartItems,
    shippingAddress,
    finalTotal,
  );

  return { orderId, finalStoreId }; // Trả ra ngoài cả 2 thông tin để Controller bắn Socket
};

exports.getOrders = async (userId) => {
  return await orderRepo.findOrdersByUser(userId);
};
