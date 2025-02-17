import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    binanceOrderId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
