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
