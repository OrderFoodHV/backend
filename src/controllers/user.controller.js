const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Lấy từ Token
  const user = await userService.getProfile(userId);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const message = await userService.updateProfile(userId, req.body);

  res.status(200).json({
    status: "success",
    message: message,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Bóc tách id từ Token người dùng đăng nhập
  const message = await userService.deleteAccount(userId);

  res.status(200).json({
    status: "success",
    message: message,
  });
});

const db = require("../../config/db");

exports.getAddresses = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.query(
    "SELECT id, address as detail, 'Địa chỉ' as title, is_default FROM user_address WHERE user_id = ? ORDER BY is_default DESC, id DESC",
    [userId]
  );
  res.status(200).json({ status: "success", data: rows });
});

exports.addAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { address } = req.body;

  const [result] = await db.query(
    "INSERT INTO user_address (user_id, address) VALUES (?, ?)",
    [userId, address]
  );

  res.status(201).json({
    status: "success",
    message: "Thêm địa chỉ thành công!",
    data: { id: result.insertId, detail: address, title: "Địa chỉ", is_default: 0 }
  });
});

exports.updateAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { address } = req.body;

  await db.query(
    "UPDATE user_address SET address = ? WHERE id = ? AND user_id = ?",
    [address, id, userId]
  );

  res.status(200).json({ status: "success", message: "Cập nhật địa chỉ thành công!" });
});

exports.setDefaultAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  // 1. Reset all addresses of this user to 0
  await db.query(
    "UPDATE user_address SET is_default = 0 WHERE user_id = ?",
    [userId]
  );

  // 2. Set chosen address to 1
  await db.query(
    "UPDATE user_address SET is_default = 1 WHERE id = ? AND user_id = ?",
    [id, userId]
  );

  res.status(200).json({
    status: "success",
    message: "Đã đặt địa chỉ làm mặc định!",
  });
});

exports.getFavorites = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.query(
    "SELECT f.id as favorite_id, p.* FROM favorite f JOIN products p ON f.product_id = p.id WHERE f.user_id = ?",
    [userId]
  );
  res.status(200).json({
    status: "success",
    data: rows,
  });
});

exports.addFavorite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({
      status: "fail",
      message: "Thiếu product_id!",
    });
  }

  try {
    await db.query(
      "INSERT INTO favorite (user_id, product_id) VALUES (?, ?)",
      [userId, product_id]
    );
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      throw err;
    }
  }

  res.status(201).json({
    status: "success",
    message: "Đã thêm vào danh sách yêu thích!",
  });
});

exports.removeFavorite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  await db.query(
    "DELETE FROM favorite WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );

  res.status(200).json({
    status: "success",
    message: "Đã xóa khỏi danh sách yêu thích!",
  });
});

