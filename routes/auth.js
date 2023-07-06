const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { secretKey } = require('../index');

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });

  bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser
        .save()
        .then(() =>
          res.status(201).json({ message: "User registered successfully" })
        )
        .catch((err) => res.status(500).json({ error: err.message }));
    });
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      //   console.log(user.comparePassword(password));
      if (!user || !user.comparePassword(password)) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      console.log(secretKey);
      const token = jwt.sign({ id: user._id }, secretKey);
      res.json({ token });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
