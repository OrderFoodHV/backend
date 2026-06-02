const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");

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
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const params = {
  vnp_Version: "2.1.0",
  vnp_Command: "pay",
  vnp_TmnCode: "L70LG41O",
  vnp_Locale: "vn",
  vnp_CurrCode: "VND",
  vnp_TxnRef: "135",
  vnp_OrderInfo: "ThanhToanDonHang135",
  vnp_OrderType: "other",
  vnp_Amount: 4000000,
  vnp_ReturnUrl: "http://localhost:3000/api/payment/vnpay_return",
  vnp_IpAddr: "127.0.0.1",
  vnp_CreateDate: "20260601212933",
  vnp_ExpireDate: "20260601214433"
};

let vnp_Params = sortObject(params);
const signDataQs = querystring.stringify(vnp_Params, { encode: false });

let signDataManual = "";
for (let key in vnp_Params) {
    if (vnp_Params.hasOwnProperty(key)) {
        if (signDataManual !== "") {
            signDataManual += "&";
        }
        signDataManual += key + "=" + vnp_Params[key];
    }
}

console.log("QS:", signDataQs);
console.log("Manual:", signDataManual);
console.log("Match?", signDataQs === signDataManual);

const hmac = crypto.createHmac("sha512", "5A9JPYKY6YYKU92B2AZLA4L5IDNOLPK5");
const signedQs = hmac.update(Buffer.from(signDataQs, "utf-8")).digest("hex");

const hmac2 = crypto.createHmac("sha512", "5A9JPYKY6YYKU92B2AZLA4L5IDNOLPK5");
const signedManual = hmac2.update(Buffer.from(signDataManual, "utf-8")).digest("hex");

console.log("Signed QS:", signedQs);
console.log("Signed Manual:", signedManual);
