require("dotenv").config();
const db = require("./config/db");

async function seedData() {
  try {
    console.log("🧹 Đang dọn dẹp nhà kho cũ...");
    await db("cart_items")
      .del()
      .catch(() => {});
    await db("products")
      .del()
      .catch(() => {});
    await db("users")
      .del()
      .catch(() => {});
    // Thêm xóa stores và categories (nếu sếp có bảng này) để tránh lỗi Khóa ngoại
    await db("stores")
      .del()
      .catch(() => {});
    await db("categories")
      .del()
      .catch(() => {});

    console.log("👤 Đang tạo tài khoản khách và Shipper...");
    await db("users").insert([
      {
        id: 3,
        name: "Thu Hoài",
        email: "hoai.inorder@gmail.com",
        password: "123",
        role: "customer",
      },
      {
        id: 4,
        name: "Khách Hàng",
        email: "khach@gmail.com",
        password: "123",
        role: "customer",
      },
      {
        id: 5,
        name: "Anh Shipper",
        email: "ship@gmail.com",
        password: "123",
        role: "shipper",
      },
    ]);

    console.log(
      "🏪 Đang tạo Cửa hàng và Danh mục mồi (Để không bị lỗi store_id, category_id)...",
    );
    // Vì sản phẩm của sếp có store_id và category_id, nên phải tạo 2 cái này trước để tránh lỗi Foreign Key
    await db("stores")
      .insert([
        {
          id: 1,
          name: "InOrder Chính Hãng",
          address: "Đại học Xây Dựng (HUCE)",
        },
      ])
      .catch(() =>
        console.log("⚠️ Bỏ qua tạo Store do bảng chưa tồn tại hoặc đã có."),
      );

    await db("categories")
      .insert([
        { id: 1, name: "Snacks" },
        { id: 2, name: "Fast Food" },
        { id: 3, name: "Drinks" },
      ])
      .catch(() =>
        console.log("⚠️ Bỏ qua tạo Category do bảng chưa tồn tại hoặc đã có."),
      );

    console.log("🍔 Đã bỏ qua việc nạp món ăn mẫu để cơ sở dữ liệu sạch...");
    // Bỏ qua nạp sản phẩm mẫu theo yêu cầu làm sạch
    await db("products").insert([]);

    console.log("✅ DỮ LIỆU ĐÃ LÊN ĐẠN THÀNH CÔNG! SẴN SÀNG KHAI HỎA!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi bơm dữ liệu, sếp kiểm tra lại nhé:", error);
    process.exit(1);
  }
}

seedData();
