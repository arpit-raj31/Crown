

import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay Key Secret
});

export default razorpayInstance;
