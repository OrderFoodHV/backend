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
    "SELECT id, address as detail, 'Địa chỉ' as title FROM user_address WHERE user_id = ? ORDER BY id DESC",
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
    data: { id: result.insertId, detail: address, title: "Địa chỉ" }
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
