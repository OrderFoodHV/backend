const cartRepo = require("../repositories/cart.repository");
const db = require("../../config/db");

exports.addToCart = async (userId, productId, quantity) => {
  // Kiểm tra trùng quán trước khi thêm
  const cartDetails = await cartRepo.getCartDetails(userId);
  if (cartDetails && cartDetails.length > 0) {
    const products = await db("products").where({ id: productId }).select("store_id").first();
    if (products) {
      const newStoreId = products.store_id;
      const hasConflict = cartDetails.some(item => Number(item.store_id) !== Number(newStoreId));
      if (hasConflict) {
        const error = new Error("Giỏ hàng của sếp đang có món từ quán khác. Không thể thêm món từ hai quán khác nhau!");
        error.statusCode = 400;
        throw error;
      }
    }
  }

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

exports.updateCartItem = async (userId, productId, quantity) => {
  const cart = await cartRepo.findCartByUserId(userId);
  if (!cart) {
    const error = new Error("Không tìm thấy giỏ hàng!");
    error.statusCode = 404;
    throw error;
  }
  await cartRepo.updateItemQty(cart.id, productId, quantity);
  return "Đã cập nhật số lượng món ăn!";
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
