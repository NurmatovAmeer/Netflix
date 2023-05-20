const mongoose = require("mongoose");

const CastsSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    about: {
      type: String,
    },
    movies: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Casting", CastsSchema);
