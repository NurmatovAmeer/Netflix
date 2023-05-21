const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const verify = require("./verifyToken");

const router = express.Router();

// Update
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
    const queryType = req.query.type;
    if (queryType == "liked") {
      try {
        const { liked, ...others } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $push: { liked: liked },
            $set: others,
          },
          { new: true }
        );
        const { password, ...info } = updatedUser._doc;
        return res.status(200).json(info);
      } catch (err) {
        return res.status(500).json(err);
      }
    } else if (queryType == "unliked") {
      try {
        const { liked, ...others } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $pull: { liked: liked },
            $set: others,
          },
          { new: true }
        );
        const { password, ...info } = updatedUser._doc;
        return res.status(200).json(info);
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        const { password, ...info } = updatedUser._doc;
        return res.status(200).json(info);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can update only your account" });
  }
});
// Delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "user have been deleted" });
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can delete only your account" });
  }
});
// Get
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    return res.status(200).json(info);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// Get All
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed to see all users!");
  }
});
// Get User Stats
router.get("/stats", async (req, res) => {
  const today = new Date();
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
