const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// connect DB
require("./config/db");

app.use(cors());
app.use(express.json());

// thêm ở đây
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);
const cartRoutes = require("./routes/cart.routes");
app.use("/api/carts", cartRoutes);
const orderRoutes = require("./routes/order.routes");
app.use("/api/orders", orderRoutes);
const paymentRoutes = require("./routes/payment.routes");
app.use("/api/payments", paymentRoutes);

// Thêm routes mới
const voucherRoutes = require("./routes/voucher.routes");
app.use("/api/vouchers", voucherRoutes);
const rewardRoutes = require("./routes/reward.routes");
app.use("/api/rewards", rewardRoutes);
const notificationRoutes = require("./routes/notification.routes");
app.use("/api/notifications", notificationRoutes);
const reviewRoutes = require("./routes/review.routes");
app.use("/api/reviews", reviewRoutes);
const cancelRoutes = require("./routes/cancel.routes");
app.use("/api/cancel", cancelRoutes);
const reorderRoutes = require("./routes/reorder.routes");
app.use("/api/reorder", reorderRoutes);
const favoriteRoutes = require("./routes/favorite.routes");
app.use("/api/favorites", favoriteRoutes);

// Admin routes - Tách biệt trong thư mục riêng
const adminRoutes = require("./admin/routes");
app.use("/api/admin", adminRoutes);

// Store routes cho chủ cửa hàng
const storeRoutes = require("./store/routes");
app.use("/api/store", storeRoutes);

// Serve admin-web tại /admin
app.use("/admin", express.static(path.join(__dirname, "../admin-web")));

app.get("/", (req, res) => {
  res.send("API is running 🚀 | Admin: http://localhost:3000/admin");
});

// Middleware xử lý lỗi tập trung — phải đặt SAU tất cả routes
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
