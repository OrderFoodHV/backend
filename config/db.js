const knex = require("knex");

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 2, max: 10 },
});

db.raw("SELECT 1")
  .then(() => console.log("✅ Knex đã kết nối MySQL thành công!"))
  .catch((err) => console.log("❌ Lỗi kết nối Knex:", err));

// 🌟 BÙA HỘ MỆNH TINH KHIẾT: Trả về nguyên bản mảng kép [rows, fields]
// Giúp cú pháp bóc tách mảng "const [rows] = ..." ở tất cả các file middleware/service chạy mượt 100%
db.query = function (sql, params) {
  return db.raw(sql, params);
};

module.exports = db;
