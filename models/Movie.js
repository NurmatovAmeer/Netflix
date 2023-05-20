const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    img: {
      type: String,
    },
    imgTitle: {
      type: String,
    },
    imgSm: {
      type: String,
    },
    quality: {
      type: Number,
      default: 720,
    },
    availableSeries: {
      type: Number,
      default: 1,
    },
    company: {
      type: String,
    },
    trailer: {
      type: String,
    },
    video: {
      type: String,
    },
    limit: {
      type: Number,
    },
    year: {
      type: Number,
    },
    genre: {
      type: String,
    },
    duration: {
      type: String,
    },
    isSeries: {
      type: Boolean,
      default: false,
    },
    casts: {
      type: Array,
    },
    score: [{ _id: String, value: { type: Number } }],
    comments: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
