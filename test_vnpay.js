require('dotenv').config();
const vnpay = require('./src/utils/vnpay');
const req = {
  headers: {
    "x-forwarded-for": "127.0.0.1"
  }
};
const params = {
  orderId: "12345",
  amount: 40000
};
const url = vnpay.buildPaymentUrl(req, params);
console.log("URL:", url);
