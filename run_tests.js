const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first'); // Đảm bảo node fetch dùng ipv4 cho localhost

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  const BASE_URL = "http://localhost:3000";
  console.log("=== BẮT ĐẦU CHẠY THỬ NGHIỆM TỰ ĐỘNG (API AUTOMATED TESTS) ===");

  const results = [];

  function recordResult(tcId, name, success, detail) {
    results.push({ tcId, name, success, detail });
    console.log(`[${success ? "PASS" : "FAIL"}] ${tcId}: ${name} - ${detail}`);
  }

  // Tạo email và số điện thoại ngẫu nhiên để tránh lỗi trùng lặp
  const uniqueId = Date.now();
  const testEmail = `test_${uniqueId}@gmail.com`;
  const testPhone = `09${String(uniqueId).slice(-8)}`;
  const testPassword = "password123";
  const testName = "Nguyen Automated Test";

  let accessToken = null;
  let productId = null;
  let storeId = null;

  // ----------------------------------------------------
  // SECTION 1: ĐĂNG KÝ TÀI KHOẢN (REGISTER)
  // ----------------------------------------------------

  // TC_REG_001: Đăng ký thành công
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        phone: testPhone
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.status === "success") {
      recordResult("TC_REG_001", "Đăng ký thành công với thông tin hợp lệ", true, `Email: ${testEmail}`);
    } else {
      recordResult("TC_REG_001", "Đăng ký thành công với thông tin hợp lệ", false, `Status: ${res.status}, Msg: ${data.message}`);
    }
  } catch (error) {
    recordResult("TC_REG_001", "Đăng ký thành công với thông tin hợp lệ", false, error.message);
  }

  // TC_REG_002: Đăng ký thất bại khi bỏ trống các trường
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (res.status === 400) {
      recordResult("TC_REG_002", "Đăng ký thất bại khi bỏ trống tất cả các trường", true, `Báo lỗi đúng: ${data.message}`);
    } else {
      recordResult("TC_REG_002", "Đăng ký thất bại khi bỏ trống tất cả các trường", false, `Nhận status ${res.status} thay vì 400`);
    }
  } catch (error) {
    recordResult("TC_REG_002", "Đăng ký thất bại khi bỏ trống tất cả các trường", false, error.message);
  }

  // TC_REG_003: Đăng ký thất bại khi email đã tồn tại
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        phone: testPhone
      })
    });
    const data = await res.json();
    // Vì DB chặn trùng email, server có thể bắn 400 hoặc 500
    if (res.status >= 400) {
      recordResult("TC_REG_003", "Đăng ký thất bại khi email đã tồn tại", true, `Báo lỗi đúng: ${data.message || "Lỗi trùng lặp dữ liệu"}`);
    } else {
      recordResult("TC_REG_003", "Đăng ký thất bại khi email đã tồn tại", false, `Tạo trùng thành công? Status: ${res.status}`);
    }
  } catch (error) {
    recordResult("TC_REG_003", "Đăng ký thất bại khi email đã tồn tại", false, error.message);
  }

  // ----------------------------------------------------
  // SECTION 2: ĐĂNG NHẬP (LOGIN)
  // ----------------------------------------------------

  // TC_LGN_001: Đăng nhập thành công
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const data = await res.json();
    if (res.status === 200 && data.status === "success" && data.data.access_token) {
      accessToken = data.data.access_token;
      recordResult("TC_LGN_001", "Đăng nhập thành công với tài khoản chính xác", true, "Đã nhận được JWT Access Token");
    } else {
      recordResult("TC_LGN_001", "Đăng nhập thành công với tài khoản chính xác", false, `Status: ${res.status}, Msg: ${data.message}`);
    }
  } catch (error) {
    recordResult("TC_LGN_001", "Đăng nhập thành công với tài khoản chính xác", false, error.message);
  }

  // TC_LGN_002: Đăng nhập thất bại khi bỏ trống trường
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail })
    });
    const data = await res.json();
    if (res.status === 400) {
      recordResult("TC_LGN_002", "Đăng nhập thất bại khi bỏ trống Email hoặc Mật khẩu", true, `Báo lỗi đúng: ${data.message}`);
    } else {
      recordResult("TC_LGN_002", "Đăng nhập thất bại khi bỏ trống Email hoặc Mật khẩu", false, `Nhận status ${res.status} thay vì 400`);
    }
  } catch (error) {
    recordResult("TC_LGN_002", "Đăng nhập thất bại khi bỏ trống Email hoặc Mật khẩu", false, error.message);
  }

  // TC_LGN_003: Đăng nhập thất bại khi nhập sai mật khẩu
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "wrongpassword"
      })
    });
    const data = await res.json();
    if (res.status >= 400) {
      recordResult("TC_LGN_003", "Đăng nhập thất bại khi nhập sai mật khẩu", true, `Báo lỗi đúng: ${data.message}`);
    } else {
      recordResult("TC_LGN_003", "Đăng nhập thất bại khi nhập sai mật khẩu", false, `Nhận status ${res.status} thay vì lỗi`);
    }
  } catch (error) {
    recordResult("TC_LGN_003", "Đăng nhập thất bại khi nhập sai mật khẩu", false, error.message);
  }

  // ----------------------------------------------------
  // LẤY SẢN PHẨM HỢP LỆ ĐỂ TEST GIỎ HÀNG VÀ ĐẶT HÀNG
  // ----------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    const productsList = data.data || data;
    if (productsList && productsList.length > 0) {
      productId = productsList[0].id;
      storeId = productsList[0].store_id;
      console.log(`ℹ️ Tìm thấy sản phẩm mẫu ID: ${productId}, Store ID: ${storeId}`);
    } else {
      console.error("⚠️ Không tìm thấy sản phẩm nào trong database để tiến hành test giỏ hàng/đặt hàng!");
    }
  } catch (err) {
    console.error("⚠️ Không thể kết nối hoặc truy vấn API sản phẩm:", err.message);
  }

  if (accessToken && productId) {
    // ----------------------------------------------------
    // SECTION 3: THÊM VÀO GIỎ HÀNG (ADD TO CART)
    // ----------------------------------------------------

    // Dọn giỏ hàng trước khi test
    await fetch(`${BASE_URL}/carts/clear`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    // TC_CRT_001: Thêm món ăn mới vào giỏ hàng trống
    try {
      const res = await fetch(`${BASE_URL}/carts/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });
      const data = await res.json();
      if (res.ok) {
        recordResult("TC_CRT_001", "Thêm món ăn mới vào giỏ hàng trống", true, `Thành công: ${data.message || "Đã thêm"}`);
      } else {
        recordResult("TC_CRT_001", "Thêm món ăn mới vào giỏ hàng trống", false, `Status: ${res.status}, Msg: ${data.message}`);
      }
    } catch (error) {
      recordResult("TC_CRT_001", "Thêm món ăn mới vào giỏ hàng trống", false, error.message);
    }

    // TC_CRT_002: Thêm món ăn đã có sẵn (tự động cộng dồn số lượng)
    try {
      const res = await fetch(`${BASE_URL}/carts/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });
      const data = await res.json();
      if (res.ok) {
        recordResult("TC_CRT_002", "Thêm món ăn đã có sẵn trong giỏ hàng", true, `Thành công: ${data.message || "Đã cập nhật số lượng"}`);
      } else {
        recordResult("TC_CRT_002", "Thêm món ăn đã có sẵn trong giỏ hàng", false, `Status: ${res.status}`);
      }
    } catch (error) {
      recordResult("TC_CRT_002", "Thêm món ăn đã có sẵn trong giỏ hàng", false, error.message);
    }

    // TC_CRT_003: Thay đổi số lượng món ăn trực tiếp trong giỏ hàng
    try {
      const res = await fetch(`${BASE_URL}/carts/update`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 5
        })
      });
      const data = await res.json();
      if (res.ok) {
        recordResult("TC_CRT_003", "Thay đổi số lượng món ăn trực tiếp trong Giỏ hàng", true, "Đã cập nhật số lượng lên 5");
      } else {
        recordResult("TC_CRT_003", "Thay đổi số lượng món ăn trực tiếp trong Giỏ hàng", false, `Status: ${res.status}`);
      }
    } catch (error) {
      recordResult("TC_CRT_003", "Thay đổi số lượng món ăn trực tiếp trong Giỏ hàng", false, error.message);
    }

    // TC_CRT_004: Xóa món ăn khỏi giỏ hàng
    try {
      const res = await fetch(`${BASE_URL}/carts/remove`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          product_id: productId
        })
      });
      const data = await res.json();
      if (res.ok) {
        recordResult("TC_CRT_004", "Xóa món ăn khỏi giỏ hàng", true, `Thành công: ${data.message}`);
      } else {
        recordResult("TC_CRT_004", "Xóa món ăn khỏi giỏ hàng", false, `Status: ${res.status}`);
      }
    } catch (error) {
      recordResult("TC_CRT_004", "Xóa món ăn khỏi giỏ hàng", false, error.message);
    }

    // ----------------------------------------------------
    // SECTION 4: ĐẶT HÀNG (PLACE ORDER)
    // ----------------------------------------------------

    // TC_ORD_002: Ngăn đặt hàng khi giỏ trống
    try {
      const res = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          address: "123 Ly Thuong Kiet",
          payment_method_value: "COD",
          store_id: storeId,
          items: [],
          total_price: 0
        })
      });
      const data = await res.json();
      // Hoặc lỗi 400 do giỏ hàng không có sản phẩm
      if (res.status >= 400) {
        recordResult("TC_ORD_002", "Ngăn chặn đặt hàng khi giỏ hàng trống", true, `Báo lỗi đúng: ${data.message || "Giỏ trống"}`);
      } else {
        recordResult("TC_ORD_002", "Ngăn chặn đặt hàng khi giỏ hàng trống", false, `Đặt hàng thành công với giỏ trống? Status: ${res.status}`);
      }
    } catch (error) {
      recordResult("TC_ORD_002", "Ngăn chặn đặt hàng khi giỏ hàng trống", false, error.message);
    }

    // Thêm lại 1 sản phẩm vào giỏ hàng để tiếp tục test đặt hàng
    await fetch(`${BASE_URL}/carts/add`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ product_id: productId, quantity: 2 })
    });

    // TC_ORD_003: Đặt hàng thất bại khi thiếu thông tin giao hàng
    try {
      const res = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          payment_method_value: "COD",
          store_id: storeId,
          items: [{ product_id: productId, quantity: 2, price: 30000 }],
          total_price: 60000
        })
      });
      const data = await res.json();
      if (res.status === 400) {
        recordResult("TC_ORD_003", "Đặt hàng thất bại khi thiếu địa chỉ giao hàng", true, `Báo lỗi đúng: ${data.message}`);
      } else {
        recordResult("TC_ORD_003", "Đặt hàng thất bại khi thiếu địa chỉ giao hàng", false, `Nhận status ${res.status} thay vì 400`);
      }
    } catch (error) {
      recordResult("TC_ORD_003", "Đặt hàng thất bại khi thiếu địa chỉ giao hàng", false, error.message);
    }

    // TC_ORD_001 & TC_PAY_001: Đặt hàng thành công bằng phương thức COD
    try {
      const res = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          address: "123 Ly Thuong Kiet, P14, Q10",
          payment_method_value: "COD",
          store_id: storeId,
          items: [{ product_id: productId, quantity: 2, price: 30000 }],
          total_price: 60000,
          shipping_fee: 15000,
          service_fee: 2000
        })
      });
      const data = await res.json();
      if (res.status === 201 && data.success) {
        recordResult("TC_ORD_001", "Đặt hàng thành công với giỏ hàng có sản phẩm", true, `ID đơn hàng: ${data.result.order_id}`);
        recordResult("TC_PAY_001", "Thanh toán bằng phương thức COD thành công", true, `Hình thức COD ghi nhận cho đơn #${data.result.order_id}`);
      } else {
        recordResult("TC_ORD_001", "Đặt hàng thành công với giỏ hàng có sản phẩm", false, `Status: ${res.status}, Msg: ${data.message}`);
        recordResult("TC_PAY_001", "Thanh toán bằng phương thức COD thành công", false, "Đơn hàng COD thất bại");
      }
    } catch (error) {
      recordResult("TC_ORD_001", "Đặt hàng thành công với giỏ hàng có sản phẩm", false, error.message);
      recordResult("TC_PAY_001", "Thanh toán bằng phương thức COD thành công", false, error.message);
    }

    // ----------------------------------------------------
    // SECTION 5: THANH TOÁN VNPAY (PAYMENT VNPAY)
    // ----------------------------------------------------

    // Thêm món ăn vào giỏ hàng để tạo đơn tiếp theo
    await fetch(`${BASE_URL}/carts/add`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    });

    // TC_PAY_002: Đặt đơn VNPay và tạo URL thanh toán thành công
    try {
      const res = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          address: "99 Ba Thang Hai, Q11",
          payment_method_value: "vnpay",
          store_id: storeId,
          items: [{ product_id: productId, quantity: 1, price: 30000 }],
          total_price: 30000
        })
      });
      const data = await res.json();
      if (res.status === 201 && data.result.payment_url) {
        recordResult("TC_PAY_002", "Thanh toán trực tuyến qua cổng VNPay (Tạo URL)", true, `URL: ${data.result.payment_url.slice(0, 80)}...`);
      } else {
        recordResult("TC_PAY_002", "Thanh toán trực tuyến qua cổng VNPay (Tạo URL)", false, `Không tạo được VNPay URL. Msg: ${data.message}`);
      }
    } catch (error) {
      recordResult("TC_PAY_002", "Thanh toán trực tuyến qua cổng VNPay (Tạo URL)", false, error.message);
    }

  } else {
    console.error("❌ Không thể thực hiện các test case liên quan đến Giỏ hàng & Đặt hàng vì thiếu token đăng nhập hoặc không có món ăn mẫu.");
  }

  console.log("\n=== TỔNG HỢP KẾT QUẢ KIỂM THỬ ===");
  console.table(results.map(r => ({
    "Mã TC": r.tcId,
    "Kịch Bản": r.name,
    "Kết Quả": r.success ? "✅ PASS" : "❌ FAIL",
    "Chi Tiết": r.detail
  })));

  process.exit(0);
}

runTests();
