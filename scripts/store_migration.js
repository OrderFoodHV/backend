/**
 * Migration: Thêm cột và bảng cho Store Management
 * Chạy: node scripts/store_migration.js
 */
const db = require("../config/db");

async function migrate() {
  const conn = await db.getConnection();
  try {
    console.log("🚀 Bắt đầu migration Store Management...\n");

    // 1. Thêm cột is_open vào bảng stores
    console.log("1️⃣  Thêm cột is_open vào bảng stores...");
    try {
      await conn.query("ALTER TABLE stores ADD COLUMN is_open BOOLEAN DEFAULT TRUE");
      console.log("   ✅ Đã thêm cột is_open");
    } catch (err) {
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("   ⏭️  Cột is_open đã tồn tại, bỏ qua");
      } else throw err;
    }

    // 2. Tạo bảng store_vouchers
    console.log("2️⃣  Tạo bảng store_vouchers...");
    await conn.query(`
      CREATE TABLE IF NOT EXISTS store_vouchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        store_id INT NOT NULL,
        code VARCHAR(50) NOT NULL,
        discount_type ENUM('percent', 'fixed') NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_discount DECIMAL(10,2) DEFAULT 0,
        quantity INT NOT NULL DEFAULT 100,
        used_count INT DEFAULT 0,
        start_date DATETIME,
        end_date DATETIME NOT NULL,
        status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE (store_id, code),
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      )
    `);
    console.log("   ✅ Đã tạo bảng store_vouchers");

    // 3. Thêm indexes
    console.log("3️⃣  Thêm indexes...");
    const indexes = [
      { name: "idx_store_vouchers_store", sql: "CREATE INDEX idx_store_vouchers_store ON store_vouchers(store_id, status)" },
      { name: "idx_orders_store", sql: "CREATE INDEX idx_orders_store ON orders(store_id, status)" },
      { name: "idx_stores_owner", sql: "CREATE INDEX idx_stores_owner ON stores(owner_id)" },
    ];
    for (const idx of indexes) {
      try {
        await conn.query(idx.sql);
        console.log(`   ✅ Đã tạo index ${idx.name}`);
      } catch (err) {
        if (err.code === "ER_DUP_KEYNAME") {
          console.log(`   ⏭️  Index ${idx.name} đã tồn tại, bỏ qua`);
        } else throw err;
      }
    }

    console.log("\n🎉 Migration Store Management hoàn tất!");
  } catch (err) {
    console.error("❌ Migration thất bại:", err.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

migrate();
