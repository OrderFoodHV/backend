const crypto = require("crypto");
const querystring = require("qs");
const moment = require("moment");
const db = require("../config/db");

// Cấu hình VNPay (Nhớ thay bằng mã của bạn lấy trên Sandbox)
const vnp_TmnCode = "L70LG41O";
const vnp_HashSecret = "5A9JPYKY6YYKU92B2AZLA4L5IDNOLPK5";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:3000/payments/vnpay_return"; // Hứng kết quả về

// Hàm sắp xếp object theo thứ tự alphabet (Bắt buộc của VNPay)
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// 1. HÀM TẠO LINK THANH TOÁN
exports.createPaymentUrl = (req, res) => {
  let { order_id, total_price } = req.body;
  let vnp_Amount = parseInt(total_price) * 100;

  let date = new Date();
  let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: "L70LG41O",
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: String(order_id),
    vnp_OrderInfo: "Thanh toan don hang " + order_id,
    vnp_OrderType: "other",
    vnp_Amount: vnp_Amount,
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: "127.0.0.1",
    vnp_CreateDate: vnp_CreateDate,
  };

  // 1. Sắp xếp tham số (ksort)
  let sorted = {};
  Object.keys(vnp_Params)
    .sort()
    .forEach((key) => {
      sorted[key] = vnp_Params[key];
    });

  // 2. Tạo chuỗi query (Dấu cách PHẢI là dấu +)
  // T dùng URLSearchParams vì nó tự động đổi dấu cách thành + cực chuẩn
  let signData = new URLSearchParams(sorted).toString();

  // 3. Băm HMAC-SHA512
  let secretKey = "5A9JPYKY6YYKU92B2AZLA4L5IDNOLPK5";
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex")
    .toUpperCase();

  // 4. Tạo URL cuối cùng - Gửi đúng cái signData đã dùng để băm
  let paymentUrl =
    vnp_Url + "?" + signData + "&vnp_SecureHash=" + vnp_SecureHash;

  console.log("--- CHUỖI BĂM THẬT SỰ (PHẢI CÓ DẤU +) ---");
  console.log(signData);

  res.json({ code: "00", message: "success", data: paymentUrl });
};
// 2. HÀM HỨNG KẾT QUẢ TỪ VNPAY TRẢ VỀ
exports.vnpayReturn = (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  // 1. Tách chữ ký ra khỏi dữ liệu nhận về
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // 2. Sắp xếp lại dữ liệu theo alphabet (ksort)
  vnp_Params = sortObject(vnp_Params);

  // 3. Tạo chuỗi băm (QUAN TRỌNG: Phải encode đúng chuẩn 2.1.0 như lúc tạo link)
  let signData = querystring.stringify(vnp_Params, { encode: true });

  // 4. Băm HMAC-SHA512 với Secret Key của sếp
  let secretKey = "5A9JPYKY6YYKU92B2AZLA4L5IDNOLPK5"; // Sếp nhớ dùng biến hoặc dán mã từ email vào
  let hmac = crypto.createHmac("sha512", secretKey);

  // 5. Tính toán chữ ký và VIẾT HOA để so sánh
  let signed = hmac
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex")
    .toUpperCase();

  // 6. Đối chiếu chữ ký
  if (secureHash === signed) {
    let order_id = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    // KẾT QUẢ KHỚP => DỮ LIỆU AN TOÀN
    if (rspCode === "00") {
      // Giao dịch thành công -> Cập nhật Database tại đây
      // db.query("UPDATE orders SET status = 'paid' WHERE id = ?", [order_id]);
      res.render("success", {
        message: "Thanh toán thành công đơn hàng " + order_id,
        code: rspCode,
      });
    } else {
      // Giao dịch thất bại (ví dụ: khách hủy, thẻ hết tiền)
      res.render("error", {
        message: "Giao dịch thất bại. Mã lỗi: " + rspCode,
        code: rspCode,
      });
    }
  } else {
    // CHỮ KÝ SAI => CẢNH BÁO HACKER SỬA DỮ LIỆU
    console.log("Sai chữ ký nhận về! Checksum của mình:", signed);
    console.log("Checksum của VNPay:", secureHash);
    res
      .status(400)
      .render("error", { message: "Chữ ký không hợp lệ!", code: "97" });
  }
};
