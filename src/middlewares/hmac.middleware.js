const { verifyHmac } = require("../utils/hmac");

/**
 * Middleware to verify custom internal HMAC signature of request body
 */
exports.verifyHmacSignature = (req, res, next) => {
  const signature = req.headers["x-signature"];
  if (!signature) {
    return res.status(400).json({
      status: "fail",
      message: "Thiếu chữ ký xác thực x-signature!",
    });
  }

  const secret = process.env.HMAC_SECRET || "custom_internal_hmac_secret_key_98765";

  // Sắp xếp các khóa của request body theo thứ tự chữ cái để tạo chuỗi mã hóa nhất quán
  const sortedBody = {};
  if (req.body) {
    Object.keys(req.body).sort().forEach((key) => {
      sortedBody[key] = req.body[key];
    });
  }
  const dataToSign = JSON.stringify(sortedBody);

  const isValid = verifyHmac(dataToSign, signature, secret);
  if (!isValid) {
    return res.status(403).json({
      status: "fail",
      message: "Chữ ký xác thực không hợp lệ! Dữ liệu giao dịch có thể đã bị can thiệp.",
    });
  }

  next();
};
