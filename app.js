require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Kết nối DB
require("./config/db");

// Middlewares cơ bản
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================================================
// 📱 PHÂN HỆ 1: API DÀNH CHO KHÁCH HÀNG VÀ HỆ THỐNG
// ====================================================
app.use("/auth", require("./src/routes/auth.routes"));
app.use("/api/users", require("./src/routes/user.routes"));
app.use("/products", require("./src/routes/product.routes"));
app.use("/carts", require("./src/routes/cart.routes"));
app.use("/orders", require("./src/routes/order.routes"));
app.use("/tracking", require("./src/routes/ordertracking.routes"));
app.use("/payments", require("./src/routes/payment.routes"));
app.use("/shippers", require("./src/routes/shipper.routes"));
app.use("/reviews", require("./src/routes/review.routes"));
app.use("/vouchers", require("./src/routes/voucher.routes"));
app.use("/notifications", require("./src/routes/notifications.routes"));

// ====================================================
// 🏪 PHÂN HỆ 2: API DÀNH RIÊNG CHO CHỦ QUÁN (MERCHANT)
// ====================================================
const storeRoutes = require("./store/routes/index.js");
app.use("/api/store", storeRoutes); // 🌟 ĐÃ KÍCH HOẠT API SHOP Ở ĐÂY!

// ====================================================
// 🛡️ PHÂN HỆ 3: MIDDLEWARE XỬ LÝ LỖI (BẮT BUỘC ĐỂ CUỐI)
// ====================================================
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

// Mở cổng Server
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});
