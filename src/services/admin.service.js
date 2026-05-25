const adminRepo = require("../repositories/admin.repository");

exports.getStats = async () => {
  return await adminRepo.getSystemStats();
};

exports.updateFee = async (type, value) => {
  return await adminRepo.updateFeeSetting(type, value);
};

exports.getDisputes = async () => {
  return await adminRepo.findAllDisputes();
};
