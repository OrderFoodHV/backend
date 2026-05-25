const db = require("../../config/db");

exports.getSystemStats = async () => {
  const totalUsers = await db("users").count("id as count").first();
  const totalOrders = await db("orders").count("id as count").first();
  return { totalUsers: totalUsers.count, totalOrders: totalOrders.count };
};

exports.updateFeeSetting = async (type, value) => {
  return await db("fee_settings")
    .where({ fee_type: type })
    .update({ fee_value: value });
};

exports.findAllDisputes = async () => {
  return await db("disputes").select("*");
};
