require('dotenv').config();
const db = require('./config/db');

async function run() {
  try {
    await db.raw(`
      CREATE TABLE IF NOT EXISTS \`order_reviews\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`order_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        \`store_id\` int NOT NULL,
        \`shipper_id\` int DEFAULT NULL,
        
        \`store_rating\` int NOT NULL CHECK (\`store_rating\` >= 1 AND \`store_rating\` <= 5),
        \`store_comment\` text COLLATE utf8mb4_unicode_ci,
        
        \`shipper_rating\` int DEFAULT NULL CHECK (\`shipper_rating\` >= 1 AND \`shipper_rating\` <= 5),
        \`shipper_comment\` text COLLATE utf8mb4_unicode_ci,
        
        \`image_url\` varchar(255) DEFAULT NULL,
        
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`order_id_unique\` (\`order_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // Thêm các cột trung bình đánh giá nếu chưa có
    try {
      await db.raw(`ALTER TABLE \`stores\` ADD COLUMN \`rating\` FLOAT DEFAULT 0.0;`);
      await db.raw(`ALTER TABLE \`stores\` ADD COLUMN \`rating_count\` INT DEFAULT 0;`);
    } catch(e) { console.log('Store rating columns might already exist.'); }
    
    try {
      await db.raw(`ALTER TABLE \`shippers\` ADD COLUMN \`rating\` FLOAT DEFAULT 0.0;`);
      await db.raw(`ALTER TABLE \`shippers\` ADD COLUMN \`rating_count\` INT DEFAULT 0;`);
    } catch(e) { console.log('Shipper rating columns might already exist.'); }

    console.log("Migration thành công!");
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    process.exit();
  }
}

run();
