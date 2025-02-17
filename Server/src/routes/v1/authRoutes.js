import express from 'express';
import { register, login, validateToken, logout } from '../../controllers/authController.js';
import { confirmEmail, confirmEmailSentOtp, forgotPassword, resetPassword } from '../../controllers/nodemailerController.js';

const router = express.Router();


router.post('/register', register);         
router.post('/login', login);                
router.get('/validate-token', validateToken); 
router.post('/logout', logout);             

// password reset

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post("/send-email",confirmEmailSentOtp);
router.post("/confirm-email",confirmEmail);

export default router;