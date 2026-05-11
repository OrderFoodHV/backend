const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST, // 127.0.0.1
    user: process.env.DB_USER, // root
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // db
  },
  pool: { min: 2, max: 10 }, // Quản lý kết nối tự động, rất xịn cho hiệu năng
});
db.raw("SELECT 1")
  .then(() => console.log("✅ Knex đã kết nối MySQL thành công!"))
  .catch((err) => console.log("❌ Lỗi kết nối Knex:", err));
module.exports = db;
