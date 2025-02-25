const express = require("express");
const {
  register,
  login,
  getallUser,
  refreshToken,
} = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/all", getallUser);
router.get("/refresh-token", refreshToken);

module.exports = router;
