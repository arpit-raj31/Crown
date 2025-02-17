// routes/razorpayRoutes.js

import express from "express";
import { createOrder, verifyPayment } from "./../../controllers/razarpayController.js";

const router = express.Router();

// POST: Create a new Razorpay order
router.post("/create-order", createOrder);

// POST: Verify Razorpay payment
router.post("/verify-payment", verifyPayment);

export default router;
