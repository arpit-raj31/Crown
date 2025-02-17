import express from 'express';
import authRoutes from './v1/routes.js';


const router = express.Router();


router.use('/api/v1/auth', authRoutes);

export default router;
