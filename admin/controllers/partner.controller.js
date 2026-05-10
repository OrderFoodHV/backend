const db = require("../../config/db");
const { ok, success, fail } = require("../../utils/response");

exports.getPartners = async (req, res, next) => {
  try {
    const [results] = await db.query("SELECT id, name, email, phone, address, status, created_at FROM partners ORDER BY created_at DESC");
    return ok(res, results);
  } catch (err) { next(err); }
};

exports.updatePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, status } = req.body;
    const [result] = await db.query(
      "UPDATE partners SET name = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?",
      [name, email, phone, address, status, id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy đối tác");
    return success(res, "Cập nhật đối tác thành công");
  } catch (err) { next(err); }
};

exports.deletePartner = async (req, res, next) => {
  try {
    const [result] = await db.query("DELETE FROM partners WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy đối tác");
    return success(res, "Xóa đối tác thành công");
  } catch (err) { next(err); }
};

exports.approvePartner = async (req, res, next) => {
  try {
    const [result] = await db.query("UPDATE partners SET status = 'active' WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy đối tác");
    return success(res, "Duyệt đối tác thành công");
  } catch (err) { next(err); }
};