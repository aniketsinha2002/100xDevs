// IMPORT EXPRESS FRAMEWORK
const express = require("express");

// CREATE ROUTER OBJECT
const router = express.Router();

// IMPORT ZOD FOR VALIDATION, USER MODEL, JWT_SECRET FROM CONFIG FILE, JSONWEBTOKEN MODULE, AUTHENTICATION MIDDLEWARE
const zod = require("zod");
const { User, Account } = require("../db");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");

// SIGNUP SCHEMA DEFINITION FOR INPUT VALIDATION
const signupSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
});

// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const { success } = signupSchema.safeParse(req.body);

  // CHECK IF VALIDATION SUCCESSFUL
  if (!success) {
    return res.json({
      message: "Incorrect Input",
    });
  }

  // CHECK IF USERNAME ALREADY EXISTS
  const existingUser = await User.findOne({
    username: username,
  });

  if (existingUser) {
    return res.json({
      message: "Email already taken",
    });
  }

  // CREATE NEW USER
  const newUser = await User.create({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });

  const userId = newUser._id;

  //GIVE RANDOM BALENCE WHEN USER SIGNS UP - CREATE AN ACCOUNT
  await Account.create({ userId, balance: 1 + Math.random() * 10000 });

  // GENERATE JWT TOKEN
  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

  // SEND RESPONSE
  res.json({
    message: "User created successfully",
    token: token,
  });
});

// SIGNIN SCHEMA DEFINITION FOR INPUT VALIDATION
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

// SIGNIN ROUTE
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const { success } = signinBody.safeParse(req.body);

  //CHECK IF VALIDATION SUCCESSFUL
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  // FIND USER BY USERNAME AND PASSWORD
  const existingUser = await User.findOne({
    username: username,
    password: password,
  });

  if (existingUser) {
    // GENERATE JWT TOKEN
    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
    // SEND TOKEN IN RESPONSE
    res.json({ token: token });
    return;
  }

  // RETURN ERROR IF USER NOT FOUND
  res.status(411).json({
    message: "User not found",
  });
});

// UPDATE SCHEMA DEFINITION FOR INPUT VALIDATION
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

// UPDATE USER INFORMATION ROUTE
router.put("/", authMiddleware, async (req, res) => {
  const { success, data } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  // GET USER ID FROM AUTHENTICATION MIDDLEWARE
  const userId = req.userId;

  // UPDATE USER INFORMATION
  await User.updateOne({ _id: userId }, data);

  // SEND SUCCESS MESSAGE
  res.json({
    message: "Updated successfully",
  });
});

// BULK USER RETRIEVAL ROUTE
router.get("/bulk", async (req, res) => {
  // GET FILTER FROM QUERY PARAMETER OR SET TO AN EMPTY STRING
  const filter = req.query.filter || "";

  // FIND USERS BASED ON FILTER
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  // SEND RESPONSE
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

// EXPORT THE ROUTER
module.exports = router;
