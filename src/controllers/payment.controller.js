const paymentService = require("../services/payment.service");
const catchAsync = require("../utils/catchAsync");

exports.pay = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { order_id, amount, method } = req.body;

  if (!order_id || !amount || !method) {
    const error = new Error("Thiếu thông tin thanh toán!");
    error.statusCode = 400;
    throw error;
  }

  const result = await paymentService.processPayment(
    order_id,
    userId,
    amount,
    method,
  );

  res.status(200).json({
    status: "success",
    data: result,
  });
});

exports.verifyMockPayment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { order_id, amount } = req.body;

  if (!order_id || amount === undefined) {
    const error = new Error("Thiếu mã đơn hàng hoặc số tiền!");
    error.statusCode = 400;
    throw error;
  }

  const result = await paymentService.verifyMockPayment(
    order_id,
    userId,
    amount
  );

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const vnpayUtil = require("../utils/vnpay");
const orderRepo = require("../repositories/order.repository");

exports.createVnpayUrl = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { order_id, amount, bankCode } = req.body;

  if (!order_id || !amount) {
    const error = new Error("Thiếu mã đơn hàng hoặc số tiền!");
    error.statusCode = 400;
    throw error;
  }

  // Optional: Verify order belongs to user and is not paid
  const order = await orderRepo.findOrderById(order_id);
  if (!order || order.user_id != userId) {
    const error = new Error("Đơn hàng không hợp lệ!");
    error.statusCode = 400;
    throw error;
  }
  if (order.payment_status === "paid") {
    const error = new Error("Đơn hàng đã được thanh toán!");
    error.statusCode = 400;
    throw error;
  }

  const vnpUrl = vnpayUtil.buildPaymentUrl(req, {
    orderId: order_id,
    amount: amount,
    bankCode: bankCode
  });

  res.status(200).json({
    status: "success",
    data: {
      url: vnpUrl
    }
  });
});

exports.vnpayReturn = catchAsync(async (req, res, next) => {
  let vnp_Params = req.query;

  const isValid = vnpayUtil.verifyVnpaySignature(vnp_Params);
  
  if (isValid) {
    if (vnp_Params['vnp_ResponseCode'] === '00') {
      // Kq GD thanh cong
      // redirect ve web/app voi trang thai thanh cong
      return res.redirect('foodapp://vnpay_return?status=success&orderId=' + vnp_Params['vnp_TxnRef']);
    } else {
      // Kq GD that bai
      return res.redirect('foodapp://vnpay_return?status=fail&orderId=' + vnp_Params['vnp_TxnRef']);
    }
  } else {
    return res.redirect('foodapp://vnpay_return?status=invalid_signature');
  }
});

exports.vnpayIpn = catchAsync(async (req, res, next) => {
  let vnp_Params = req.query;
  const isValid = vnpayUtil.verifyVnpaySignature(vnp_Params);

  if (isValid) {
    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];
    const amount = parseInt(vnp_Params['vnp_Amount']) / 100;

    try {
      // Call service to handle IPN business logic
      const result = await paymentService.processVnpayIpn(orderId, rspCode, amount);
      return res.status(200).json({ RspCode: result.code, Message: result.message });
    } catch (e) {
      console.error(e);
      return res.status(200).json({ RspCode: '99', Message: 'Unknow error' });
    }
  } else {
    return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' });
  }
});
