const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // nếu có thì điền
  database: "food_app",
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});

module.exports = db;
