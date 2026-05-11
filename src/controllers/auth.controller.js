const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync"); // Gậy thần bắt lỗi

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    const error = new Error("Vui lòng điền đủ thông tin!");
    error.statusCode = 400;
    throw error;
  }

  // Đẩy sang Service làm hết
  const newUserId = await authService.registerUser(
    name,
    email,
    password,
    phone,
  );

  // Trả về đúng 1 Form chuẩn hoá
  res.status(201).json({
    status: "success",
    message: "Tạo tài khoản thành công!",
    data: { id: newUserId },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Vui lòng nhập đủ email và mật khẩu!");
    error.statusCode = 400;
    throw error;
  }

  // Đẩy sang Service xử lý
  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password,
  );

  // Trả về form chuẩn
  res.status(200).json({
    status: "success",
    message: "Đăng nhập thành công!",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  });
});
