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
      // Đã có rồi thì update lại tên và địa chỉ, đồng thời chuyển trạng thái về pending
      await db("stores").where({ owner_id: userId }).update({
        name: store_name,
        address: address,
        status: "pending",
      });
    } else {
      // Chưa có thì tạo mới ở trạng thái pending
      await db("stores").insert({
        owner_id: userId,
        name: store_name,
        address: address,
        status: "pending",
      });
    }

    res.status(201).json({
      success: true,
      message: "Gửi yêu cầu đăng ký mở quán thành công! Vui lòng chờ Admin phê duyệt.",
      storeStatus: "pending",
    });
  } catch (error) {
    console.error("Lỗi đăng ký quán:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};

exports.updateStoreProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, phone } = req.body;

    // Cập nhật bảng stores
    await db("stores")
      .where({ owner_id: userId })
      .update({
        name: name,
        address: address,
        phone: phone,
      });

    // Cập nhật phone bảng users
    await db("users")
      .where({ id: userId })
      .update({
        phone: phone,
      });

    const updatedStore = await db("stores").where({ owner_id: userId }).first();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin cửa hàng thành công!",
      storeId: updatedStore.id,
      storeName: updatedStore.name,
      storeAddress: updatedStore.address,
      phone: updatedStore.phone,
    });
  } catch (error) {
    console.error("Lỗi cập nhật quán:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống!" });
  }
};
