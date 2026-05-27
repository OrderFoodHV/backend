const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync"); // Gậy thần bắt lỗi

exports.register = catchAsync(async (req, res, next) => {
  console.log("🧨 DATA FRONTEND GỬI LÊN LÀ:", req.body);
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

  // Tìm xem user này có cửa hàng nào không
  const db = require("../../config/db");
  const [stores] = await db.query("SELECT id, name, address, phone, status FROM stores WHERE owner_id = ?", [
    user.id,
  ]);
  const currentStore = stores.length > 0 ? stores[0] : null;

  // Tìm xem user này có đăng ký shipper không
  const [shippers] = await db.query("SELECT id, status, phone, vehicle FROM shippers WHERE user_id = ?", [
    user.id,
  ]);
  const currentShipper = shippers.length > 0 ? shippers[0] : null;

  // Trả về form chuẩn
  res.status(200).json({
    status: "success",
    message: "Đăng nhập thành công!",
    data: {
      user: {
        id: user.id,
        name: user.name || user.user_name,
        phone: user.phone || (currentStore ? currentStore.phone : ""),
        email: user.email,
        role: user.role,
        is_shipper: user.is_shipper || 0,
        is_seller: user.is_seller || 0,
        storeId: currentStore ? currentStore.id : null,
        storeName: currentStore ? currentStore.name : null,
        storeAddress: currentStore ? currentStore.address : null,
        storeStatus: currentStore ? currentStore.status : null,
        shipperStatus: currentShipper ? currentShipper.status : null,
        vehicle: currentShipper ? currentShipper.vehicle : null,
        shipperPhone: currentShipper ? currentShipper.phone : null,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  });
});
