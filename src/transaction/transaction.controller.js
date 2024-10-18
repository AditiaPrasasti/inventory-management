const express = require("express");
const router = express.Router();
const transactionService = require("./transaction.service");
const authorizeJWT = require("../middleware/authorizeJWT");
const adminAuthorization = require("../middleware/adminAuthorization");

// Borrow Item
router.post("/borrow", authorizeJWT, async (req, res) => {
  try {
    // const userId = req.userId;
    const userId = req.userId;
    const { itemId, quantityBorrowed } = req.body;

    const newTransaction = await transactionService.borrowItem(
      userId,

      itemId,

      quantityBorrowed
    );

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get All Transactions
router.get("/", adminAuthorization, async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.send(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get Transactions by User ID
router.get("/user", authorizeJWT, async (req, res) => {
  const userId = req.userId;

  try {
    const transactions = await transactionService.getTransactionsByUserId(
      userId
    );

    res.send(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Verify Transaction
router.patch("/verify/:transactionId", adminAuthorization, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const { status } = req.body;

    await transactionService.verifyTransaction(transactionId, status);

    res.status(200).json({ message: "Transaction verified successfully." });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Return Item
router.post("/return/:transactionId", authorizeJWT, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const userId = req.userId;

    const transaction = await transactionService.getTransactionById(
      transactionId
    );

    if (transaction.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await transactionService.returnItem(transactionId);

    res.status(200).json({ message: "Item returned" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
