const productService = require("../services/product.service");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res, next) => {
  const products = await productService.getAllProducts();

  res.status(200).json({
    status: "success",
    data: products,
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Lấy ID từ trên URL
  const product = await productService.getProductById(id);

  res.status(200).json({
    status: "success",
    data: product,
  });
});
