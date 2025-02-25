const jwt = require("jsonwebtoken");

const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "15m" });
  return token;
};

const generateRefreshToken = (data) => {
  const token = jwt.sign(data, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
