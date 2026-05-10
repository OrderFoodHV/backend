// Middleware xử lý lỗi tập trung — đặt ở cuối app.js
// Không tiết lộ thông tin nội bộ ra ngoài môi trường production

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} — ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err.message || err);

  // Lỗi validation từ express (ví dụ body-parser)
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Dữ liệu JSON không hợp lệ" });
  }

  // Lỗi duplicate key MySQL
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, message: "Dữ liệu đã tồn tại (trùng lặp)" });
  }

  // Các lỗi còn lại
  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Lỗi máy chủ nội bộ"
      : err.message || "Lỗi máy chủ nội bộ";

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
