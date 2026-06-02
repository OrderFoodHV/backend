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

<<<<<<< HEAD
exports.verifyHmac = (data, signature, secret) => {
  const serverHmac = crypto.createHmac("sha256", secret).update(data).digest("hex");
  
  const serverHmacBuffer = Buffer.from(serverHmac, "hex");
  const clientHmacBuffer = Buffer.from(signature, "hex");

  if (serverHmacBuffer.length !== clientHmacBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(serverHmacBuffer, clientHmacBuffer);
=======
/**
 * Verify HMAC-SHA256 signature
 * @param {string} data 
 * @param {string} signature 
 * @param {string} secret 
 * @returns {boolean}
 */
exports.verifyHmac = (data, signature, secret) => {
  const hash = crypto.createHmac("sha256", secret).update(data).digest("hex");
  return hash === signature;
>>>>>>> fa6c83e4b3846892ac5bb7be251187d5fdf26eca
};
