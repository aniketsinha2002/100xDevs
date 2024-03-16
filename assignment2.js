// IMPORTING LIBRARY
const express = require('express');
const mongoose = require("mongoose");

// EXPRESS MANDATORY STUFFS 
const app = express();
app.use(express.json());

// CONNECTING WITH DATABASE
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster0.43okpcx.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true });

// CREATION OF MODEL / SCHEMA
const User = mongoose.model("User", {
  name: String,
  username: String,
  email: String,
  password: String,
});

// CREATE OPERATION
// POST REQUEST
app.post("/users/:username", async (req, res) => {
  const { username } = req.params;
  
  // GETTING DATA FROM POST REQUEST BODY
  const { name, email, password } = req.body;
  // CHECKING IF USER ALREADY EXISTS IN DATABASE
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).send("User already exists");
  }
  // IF NEW USER → USER ENTRY IN THE MODEL
  const newUser = new User({
    name,
    username,
    email,
    password,
  });
  // SAVING THE USER
  await newUser.save();
  res.json({
    "msg": "User created successfully",
  });
});

// READ OPERATION
// GET REQUEST
app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// UPDATE OPERATION
// PUT REQUEST
app.put("/users/:username", async (req, res) => {
  const { username } = req.params;
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    await user.save();
    res.json({ msg: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE OPERATION
// DELETE REQUEST
app.delete("/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const deletedUser = await User.deleteOne({ username: username });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).send("User not found");
    }
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// LISTENING SERVER AT PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
