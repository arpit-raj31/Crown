const orderSchema = new mongoose.Schema({
  accountId: { type: String, required: true, ref: "User" }, 
  orderId: { type: String, unique: true, required: true },
  symbol: { type: String, required: true }, 
  lot: { type: Number, required: true }, 
  type: { type: String, enum: ["Buy", "Sell"], required: true },
  pnl: { type: Number, default: 0 }, 
  book: { type: String, enum: ["A Book", "B Book"], required: true },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
});


module.exports = mongoose.model("Order", orderSchema);