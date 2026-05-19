const { ok, success, fail, created } = require("../../src/utils/response");
const storeProductService = require("../services/storeProduct.service");

// Helper xử lý lỗi custom từ Service
const handleServiceError = (res, next, err) => {
  if (err.message.includes("|")) {
    const [msg, code] = err.message.split("|");
    return fail(res, parseInt(code), msg);
  }
  next(err);
};

exports.getProducts = async (req, res, next) => {
  try {
    const data = await storeProductService.getProducts(
      req.params.storeId,
      req.query,
    );
    return ok(res, data);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const data = await storeProductService.createProduct(
      req.params.storeId,
      req.body,
    );
    return created(res, data, "Thêm món ăn thành công");
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const message = await storeProductService.updateProduct(
      req.params.storeId,
      req.params.productId,
      req.body,
    );
    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const message = await storeProductService.deleteProduct(
      req.params.storeId,
      req.params.productId,
    );
    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const message = await storeProductService.toggleAvailability(
      req.params.storeId,
      req.params.productId,
    );
    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};

exports.bulkToggle = async (req, res, next) => {
  try {
    const message = await storeProductService.bulkToggle(
      req.params.storeId,
      req.body,
    );
    return success(res, message);
  } catch (err) {
    handleServiceError(res, next, err);
  }
};
