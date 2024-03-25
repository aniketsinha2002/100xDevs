// IMPORT EXPRESS AND MONGOOSE LIBRARIES
const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");

// CREATE ROUTER OBJECT
const router = express.Router();

// ROUTE TO GET ACCOUNT BALANCE
router.get("/balance", authMiddleware, async (req, res) => {
  // FIND ACCOUNT BY USER ID
  const account = await Account.findOne({ userId: req.userId });

  // SEND RESPONSE WITH ACCOUNT BALANCE
  res.json({
    balance: account.balance,
  });
});

// ROUTE TO TRANSFER MONEY BETWEEN ACCOUNTS
router.post("/transfer", authMiddleware, async (req, res) => {
  // START MONGOOSE TRANSACTION
  const session = await mongoose.startSession();
  session.startTransaction();

  // EXTRACT AMOUNT AND DESTINATION FROM REQUEST BODY
  const { amount, to } = req.body;

  // FETCH SENDER ACCOUNT WITHIN THE TRANSACTION
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  // CHECK IF SENDER ACCOUNT EXISTS AND HAS ENOUGH BALANCE
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  // FETCH RECEIVER ACCOUNT WITHIN THE TRANSACTION
  const toAccount = await Account.findOne({ userId: to }).session(session);

  // CHECK IF RECEIVER ACCOUNT EXISTS
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // PERFORM THE TRANSFER: DEDUCT AMOUNT FROM SENDER AND ADD TO RECEIVER
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: +amount } }
  ).session(session);

  // COMMIT THE TRANSACTION
  await session.commitTransaction();

  // SEND RESPONSE
  res.json({
    message: "Transfer successful",
  });
});

// EXPORT THE ROUTER
module.exports = router;
