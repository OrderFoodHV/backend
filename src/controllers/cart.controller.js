const cartService = require("../services/cart.service");
const catchAsync = require("../utils/catchAsync");

exports.addToCart = catchAsync(async (req, res, next) => {
  // Lấy ID khách từ Token (Nhờ middleware verifyToken)
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    const error = new Error("Thiếu mã sản phẩm hoặc số lượng!");
    error.statusCode = 400;
    throw error;
  }

  const message = await cartService.addToCart(userId, product_id, quantity);

  res.status(200).json({
    status: "success",
    message: message,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const cartItems = await cartService.getCart(userId);

  res.status(200).json({
    status: "success",
    data: cartItems,
  });
});
