exports.getTracking = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at ASC",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    },
  );
};
