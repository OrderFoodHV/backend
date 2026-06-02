const orderRepo = require("../repositories/order.repository");
const cartRepo = require("../repositories/cart.repository");
const voucherService = require("./voucher.service");

exports.checkout = async (
  userId,
  storeId, // 🔥 Thêm tham số nhận dạng Quán
  shippingAddress,
  itemsFromFE,
  totalPriceFE,
  shippingFee,
  serviceFee,
  note,
  distance, // 🔥 Nhận khoảng cách tính từ FE
  voucherCode, // 🔥 Nhận mã giảm giá từ FE
  paymentMethod, // 🔥 Nhận phương thức thanh toán
  storeVoucherCode, // 🔥 Nhận mã voucher của cửa hàng
) => {
  let cartItems = Array.isArray(itemsFromFE) ? itemsFromFE : [];
  if (cartItems.length === 0) {
    cartItems = await cartRepo.getCartDetails(userId);
  }

  if (!cartItems || cartItems.length === 0) {
    const error = new Error("Không có sản phẩm nào để tiến hành đặt hàng!");
    error.statusCode = 400;
    throw error;
  }

  // Nếu FE không gửi storeId, bốc đại store_id của món ăn đầu tiên trong giỏ hàng để cứu nguy
  const finalStoreId = storeId || cartItems[0]?.store_id || 1;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  let voucherId = null;
  let storeVoucherId = null;

  if (voucherCode) {
    const voucher = await voucherService.validateVoucher(voucherCode, subtotal, finalStoreId);
    voucherId = voucher.id;
    if (voucher.discount_percent > 0) {
      discount += (subtotal * voucher.discount_percent) / 100;
    } else if (Number(voucher.discount_amount) > 0) {
      discount += Number(voucher.discount_amount);
    }
  }

  if (storeVoucherCode) {
    const storeVoucher = await voucherService.validateVoucher(storeVoucherCode, subtotal, finalStoreId);
    storeVoucherId = storeVoucher.id;
    if (storeVoucher.discount_percent > 0) {
      discount += (subtotal * storeVoucher.discount_percent) / 100;
    } else if (Number(storeVoucher.discount_amount) > 0) {
      discount += Number(storeVoucher.discount_amount);
    }
  }

  // Tính tổng số tiền cuối cùng sau giảm giá
  const calculatedTotal = Math.max(0, subtotal - discount + (shippingFee || 0) + (serviceFee || 0));
  const finalTotal = totalPriceFE ? Math.min(totalPriceFE, calculatedTotal) : calculatedTotal;

  // Gọi Repo chạy Transaction (Nhớ truyền finalStoreId vào nhen sếp)
  const orderId = await orderRepo.createOrderTransaction(
    userId,
    finalStoreId, // Đảm bảo Repo nhận được trường này để insert vào DB
    cartItems,
    shippingAddress,
    finalTotal,
    shippingFee,
    serviceFee || 0,
    note,
    distance, // 🔥 Truyền khoảng cách xuống Repo
    voucherId, // 🔥 Truyền voucherId xuống Repo
    paymentMethod || "COD", // 🔥 Truyền phương thức thanh toán
    storeVoucherId, // 🔥 Truyền storeVoucherId xuống Repo
  );

  return { orderId, finalStoreId }; // Trả ra ngoài cả 2 thông tin để Controller bắn Socket
};

exports.getOrders = async (userId) => {
  return await orderRepo.findOrdersByUser(userId);
};

exports.reorder = async (userId, orderId) => {
  const oldOrder = await orderRepo.findOrderById(orderId);
  if (!oldOrder) {
    const error = new Error("Không tìm thấy đơn hàng cũ để đặt lại!");
    error.statusCode = 404;
    throw error;
  }

  if (oldOrder.user_id !== userId) {
    const error = new Error("Bạn không có quyền đặt lại đơn hàng này!");
    error.statusCode = 403;
    throw error;
  }

  const oldItems = await orderRepo.findOrderItemsDetails(orderId);
  if (!oldItems || oldItems.length === 0) {
    const error = new Error("Đơn hàng cũ không chứa sản phẩm nào!");
    error.statusCode = 400;
    throw error;
  }

  // Trả về danh sách products để người dùng vào màn hình Checkout
  return {
    storeId: oldOrder.store_id,
    products: oldItems.map((item) => ({
      product_id: item.product_id, // findOrderItemsDetails trả về product_id
      id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      store_id: oldOrder.store_id,
    })),
    address: oldOrder.address,
    note: oldOrder.note,
  };
};
