const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = await req.body;
  console.log(email);
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.json({
      token: accessToken,
      user: {
        id: user?._id,
        name: user?.username,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  const { email, name, password } = await req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    }

    const newUser = await new User({
      email,
      password: bcrypt.hashSync(password, 10),
      username: name,
    });

    const savedUser = await newUser.save();

    const accessToken = generateAccessToken({ id: savedUser._id });
    const refreshToken = generateRefreshToken({ id: savedUser._id });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.json({
      token: accessToken,
      user: {
        id: savedUser._id,
        name: savedUser.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Please provide refresh token" });
  }
  try {
    const decoded = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = await generateAccessToken({
      id: decoded.id,
    });
    return res.status(200).json({ token: accessToken });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
};

const getallUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  register,
  getallUser,
  refreshToken,
};
