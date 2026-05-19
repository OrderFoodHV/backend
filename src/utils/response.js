// Đường dẫn: src/utils/response.js

exports.ok = (res, data, message = "Thành công") => {
  return res.status(200).json({
    status: "success",
    message: message,
    data: data,
  });
};

exports.success = (res, message = "Thành công") => {
  return res.status(200).json({
    status: "success",
    message: message,
  });
};

exports.created = (res, data, message = "Tạo mới thành công") => {
  return res.status(201).json({
    status: "success",
    message: message,
    data: data,
  });
};

exports.fail = (res, statusCode = 400, message = "Thất bại") => {
  return res.status(statusCode).json({
    status: "fail",
    message: message,
  });
};
