const crypto = require("crypto");

/**
 * Generate HMAC-SHA256 signature for given data and secret key
 * @param {string} data 
 * @param {string} secret 
 * @returns {string} hex signature
 */
exports.generateHmac = (data, secret) => {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
};

exports.verifyHmac = (data, signature, secret) => {
  const serverHmac = crypto.createHmac("sha256", secret).update(data).digest("hex");
  
  const serverHmacBuffer = Buffer.from(serverHmac, "hex");
  const clientHmacBuffer = Buffer.from(signature, "hex");

  if (serverHmacBuffer.length !== clientHmacBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(serverHmacBuffer, clientHmacBuffer);
};
