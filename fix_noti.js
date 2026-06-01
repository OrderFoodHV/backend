require('dotenv').config();
const db = require('./config/db');

async function fix() {
  try {
    // Hide old poisoned notifications from the user view by changing their target_role to 'legacy'
    await db.raw("UPDATE notifications SET target_role = 'legacy'");
    console.log("Old notifications hidden.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
fix();
