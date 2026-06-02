require("dotenv").config();
const db = require("./config/db");

db.raw("SELECT 1+1 AS result")
  .then(([rows]) => {
    console.log("DB Connection OK! Result:", rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  });
