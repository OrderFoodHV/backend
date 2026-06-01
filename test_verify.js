require('dotenv').config();
const vnpay = require('./src/utils/vnpay');
const req = { headers: { "x-forwarded-for": "127.0.0.1" } };
const params = { orderId: "12345", amount: 40000 };
const url = vnpay.buildPaymentUrl(req, params);

const urlObj = new URL(url);
const vnp_Params = Object.fromEntries(urlObj.searchParams.entries());

const isValid = vnpay.verifyVnpaySignature(vnp_Params);
console.log("isValid:", isValid);
