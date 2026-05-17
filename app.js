require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// connect DB
require("./config/db");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// thêm ở đây
const authRoutes = require("./src/routes/auth.routes");
app.use("/auth", authRoutes);
/* 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("API is running 🚀");
}); */
const cartRoutes = require("./src/routes/cart.routes");
app.use("/carts", cartRoutes);
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);
const orderRoutes = require("./src/routes/order.routes");
app.use("/orders", orderRoutes);
const ordertrackingRoutes = require("./src/routes/ordertracking.routes");
app.use("/tracking", ordertrackingRoutes);
const productRoutes = require("./src/routes/product.routes");
app.use("/products", productRoutes);
const userRoutes = require("./src/routes/user.routes");
app.use("/api/users", userRoutes);
const paymentRoutes = require("./src/routes/payment.routes");
app.use("/payments", paymentRoutes);
const shipperRoutes = require("./src/routes/shipper.routes");
app.use("/shippers", shipperRoutes);
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
