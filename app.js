require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Cấu hình Socket.io
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] },
});
global._io = io;

// Kết nối DB
require("./config/db");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket Events
global._io.on("connection", (socket) => {
  console.log(`🔌 Thiết bị kết nối: ${socket.id}`);

  // Đăng ký nhận thông báo theo Vai trò / ID tương ứng
  socket.on("register_store", (storeId) =>
    socket.join(`store_room_${storeId}`),
  );
  socket.on("register_user", (userId) => socket.join(`user_room_${userId}`));

  // 🌟 THÊM: Tài xế bật Trực tuyến thì cho vào phòng chung của Shipper để hứng đơn mới
  socket.on("register_shipper", () => socket.join("shipper_global_room"));

  // 🌟 THÊM: Khi Khách/Quán/Xế mở màn hình theo dõi đơn, bắt buộc phải vào phòng riêng của đơn đó
  socket.on("join_order_room", (data) => {
    socket.join(`order_room_${data.orderId}`);
    console.log(`📦 Đã nối bộ đàm vào phòng: order_room_${data.orderId}`);
  });

  socket.on("disconnect", () => console.log(`❌ Ngắt kết nối: ${socket.id}`));
});

// ====================================================
// ROUTES - CHỈ DÙNG 1 KIỂU ĐƯỜNG DẪN (KHÔNG CÓ /API)
// ====================================================
// Sếp dùng kiểu này thì ở Frontend sếp gọi thẳng: URL_API + "/auth/login"
app.use("/auth", require("./src/routes/auth.routes"));
app.use("/users", require("./src/routes/user.routes"));
app.use("/products", require("./src/routes/product.routes"));
app.use("/carts", require("./src/routes/cart.routes"));
app.use("/orders", require("./src/routes/order.routes"));
app.use("/tracking", require("./src/routes/ordertracking.routes"));
app.use("/payments", require("./src/routes/payment.routes"));
app.use("/shippers", require("./src/routes/shipper.routes")); // <--- Route Shipper chuẩn
app.use("/reviews", require("./src/routes/review.routes"));
app.use("/vouchers", require("./src/routes/voucher.routes"));
app.use("/notifications", require("./src/routes/notifications.routes"));

// Phân hệ Store & Admin
app.use("/store", require("./store/routes/index.js"));
app.use("/admin", require("./src/routes/admin.routes"));

// Middleware Xử lý lỗi (Luôn để cuối)
app.use(require("./src/middlewares/errorHandler"));

server.listen(3000, () => {
  console.log("Server đang chạy tại port 3000 🚀");
});
