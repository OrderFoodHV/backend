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

const db = require("../../config/db");

exports.getCategories = catchAsync(async (req, res, next) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE status = 'active' ORDER BY created_at DESC"
  );
  res.status(200).json({
    status: "success",
    data: rows,
  });
});

exports.getFees = catchAsync(async (req, res, next) => {
  const [rows] = await db.query(
    "SELECT * FROM fee_settings WHERE status = 'active'"
  );
  res.status(200).json({
    status: "success",
    data: rows,
  });
});
