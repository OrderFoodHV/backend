const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (name, email, password, phone) => {
  // 1. Check trùng email
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const err = new Error("Email này đã được sử dụng!");
    err.statusCode = 400;
    throw err; // Ném thẳng ra ngoài cho Middleware hứng
  }

  // 2. Băm pass
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Gọi Repos lưu vào DB
  const newUserId = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "user",
    status: "active",
  });

  return newUserId;
};

exports.loginUser = async (email, password) => {
  // 1. Tìm user qua Repository
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Email không tồn tại!");
    error.statusCode = 404;
    throw error;
  }

  // 2. So sánh mật khẩu băm
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Sai mật khẩu!");
    error.statusCode = 400;
    throw error;
  }

  // 3. Tạo Token
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      is_shipper: user.is_shipper || 0,
      is_seller: user.is_seller || 0,
    }, // Payload token có thêm is_shipper và is_seller để frontend dễ dàng phân quyền hiển thị giao diện
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    // Hoặc tạo 1 REFRESH_SECRET riêng trong .env
    expiresIn: "30d",
  });

  return { user, accessToken, refreshToken };
};
