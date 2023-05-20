const express = require("express");
const Casts = require("../models/Casts");
const verify = require("./verifyToken");

const router = express.Router();

// Create
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newCast = new Casts(req.body);
    try {
      const savedCast = await newCast.save();
      return res.status(200).json(savedCast);
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});
// Update
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedCast = await Casts.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedCast);
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});
// delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Casts.findByIdAndDelete(req.params.id);
      return res.status(200).json("Cast has been deleted");
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});
// get
router.get("/find/:id", verify, async (req, res) => {
  try {
    const cast = await Casts.findById(req.params.id);
    return res.status(200).json(cast);
  } catch (err) {
    return res.status(403).json(err);
  }
});
// get all
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const casts = await Casts.find();
      return res.status(200).json(casts.reverse());
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});

module.exports = router;
