const express = require("express");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const newUser = await new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
    isAdmin: req.body?.isAdmin,
  });

  try {
    const user = await newUser.save();
    return res
      .status(200)
      .json({ message: "user have succesfully registered" });
  } catch (err) {
    return res.status(500).json({ message: "auth router register error", err });
  }
});

// AUTH
router.get("/auth", verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.json({ accessToken, ...user._doc });
  } catch (e) {
    console.log(e);
    res.send({ message: "Server error" });
  }
});
// Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "wrong password or username" });
    }
    const decrypted = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );
    const originalPassword = decrypted.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(404).json({ message: "wrong password or username" });
    }
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const { password, ...info } = user._doc;
    return res.status(200).json({ ...info, accessToken });
  } catch (err) {
    return res.status(500).json({ message: "auth login error", err });
  }
});

module.exports = router;
