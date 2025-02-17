const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accountId: { type: String, unique: true, required: true}, 
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  invPassword: { type: String },
  emailVerified: { type: Boolean, default: false },
  documentsVerified: { type: Boolean, default: false },
  book: { type: String, enum: ["A Book", "B Book"], default: "A Book" },
  fund: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  totalDeposit: { type: Number, default: 0 },
  totalWithdrawal: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
