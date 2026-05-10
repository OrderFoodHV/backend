/**
 * scripts/migrate.js
 * Chạy: node scripts/migrate.js
 *
 * Script này:
 *  1. Xóa và tạo lại database food_app
 *  2. Chạy toàn bộ schema từ schema.sql
 *  3. Tạo admin user với password được bcrypt hash
 */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  multipleStatements: true, // cần để chạy nhiều câu SQL một lúc
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@foodapp.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";
const ADMIN_NAME = "Admin";

async function migrate() {
  let conn;
  try {
    console.log("🔌 Kết nối MySQL...");
    conn = await mysql.createConnection(DB_CONFIG);

    // Đọc schema SQL
    const schemaPath = path.join(__dirname, "../schema.sql");
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Không tìm thấy file schema: ${schemaPath}`);
    }
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("🗃️  Chạy schema SQL...");
    await conn.query(sql);
    console.log("✅ Schema đã được tạo thành công.");

    // Tạo admin user với password bcrypt
    console.log(`👤 Tạo admin user: ${ADMIN_EMAIL}`);
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Chuyển sang database food_app để insert
    await conn.query("USE food_app");
    await conn.query(
      "INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'admin', 'active') ON DUPLICATE KEY UPDATE name = VALUES(name)",
      [ADMIN_NAME, ADMIN_EMAIL, hash]
    );

    // Lấy admin user id vừa tạo để tạo store mẫu
    const [adminRows] = await conn.query("SELECT id FROM users WHERE email = ?", [ADMIN_EMAIL]);
    const adminId = adminRows[0].id;

    // Cập nhật owner_id của store mẫu
    await conn.query("UPDATE stores SET owner_id = ? WHERE name = 'Food App Store'", [adminId]);

    console.log("✅ Admin user đã được tạo.");
    console.log("─".repeat(40));
    console.log(`📧 Email    : ${ADMIN_EMAIL}`);
    console.log(`🔑 Password : ${ADMIN_PASSWORD}`);
    console.log("─".repeat(40));
    console.log("🎉 Migration hoàn tất!");
  } catch (err) {
    console.error("❌ Migration thất bại:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

migrate();
