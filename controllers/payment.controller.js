exports.createPayment = (req, res) => {
  const { order_id } = req.body;

  // update payment
  db.query(
    "UPDATE orders SET payment_status = 'paid', status = 'confirmed' WHERE id = ?",
    [order_id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Thanh toán thành công (fake)",
      });
    },
  );
};
