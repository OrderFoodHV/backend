// Nơi hứng MỌI LỖI từ toàn bộ ứng dụng dội về
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Trả về đúng 1 chuẩn form (Chuẩn hóa API Response)
  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
    message: err.message || "Lỗi máy chủ nội bộ!",
    // Nếu sếp đang dev thì hiện chi tiết lỗi, lúc nộp bài thì tắt dòng stack này đi
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
