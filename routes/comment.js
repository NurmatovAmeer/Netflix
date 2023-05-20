const express = require("express");
const Comment = require("../models/Comment");
const Movie = require("../models/Movie");
const verify = require("./verifyToken");

const router = express.Router();

// Create
router.post("/:id", verify, async (req, res) => {
  if (req.user) {
    req.body.userId = req.user.id;
    const newComment = new Comment(req.body);
    try {
      const savedComment = await newComment.save();
      await Movie.findByIdAndUpdate(req.params.id, {
        $push: {
          comments: savedComment._id,
          score: { _id: savedComment._id, value: savedComment.score },
        },
      });
      return res.status(200).json(savedComment);
    } catch (err) {
      return res.status(200).json(err);
    }
  }
});
// delete
router.delete("/:id/:movieid", verify, async (req, res) => {
  const movieId = req.params.movieid;
  try {
    await Comment.findByIdAndDelete(req.params.id);
    try {
      await Movie.findByIdAndUpdate(movieId, {
        $pull: { comments: req.params.id },
      });
      await Movie.updateOne(
        { _id: movieId },
        { $pull: { score: { _id: req.params.id } } }
      );
    } catch (err) {
      return res
        .status(400)
        .json({ message: "comment controller delete inner error" });
    }
    return res.status(200).json("Comment has been deleted");
  } catch (err) {
    return res.status(200).json(err);
  }
});
// get
router.get("/find/:id", verify, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(403).json(err);
  }
});

module.exports = router;
