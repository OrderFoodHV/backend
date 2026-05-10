const db = require("../../config/db");
const { ok, success, fail } = require("../../utils/response");

exports.getDisputes = async (req, res, next) => {
  try {
    const [results] = await db.query(
      `SELECT d.id, d.order_id, d.user_id, d.partner_id, d.reason, d.status, 
              d.resolution, d.refund_amount, d.created_at, d.resolved_at,
              u.name as user_name, p.name as partner_name
       FROM disputes d LEFT JOIN users u ON d.user_id = u.id LEFT JOIN partners p ON d.partner_id = p.id
       ORDER BY d.created_at DESC`
    );
    return ok(res, results);
  } catch (err) { next(err); }
};

exports.getDisputeDetail = async (req, res, next) => {
  try {
    const [results] = await db.query(
      `SELECT d.*, u.name as user_name, u.email as user_email, p.name as partner_name, p.email as partner_email
       FROM disputes d LEFT JOIN users u ON d.user_id = u.id LEFT JOIN partners p ON d.partner_id = p.id
       WHERE d.id = ?`,
      [req.params.id]
    );
    if (results.length === 0) return fail(res, 404, "Không tìm thấy tranh chấp");
    return ok(res, results[0]);
  } catch (err) { next(err); }
};

exports.resolveDispute = async (req, res, next) => {
  try {
    const { resolution, refund_amount, status } = req.body;
    const [result] = await db.query(
      "UPDATE disputes SET resolution = ?, refund_amount = ?, status = ?, resolved_at = NOW() WHERE id = ?",
      [resolution, refund_amount, status, req.params.id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy tranh chấp");
    return success(res, "Giải quyết tranh chấp thành công");
  } catch (err) { next(err); }
};

exports.processRefund = async (req, res, next) => {
  try {
    const { refund_amount } = req.body;
    const [result] = await db.query(
      "UPDATE disputes SET status = 'refunded', refund_amount = ?, resolved_at = NOW() WHERE id = ?",
      [refund_amount, req.params.id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy tranh chấp");
    return ok(res, { refund_amount }, "Hoàn tiền thành công");
  } catch (err) { next(err); }
};

exports.rejectDispute = async (req, res, next) => {
  try {
    const [result] = await db.query(
      "UPDATE disputes SET status = 'rejected', resolution = ?, resolved_at = NOW() WHERE id = ?",
      [req.body.reason, req.params.id]
    );
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy tranh chấp");
    return success(res, "Từ chối tranh chấp thành công");
  } catch (err) { next(err); }
};

exports.getRefundRequests = async (req, res, next) => {
  try {
    const [results] = await db.query(
      `SELECT r.id, r.order_id, r.user_id, r.amount, r.reason, r.status, r.created_at, u.name as user_name
       FROM refund_requests r LEFT JOIN users u ON r.user_id = u.id WHERE r.status = 'pending' ORDER BY r.created_at DESC`
    );
    return ok(res, results);
  } catch (err) { next(err); }
};

exports.approveRefund = async (req, res, next) => {
  try {
    const [result] = await db.query("UPDATE refund_requests SET status = 'approved' WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return fail(res, 404, "Không tìm thấy yêu cầu hoàn tiền");
    return success(res, "Duyệt hoàn tiền thành công");
  } catch (err) { next(err); }
};