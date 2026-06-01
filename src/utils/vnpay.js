const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");

/**
 * Sort object keys alphabetically
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
    // VNPay standard: replace %20 with +
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

/**
 * Create VNPay Signature (HMAC-SHA512)
 */
exports.createVnpaySignature = (data, secret) => {
  const hmac = crypto.createHmac("sha512", secret);
  return hmac.update(Buffer.from(data, "utf-8")).digest("hex");
};

/**
 * Build VNPay Payment URL
 */
exports.buildPaymentUrl = (req, params) => {
  const tmnCode = process.env.VNP_TMN_CODE ? process.env.VNP_TMN_CODE.trim() : "";
  const secretKey = process.env.VNP_HASH_SECRET ? process.env.VNP_HASH_SECRET.trim() : "";
  let vnpUrl = process.env.VNP_URL ? process.env.VNP_URL.trim() : "";
  const returnUrl = process.env.VNP_RETURN_URL ? process.env.VNP_RETURN_URL.trim() : "";

  let createDate = moment().utcOffset('+07:00').format('YYYYMMDDHHmmss');
  let expireDate = moment().utcOffset('+07:00').add(15, 'minutes').format('YYYYMMDDHHmmss');

  let ipAddr = req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress || "127.0.0.1";

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
    vnp_ExpireDate: expireDate
  };
  
  if (params.bankCode) {
    vnp_Params.vnp_BankCode = params.bankCode;
  }

  const sortedKeys = Object.keys(vnp_Params).sort();
  const pairs = [];
  for (const key of sortedKeys) {
    const value = String(vnp_Params[key]);
    const encodedValue = encodeURIComponent(value).replace(/%20/g, '+');
    pairs.push(`${key}=${encodedValue}`);
  }

  const signData = pairs.join('&');
  const signed = exports.createVnpaySignature(signData, secretKey);
  
  return vnpUrl + "?" + signData + "&vnp_SecureHash=" + signed;
};

/**
 * Verify VNPay Signature
 */
exports.verifyVnpaySignature = (vnp_Params) => {
  const secretKey = process.env.VNP_HASH_SECRET ? process.env.VNP_HASH_SECRET.trim() : "";
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedKeys = Object.keys(vnp_Params).sort();
  const pairs = [];
  for (const key of sortedKeys) {
    const value = String(vnp_Params[key]);
    const encodedValue = encodeURIComponent(value).replace(/%20/g, '+');
    pairs.push(`${key}=${encodedValue}`);
  }

  const signData = pairs.join('&');
  const signed = exports.createVnpaySignature(signData, secretKey);

  return secureHash === signed;
};
