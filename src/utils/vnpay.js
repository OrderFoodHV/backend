const crypto = require("crypto");
const moment = require("moment");

/**
 * Hàm sắp xếp và mã hóa siêu nghiêm ngặt (Chuẩn RFC 3986)
 */
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(String(obj[str[key]]))
      .replace(/%20/g, "+")
      .replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      });
  }
  return sorted;
}

exports.buildPaymentUrl = (req, params) => {
  const tmnCode = process.env.VNP_TMN_CODE
    ? process.env.VNP_TMN_CODE.trim()
    : "";
  const secretKey = process.env.VNP_HASH_SECRET
    ? process.env.VNP_HASH_SECRET.trim()
    : "";
  let vnpUrl = process.env.VNP_URL ? process.env.VNP_URL.trim() : "";
  const returnUrl =
    process.env.VNP_RETURN_URL ||
    "http://localhost:3000/api/payment/vnpay_return";

  let createDate = moment().utcOffset("+07:00").format("YYYYMMDDHHmmss");
  let expireDate = moment()
    .utcOffset("+07:00")
    .add(15, "minutes")
    .format("YYYYMMDDHHmmss");

  // Xử lý IP address sạch sẽ
  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    "127.0.0.1";

  if (ipAddr && ipAddr.includes(",")) {
    ipAddr = ipAddr.split(",")[0].trim();
  }
  if (!ipAddr || ipAddr === "::1" || ipAddr.length > 15) {
    ipAddr = "127.0.0.1";
  }

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: String(params.orderId),
    vnp_OrderInfo: `ThanhToanDonHang${params.orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(Number(params.amount) * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  // 1. Sort và Encode
  vnp_Params = sortObject(vnp_Params);

  // 2. Nối chuỗi thủ công (Tuyệt đối không dùng thư viện ngoài)
  let signData = "";
  for (let key in vnp_Params) {
    if (vnp_Params.hasOwnProperty(key)) {
      if (signData !== "") {
        signData += "&";
      }
      signData += key + "=" + vnp_Params[key];
    }
  }

  // 3. Tạo chữ ký SHA-512 (Viết thường)
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // 4. Hoàn thiện URL
  vnpUrl += "?" + signData + "&vnp_SecureHash=" + signed;

  return vnpUrl;
};

exports.verifyVnpaySignature = (vnp_Params) => {
  const secretKey = process.env.VNP_HASH_SECRET
    ? process.env.VNP_HASH_SECRET.trim()
    : "";
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let signData = "";
  for (let key in vnp_Params) {
    if (vnp_Params.hasOwnProperty(key)) {
      if (signData !== "") {
        signData += "&";
      }
      signData += key + "=" + vnp_Params[key];
    }
  }

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
};
