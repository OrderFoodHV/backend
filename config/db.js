const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host:     process.env.DB_HOST || "localhost",
  user:     process.env.DB_USER || "root",
  password: process.env.DB_PASS || "1234",
  database: process.env.DB_NAME || "food_app",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Kiểm tra kết nối khi khởi động
db.getConnection()
  .then((conn) => {
    console.log("✅ Connected to MySQL");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });

module.exports = db;
