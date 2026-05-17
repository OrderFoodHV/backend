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

    console.log("🍔 Đang đổ bộ 24 món ăn siêu ngon từ SQL của sếp vào DB...");
    await db("products").insert([
      // ===== SNACKS (category_id = 1) =====
      {
        store_id: 1,
        category_id: 1,
        name: "Khoai lang kén",
        image:
          "https://cdn.tgdd.vn/Files/2020/08/26/1284970/cach-lam-khoai-lang-ken-202008261116040688.jpg",
        price: 20000,
        description: "Khoai lang chiên giòn, ngọt nhẹ.",
      },
      {
        store_id: 1,
        category_id: 1,
        name: "Bánh tráng nướng",
        image:
          "https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-trang-nuong-thumbnail.jpg",
        price: 25000,
        description: "Bánh tráng nướng giòn, topping đầy đủ.",
      },
      {
        store_id: 1,
        category_id: 1,
        name: "Chả cá viên chiên",
        image:
          "https://cdn.tgdd.vn/Files/2020/09/21/1295317/cach-lam-ca-vien-chien.jpg",
        price: 22000,
        description: "Cá viên dai ngon, chiên vàng giòn.",
      },
      {
        store_id: 1,
        category_id: 1,
        name: "Đậu phộng rang muối",
        image:
          "https://cdn.tgdd.vn/Files/2021/06/23/1363475/cach-rang-dau-phong.jpg",
        price: 15000,
        description: "Đậu phộng rang giòn, mặn nhẹ.",
      },
      {
        store_id: 1,
        category_id: 1,
        name: "Bắp xào bơ",
        image:
          "https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/bap-xao-thumbnail.jpg",
        price: 25000,
        description: "Bắp xào bơ thơm béo, thêm hành phi.",
      },
      {
        store_id: 1,
        category_id: 1,
        name: "Khô bò miếng",
        image: "https://cdn.tgdd.vn/Files/2021/12/02/1402570/kho-bo-mieng.jpg",
        price: 40000,
        description: "Khô bò cay nhẹ, dai ngon.",
      },
      {
        store_id: 1,
        category_id: 1,
        name: "Bánh flan",
        image: "https://cdn.tgdd.vn/2021/05/CookProductThumb/banh-flan.jpg",
        price: 15000,
        description: "Flan mềm mịn, béo ngậy caramel.",
      },
      {
        store_id: 1,
        category_id: 1,
        name: "Rong biển sấy",
        image: "https://cdn.tgdd.vn/Files/2021/07/12/1368428/rong-bien-say.jpg",
        price: 20000,
        description: "Rong biển giòn tan, vị mặn nhẹ.",
      },

      // ===== FAST FOOD (category_id = 2) =====
      {
        store_id: 1,
        category_id: 2,
        name: "Cơm chiên dương châu",
        image:
          "https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-chien-duong-chau.jpg",
        price: 45000,
        description: "Cơm chiên đầy đủ topping, đậm đà.",
      },
      {
        store_id: 1,
        category_id: 2,
        name: "Hủ tiếu Nam Vang",
        image:
          "https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/hu-tieu-nam-vang.jpg",
        price: 50000,
        description: "Hủ tiếu nước trong, topping phong phú.",
      },
      {
        store_id: 1,
        category_id: 2,
        name: "Bánh mì thịt nướng",
        image:
          "https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-mi-thit-nuong.jpg",
        price: 30000,
        description: "Bánh mì giòn, thịt nướng thơm lừng.",
      },
      {
        store_id: 1,
        category_id: 2,
        name: "Bún thịt nướng",
        image:
          "https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/bun-thit-nuong.jpg",
        price: 45000,
        description: "Bún tươi ăn kèm thịt nướng và rau.",
      },
      {
        store_id: 1,
        category_id: 2,
        name: "Cơm bò lúc lắc",
        image:
          "https://cdn.tgdd.vn/2021/10/CookRecipe/Avatar/com-bo-luc-lac.jpg",
        price: 65000,
        description: "Bò mềm, xào đậm vị, ăn với cơm nóng.",
      },
      {
        store_id: 1,
        category_id: 2,
        name: "Mì cay Hàn Quốc",
        image: "https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/mi-cay.jpg",
        price: 55000,
        description: "Mì cay cấp độ, topping đa dạng.",
      },
      {
        store_id: 1,
        category_id: 2,
        name: "Cơm gà nướng",
        image: "https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-ga-nuong.jpg",
        price: 55000,
        description: "Gà nướng thơm, da giòn, cơm nóng.",
      },
      {
        store_id: 1,
        category_id: 2,
        name: "Bún riêu cua",
        image: "https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/bun-rieu.jpg",
        price: 40000,
        description: "Bún riêu chua nhẹ, đậm đà.",
      },

      // ===== DRINKS (category_id = 3) =====
      {
        store_id: 1,
        category_id: 3,
        name: "Trà tắc",
        image: "https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-tac.jpg",
        price: 15000,
        description: "Trà tắc chua ngọt, giải khát.",
      },
      {
        store_id: 1,
        category_id: 3,
        name: "Sữa chua đá",
        image: "https://cdn.tgdd.vn/2021/05/CookProductThumb/sua-chua-da.jpg",
        price: 20000,
        description: "Sữa chua mát lạnh, tốt cho tiêu hóa.",
      },
      {
        store_id: 1,
        category_id: 3,
        name: "Sinh tố dâu",
        image: "https://cdn.tgdd.vn/2020/07/CookProductThumb/sinh-to-dau.jpg",
        price: 30000,
        description: "Sinh tố dâu chua ngọt, thơm ngon.",
      },
      {
        store_id: 1,
        category_id: 3,
        name: "Nước ép táo",
        image: "https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-tao.jpg",
        price: 30000,
        description: "Nước ép táo tươi, giàu vitamin.",
      },
      {
        store_id: 1,
        category_id: 3,
        name: "Cacao đá",
        image: "https://cdn.tgdd.vn/2021/05/CookProductThumb/cacao-da.jpg",
        price: 30000,
        description: "Cacao đá béo, đậm vị socola.",
      },
      {
        store_id: 1,
        category_id: 3,
        name: "Trà vải",
        image: "https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-vai.jpg",
        price: 30000,
        description: "Trà vải thơm, ngọt nhẹ.",
      },
      {
        store_id: 1,
        category_id: 3,
        name: "Soda chanh",
        image: "https://cdn.tgdd.vn/2020/07/CookProductThumb/soda-chanh.jpg",
        price: 25000,
        description: "Soda chanh mát lạnh, sảng khoái.",
      },
      {
        store_id: 1,
        category_id: 3,
        name: "Nước ép dứa",
        image: "https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-dua.jpg",
        price: 30000,
        description: "Nước ép dứa chua ngọt tự nhiên.",
      },
    ]);

    console.log("✅ DỮ LIỆU ĐÃ LÊN ĐẠN THÀNH CÔNG! SẴN SÀNG KHAI HỎA!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi bơm dữ liệu, sếp kiểm tra lại nhé:", error);
    process.exit(1);
  }
}

seedData();
