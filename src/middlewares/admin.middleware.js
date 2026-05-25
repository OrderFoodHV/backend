exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Là admin thì cho qua
  } else {
    res
      .status(403)
      .json({
        status: "fail",
        message: "Bạn không phải Admin, không có quyền truy cập",
      });
  }
};
