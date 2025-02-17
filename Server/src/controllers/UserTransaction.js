import LiveAccount from '../models/User.LiveAccount.model.js';
import LiveTransaction from '../models/User.LiveAccTransactions.js';

export const addDemoTransaction = async (req, res) => {
  const { userId, type, amount, description } = req.body;

  if (!userId || !type || !amount) {
    return res.status(400).json({ message: 'User ID, type, and amount are required.' });
  }

  try {
    // Find the demo account for the user
    const liveAccount = await LiveAccount.findOne({ user: userId });
    if (!liveAccount) {
      return res.status(404).json({ message: 'Demo account not found.' });
    }

    // Create a new transaction
    const newTransaction = new LiveTransaction({
      user: userId,
      type,
      amount,
      description,
    });

    // Save the transaction
    const savedTransaction = await newTransaction.save();

    // Add the transaction to the demo account
    liveAccount.transactions.push(savedTransaction._id);
    await liveAccount.save();

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction: savedTransaction,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error adding transaction',
      error: err.message,
    });
  }
};

