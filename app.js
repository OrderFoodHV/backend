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

  // Nhận tọa độ cập nhật từ Shipper
  socket.on("update_shipper_location", async (data) => {
    const db = require("./config/db");
    const { userId, latitude, longitude } = data;
    if (userId && latitude && longitude) {
      await db("shippers")
        .where({ user_id: userId })
        .update({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          updated_at: db.fn.now()
        })
        .catch(err => console.error("Lỗi cập nhật vị trí shipper qua socket:", err));
    }
  });

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

// ── Tải ảnh lên và phục vụ ảnh tĩnh ──
const path = require("path");
const fs = require("fs");
const multer = require("multer");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn ảnh!" });
    }
    const host = req.get("host");
    const protocol = req.protocol;
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    
    return res.status(200).json({
      success: true,
      message: "Tải ảnh lên thành công!",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return res.status(500).json({ success: false, message: "Lỗi upload ảnh!" });
  }
});

// Middleware Xử lý lỗi (Luôn để cuối)
app.use(require("./src/middlewares/errorHandler"));

server.listen(3000, () => {
  console.log("Server đang chạy tại port 3000 🚀");
});
