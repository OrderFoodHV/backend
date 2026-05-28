// src/repositories/product.repository.js
const db = require("../../config/db");

exports.findAll = async () => {
  return await db("products as p")
    .join("stores as s", "p.store_id", "s.id")
    .where("p.available", true)
    .select("p.*", "s.name as store_name", "s.address as store_address");
};

exports.findById = async (id) => {
  return await db("products as p")
    .join("stores as s", "p.store_id", "s.id")
    .where("p.id", id)
    .select("p.*", "s.name as store_name", "s.address as store_address")
    .first();
};
