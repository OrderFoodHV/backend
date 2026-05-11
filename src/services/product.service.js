const productRepo = require("../repositories/product.repository");

exports.getAllProducts = async () => {
  return await productRepo.findAll();
};

exports.getProductById = async (id) => {
  const product = await productRepo.findById(id);

  if (!product) {
    const error = new Error("Không tìm thấy món ăn này!");
    error.statusCode = 404;
    throw error;
  }

  return product;
};
