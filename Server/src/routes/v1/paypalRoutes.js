
import express from 'express';
import { createOrder, capturePayment } from './../../controllers/paypalController.js';

const router = express.Router();

// Route to create a new PayPal order
router.post('/create-order', createOrder);

// Route to capture the payment after approval
router.post('/capture-payment', capturePayment);

export default router;
