import express from 'express';
import {  updateProfile, deleteProfile } from './../../controllers/profileController.js';
import { authenticateToken } from '../../middleware/auth/auth.js';
const router = express.Router();


router.put('/:id', authenticateToken ,updateProfile);
router.delete('/:id', authenticateToken, deleteProfile);
export default router;

