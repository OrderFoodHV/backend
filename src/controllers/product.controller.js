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

exports.getStoreDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const [rows] = await db.query(
    "SELECT id, name, address, latitude, longitude, phone FROM stores WHERE id = ?",
    [id]
  );
  if (rows && rows.length > 0) {
    res.status(200).json({
      status: "success",
      data: rows[0],
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "Không tìm thấy cửa hàng!",
    });
  }
});
