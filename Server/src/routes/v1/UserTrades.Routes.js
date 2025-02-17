import express from 'express';
import { openTrade, closeTrade, getTradeHistory } from '../../controllers/UserTradesController.js';
import { authenticateToken } from '../../middleware/auth/auth.js';

const router = express.Router();

// Open a new trade (POST /trades/open)
router.post('/open', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extracted from the verified JWT
    const tradeData = req.body;

    try {
        const newTrade = await openTrade(userId, tradeData);
        res.status(201).json({ success: true, trade: newTrade });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
// Close an existing trade (PUT /trades/close/:tradeId)
router.put('/close/:tradeId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { closePrice } = req.body;
    const { tradeId } = req.params;

    try {
        const { trade, triggerReason } = await closeTrade(userId, tradeId, closePrice);
        res.status(200).json({
            success: true,
            trade,
            message: `Trade closed: ${triggerReason}`,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get trade history for a user (GET /trades/history)
router.get('/all', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extracted from the verified JWT

    try {
        const tradeHistory = await getTradeHistory(userId);
        res.status(200).json({ success: true, trades: tradeHistory });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;