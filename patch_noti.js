require('dotenv').config();
const db = require('./config/db');

async function migrate() {
  try {
    const [cols] = await db.raw("SHOW COLUMNS FROM notifications LIKE 'target_role'");
    if (cols.length === 0) {
      await db.raw("ALTER TABLE notifications ADD COLUMN target_role VARCHAR(50) DEFAULT 'user'");
      console.log("Added target_role to notifications");
    } else {
      console.log("Column target_role already exists");
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
migrate();
