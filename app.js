const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// connect DB
require("./config/db");

app.use(cors());
app.use(express.json());

// thêm ở đây
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
const productRoutes = require("./routes/product.routes");
app.use("/products", productRoutes);
const cartRoutes = require("./routes/cart.routes");
app.use("/carts", cartRoutes);
const orderRoutes = require("./routes/order.routes");
app.use("/orders", orderRoutes);
const paymentRoutes = require("./routes/payment.routes");
app.use("/payments", paymentRoutes);
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
