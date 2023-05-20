const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    topic: {
      type: String,
    },
    content: {
      type: String,
    },
    spoiler: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
