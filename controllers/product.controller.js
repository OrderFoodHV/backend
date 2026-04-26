const db = require("../config/db");

exports.getAll = (req, res) => {
  db.query("SELECT * FROM products", (err, data) => {
    res.json(data);
  });
};

exports.getOne = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [req.params.id],
    (err, data) => {
      res.json(data[0]);
    },
  );
};
