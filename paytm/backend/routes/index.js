// IMPORT EXPRESS FRAMEWORK
const express = require("express");

// CREATE ROUTER OBJECT
const router = express.Router();

// IMPORT USER AND ACCOUNT ROUTERS
const userRouter = require("./user");
const accountRouter = require("./account");

// USE USER ROUTER FOR ROUTES STARTING WITH '/user'
router.use("/user", userRouter);

// USE ACCOUNT ROUTER FOR ROUTES STARTING WITH '/account'
router.use("/account", accountRouter);

// EXPORT THE ROUTER
module.exports = router;
