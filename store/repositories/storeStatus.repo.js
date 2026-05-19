const db = require("../../config/db");

exports.updateStoreStatus = async (storeId, newStatus) => {
  const [result] = await db.query(
    "UPDATE stores SET is_open = ? WHERE id = ?",
    [newStatus, storeId]
  );
  return result;
};
