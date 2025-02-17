import express from 'express';
import authRoutes from './authRoutes.js';
import adminroutes from './adminroutes.js';

import walletRoutes from './account.js';
import newsRoutes from "./newsRoutes.js";
import tradesRoutes from "./UserTrades.Routes.js";
import profileRoutes from "./profileRoutes.js";
const router = express.Router();

router.use('/user', authRoutes);

router.use('/admin', adminroutes);

router.use('/user/account', walletRoutes);
router.use("/news", newsRoutes);
router.use("/trades",tradesRoutes);
router.use("/user/profile",profileRoutes);

export default router;
