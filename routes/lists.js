const express = require("express");
const List = require("../models/List");
const verify = require("./verifyToken");

const router = express.Router();

// Create
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      return res.status(200).json(savedList);
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});
// Delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      return res.status(200).json("list have been deleted");
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});
// Get
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  const sizeQuery = parseInt(req.query.size) || 10;
  let list = [];

  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: sizeQuery ? sizeQuery : 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: sizeQuery ? sizeQuery : 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([
        { $sample: { size: sizeQuery ? sizeQuery : 10 } },
      ]);
    }
    return res.status(200).json(list);
  } catch (err) {
    return res.status(401).json(err);
  }
});

module.exports = router;
