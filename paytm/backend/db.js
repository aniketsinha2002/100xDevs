// IMPORT MONGOOSE LIBRARY
const mongoose = require("mongoose");

// CONNECT TO MONGODB DATABASE
mongoose.connect(
  "mongodb+srv://aniketsinha2002:Sinha2002@cluster0.43okpcx.mongodb.net/paytm"
);

// DEFINE USER SCHEMA
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

// DEFINE ACCOUNT SCHEMA
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

// CREATE MODELS FROM SCHEMAS
const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

// EXPORT MODELS
module.exports = { User, Account };
