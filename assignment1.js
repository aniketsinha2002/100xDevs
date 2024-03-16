// IMPORTING LIBRARIES
const express = require('express');
const mongoose = require('mongoose');

// EXPRESS MANDATORY STUFFS
const app = express();
app.use(express.json());

// CONNECTING WITH DATABASE
mongoose.connect('mongodb+srv://USERNAME:PASSWORD@cluster0.43okpcx.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// CREATION OF MODEL / SCHEMA
const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

// POST REQUEST
app.post('/signup', async (req, res) => {
  // GETTING DATA FROM POST REQUEST BODY
  const { name, username, email, password } = req.body;

  // CHECKING IF USER ALREADY EXISTS IN DATABASE
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  // IF NEW USER → USER ENTRY IN THE MODEL
  const newUser = new User({
    name,
    username,
    email,
    password
  });

  // SAVING THE USER
  await newUser.save();

  res.json({
    msg: 'User created successfully'
  });
});

// LISTENING SERVER AT PORT
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});