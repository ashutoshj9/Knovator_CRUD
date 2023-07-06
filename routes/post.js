const express = require("express");
const router = express.Router();
const passport = require("passport");
const Post = require("../models/post");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { title, body, latitude, longitude } = req.body;

    const newPost = new Post({
      title,
      body,
      createdBy: req.user._id,
      geoLocation: {
        latitude,
        longitude,
      },
    });

    newPost
      .save()
      .then(() =>
        res.status(201).json({ message: "Post created successfully" })
      )
      .catch((err) => res.status(500).json({ error: err.message }));
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ createdBy: req.user._id })
      .then((posts) => res.json(posts))
      .catch((err) => res.status(500).json({ error: err.message }));
  }
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const postId = req.params.id;

    Post.findOne({ _id: postId, createdBy: req.user._id })
      .then((post) => {
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  }
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const postId = req.params.id;
    const { title, body, latitude, longitude, active } = req.body;

    Post.findOneAndUpdate(
      { _id: postId, createdBy: req.user._id },
      { title, body, geoLocation: { latitude, longitude }, active },
      { new: true }
    )
      .then((post) => {
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        res.json(post);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const postId = req.params.id;

    Post.findOneAndDelete({ _id: postId, createdBy: req.user._id })
      .then((post) => {
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        res.json({ message: "Post deleted successfully" });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  }
);

router.get("/geo/:latitude/:longitude", (req, res) => {
  const { latitude, longitude } = req.params;

  Post.find({
    "geoLocation.latitude": latitude,
    "geoLocation.longitude": longitude,
  })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.get(
  "/dashboard/count",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.aggregate([
      {
        $match: {
          createdBy: req.user._id,
        },
      },
      {
        $group: {
          _id: "$active",
          count: { $sum: 1 },
        },
      },
    ])
      .then((result) => {
        const counts = {
          active: 0,
          inactive: 0,
        };

        result.forEach((group) => {
          if (group._id === true) {
            counts.active = group.count;
          } else {
            counts.inactive = group.count;
          }
        });

        res.json(counts);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  }
);

module.exports = router;
