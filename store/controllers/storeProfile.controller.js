// store/controllers/storeProfile.controller.js
const db = require("../../config/db"); // Đảm bảo đường dẫn db đúng
const { geocodeAddress } = require("../../src/utils/distanceHelper");

exports.registerStore = async (req, res) => {
  try {
    const userId = req.user.id;
    let { store_name, address, phone, latitude, longitude } = req.body;

    // Tự động giải mã địa chỉ thành tọa độ nếu Frontend không truyền
    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
      const coords = await geocodeAddress(address);
      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
    }

    // 1. Kiểm tra xem user này đã có quán chưa (Tránh lỗi Duplicate 500)
    const existingStore = await db("stores")
      .where({ owner_id: userId })
      .first();

    if (existingStore) {
      // Đã có rồi thì update lại tên và địa chỉ, đồng thời chuyển trạng thái về pending
      await db("stores").where({ owner_id: userId }).update({
        name: store_name,
        address: address,
        phone: phone,
        latitude: latitude !== undefined ? latitude : null,
        longitude: longitude !== undefined ? longitude : null,
        status: "pending",
      });
    } else {
      // Chưa có thì tạo mới ở trạng thái pending
      await db("stores").insert({
        owner_id: userId,
        name: store_name,
        address: address,
        phone: phone,
        latitude: latitude !== undefined ? latitude : null,
        longitude: longitude !== undefined ? longitude : null,
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
    let { name, address, phone, latitude, longitude } = req.body;

    // Tự động giải mã địa chỉ thành tọa độ nếu Frontend không truyền
    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
      const coords = await geocodeAddress(address);
      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      }
    }

    // Cập nhật bảng stores
    await db("stores")
      .where({ owner_id: userId })
      .update({
        name: name,
        address: address,
        phone: phone,
        latitude: latitude !== undefined ? latitude : undefined,
        longitude: longitude !== undefined ? longitude : undefined,
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
