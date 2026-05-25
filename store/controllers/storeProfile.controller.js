// store/controllers/storeProfile.controller.js
const db = require("../../config/db"); // Đảm bảo đường dẫn db đúng

exports.registerStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { store_name, address } = req.body;

    // 1. Kiểm tra xem user này đã có quán chưa (Tránh lỗi Duplicate 500)
    const existingStore = await db("stores")
      .where({ owner_id: userId })
      .first();

    if (existingStore) {
      // Đã có rồi thì update lại tên và địa chỉ
      await db("stores").where({ owner_id: userId }).update({
        name: store_name,
        address: address,
      });
    } else {
      // Chưa có thì tạo mới
      await db("stores").insert({
        owner_id: userId,
        name: store_name,
        address: address,
        status: "active", // Tạm thời cho active luôn để test
      });
    }

    // 2. Cập nhật quyền is_seller trong bảng users
    await db("users").where({ id: userId }).update({ is_seller: 1 });

    res
      .status(201)
      .json({ success: true, message: "Đăng ký mở quán thành công!" });
  } catch (error) {
    console.error("Lỗi đăng ký quán:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};
