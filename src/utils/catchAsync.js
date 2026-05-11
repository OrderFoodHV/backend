// Cây gậy thần này sẽ tự động bắt mọi lỗi (Promise reject) trong Controller và ném nó cho Middleware xử lý
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
