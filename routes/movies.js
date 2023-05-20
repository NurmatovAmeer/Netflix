const express = require("express");
const Movie = require("../models/Movie");
const verify = require("./verifyToken");
const User = require("../models/User");

const router = express.Router();

// Create
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      return res.status(200).json(savedMovie);
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
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      return res.status(200).json(updatedMovie);
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});
// Update All
router.post("/updateall", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.updateMany(
        { limit: 16 },
        {
          $set: {
            video:
              "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
          },
        },
        { new: true }
      );
      return res.status(200).json(updatedMovie);
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
      await Movie.findByIdAndDelete(req.params.id);
      return res.status(200).json("Movie has been deleted");
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
    const movie = await Movie.findById(req.params.id);
    const { score, ...others } = movie._doc;
    let overall = 0;
    let hasValue = 0;
    score.forEach((element) => {
      if (element.value) {
        overall = overall + element.value;
        hasValue = hasValue + 1;
      }
    });
    others.overall = overall / hasValue;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(200).json(err);
  }
});
// get random
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    return res.status(200).json(movie);
  } catch (err) {
    return res.status(200).json(err);
  }
});
// get all
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      return res.status(200).json(movies.reverse());
    } catch (err) {
      return res.status(200).json(err);
    }
  } else {
    return res.status(403).json({ message: "you are not allowed" });
  }
});
// Get Liked
router.get("/liked/:id", verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const list = await Promise.all(
      user.liked.map(async (liked) => {
        const movie = await Movie.findById(liked);
        const { score, ...others } = movie._doc;
        let overall = 0;
        let hasValue = 0;
        score.forEach((element) => {
          if (element.value) {
            overall = overall + element.value;
            hasValue = hasValue + 1;
          }
        });
        others.overall = overall / hasValue;
        return others;
      })
    );
    console.log(list);

    return res.status(200).json(list);
  } catch (err) {
    return res.status(200).json(err);
  }
});

// search with query
router.get("/search", verify, async (req, res) => {
  try {
    const { search } = req.query;

    let movies = await Movie.find({
      title: { $regex: new RegExp(search, "i") },
    });

    if (!search) {
      return res.json({ message: "there is no search" });
    }

    return res.json(movies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// https://vod-progressive.akamaized.net/exp=1674667028~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F4286%2F14%2F371433846%2F1541905617.mp4~hmac=3bcdf1b52d18b69ea0ad8374816aaff085cb2b3ef5eb665726c6a73772baf416/vimeo-prod-skyfire-std-us/01/4286/14/371433846/1541905617.mp4
// videos
// https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500
