const cartRepo = require("../repositories/cart.repository");

exports.addToCart = async (userId, productId, quantity) => {
  // 1. Kiểm tra khách có giỏ chưa
  let cart = await cartRepo.findCartByUserId(userId);
  let cartId;

  // Nếu chưa có thì tạo giỏ mới
  if (!cart) {
    cartId = await cartRepo.createCart(userId);
  } else {
    cartId = cart.id;
  }

  // 2. Kiểm tra xem món này đã có trong giỏ chưa
  const existingItem = await cartRepo.findCartItem(cartId, productId);

  if (existingItem) {
    // Có rồi thì cộng dồn
    await cartRepo.incrementItemQty(cartId, productId, quantity);
    return "Đã cập nhật cộng dồn số lượng món ăn!";
  } else {
    // Chưa có thì nhét thêm vào
    await cartRepo.addCartItem(cartId, productId, quantity);
    return "Đã thêm món mới vào giỏ hàng!";
  }
};

exports.getCart = async (userId) => {
  return await cartRepo.getCartDetails(userId);
};

exports.clearCart = async (userId) => {
  const cart = await cartRepo.findCartByUserId(userId);
  if (cart) {
    await cartRepo.clearCartItems(cart.id);
  }
  return "Đã xóa toàn bộ giỏ hàng!";
};

exports.removeFromCart = async (userId, productId) => {
  const cart = await cartRepo.findCartByUserId(userId);
  if (cart) {
    await cartRepo.deleteCartItem(cart.id, productId);
    return "Đã xóa món ăn khỏi giỏ hàng!";
  }
  const error = new Error("Không tìm thấy giỏ hàng!");
  error.statusCode = 404;
  throw error;
};
