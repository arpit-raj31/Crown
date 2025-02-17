import express from "express";
import { createOrder, handleCallback, getOrder } from "./../../controllers/binancePayController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/callback", handleCallback);
router.get("/order/:id", getOrder);

export default router;
