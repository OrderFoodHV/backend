/**
 * Chuẩn hóa API Response
 * Tất cả response đều có dạng: { success, data?, message? }
 */

/** 200 OK — trả về data (list hoặc object) */
const ok = (res, data, message) => {
  const body = { success: true };
  if (data !== undefined) body.data = data;
  if (message) body.message = message;
  return res.json(body);
};

/** 201 Created — tạo mới thành công */
const created = (res, data, message = "Tạo thành công") => {
  const body = { success: true, message };
  if (data !== undefined) body.data = data;
  return res.status(201).json(body);
};

/** 200 OK — hành động thành công (update/delete), không có data */
const success = (res, message) =>
  res.json({ success: true, message });

/** 4xx/5xx — lỗi */
const fail = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, message });

module.exports = { ok, created, success, fail };
