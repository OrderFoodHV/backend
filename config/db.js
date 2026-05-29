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
  .then(async () => {
    console.log("✅ Knex đã kết nối MySQL thành công!");
    try {
      const hasServiceFee = await db.schema.hasColumn("orders", "service_fee");
      if (!hasServiceFee) {
        await db.schema.table("orders", (table) => {
          table.decimal("service_fee", 10, 2).defaultTo(0.00);
        });
        console.log("🛠️  Tự động thêm cột 'service_fee' vào bảng 'orders' thành công!");
      }
    } catch (err) {
      console.error("❌ Lỗi tự động nâng cấp cấu trúc bảng orders:", err);
    }
  })
  .catch((err) => console.log("❌ Lỗi kết nối Knex:", err));

// 🌟 BÙA HỘ MỆNH TINH KHIẾT: Trả về nguyên bản mảng kép [rows, fields]
// Giúp cú pháp bóc tách mảng "const [rows] = ..." ở tất cả các file middleware/service chạy mượt 100%
db.query = function (sql, params) {
  return db.raw(sql, params);
};

module.exports = db;
