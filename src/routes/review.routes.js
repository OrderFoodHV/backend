const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/add-review", verifyToken, reviewController.addReview);

module.exports = router;
