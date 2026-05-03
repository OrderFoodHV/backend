const express = require("express");
const router = express.Router();

// IMPORT CONTROLLER
const {
  createUser,
  loginUser,
  getUsers,
} = require("../controllers/user.controller");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);

module.exports = router;
console.log("USER ROUTES OK");
