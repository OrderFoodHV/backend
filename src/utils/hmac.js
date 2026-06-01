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
};
