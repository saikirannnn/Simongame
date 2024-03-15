const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;
const router = express.Router();

router.get("/verify", async (req, res) => {
  // This route is not needed for simple registration without nodemailer functionality
  res.status(404).send({ message: "Not Found" });
});

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ message: "Incomplete data" });
    }

    const user = await User.findOne({ $or: [{ username: username }, { emailId: email }] });
    if (user) {
      return res.status(409).send({ message: "User is already registered" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      username: username,
      emailId: email,
      password: hash // Store the hashed password in the database
    });
    await newUser.save();

    return res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
