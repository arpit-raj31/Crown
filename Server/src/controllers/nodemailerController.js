import bcrypt from 'bcryptjs';

import User from '../models/User.js';
// import LiveAccount from '../models/User.LiveAccount.model.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { sendEmail } from '../utils/emailSender.js';
import dotenv from 'dotenv';

dotenv.config();



let otpStore = new Map();


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // Generate a 6-digit OTP
    const otp = generateOTP(); // Assuming generateOTP is defined elsewhere
    const otpExpiresAt = Date.now() + parseInt(process.env.OTP_EXPIRATION, 10); // Default: 5 mins

    // Store OTP in-memory
    otpStore.set(email, { otp, expiresAt: otpExpiresAt });

    // Send OTP email
    await sendEmail(email, otp); // Pass only the email and OTP

    res.send('OTP sent to your email');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP email');
  }
};


/**
 * Reset Password - Verifies OTP and updates the user's password.
 */

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check if OTP exists
    const otpData = otpStore.get(email);
    if (!otpData) return res.status(400).send('OTP not requested or expired');

    // Validate OTP and expiration
    if (otpData.otp !== otp) return res.status(400).send('Invalid OTP');
    if (otpData.expiresAt < Date.now()) {
      otpStore.delete(email); // Clear expired OTP
      return res.status(400).send('OTP has expired');
    }

    // Update the user's password
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    user.password = await bcrypt.hash(newPassword, 10); // Hash the password
    await user.save();

    // Clear OTP after successful operation
    otpStore.delete(email);

    res.send('Password has been reset successfully');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Error resetting password');
  }
};

export const confirmEmailSentOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // Generate a 6-digit OTP
    const otp = generateOTP(); // Assuming generateOTP generates a random OTP
    const otpExpiresAt = Date.now() + parseInt(process.env.OTP_EXPIRATION, 10) * 1000; // OTP expiration time in milliseconds (default: 5 mins)

    // Store OTP in-memory (You may want to store it in a DB for persistence)
    otpStore.set(email, { otp, expiresAt: otpExpiresAt });

    // Send OTP email
    await sendEmail(email, otp); // Assuming sendEmail sends an OTP to the provided email address

    res.send('OTP sent to your email');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP email');
  }
};

// Function to verify the OTP
export const confirmEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if OTP exists for this email
    const otpData = otpStore.get(email);
    if (!otpData) return res.status(400).send('OTP not found, please request a new OTP');

    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(email); // Delete expired OTP
      return res.status(400).send('OTP has expired, please request a new OTP');
    }

    // Verify the OTP
    if (otpData.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    // OTP is valid, mark email as verified
    const user = await User.findOne({ email });
    if (user) {
      user.emailVerified = true; // Update the user record (emailVerified field)
      await user.save();
    }

    // Delete OTP from the store after use
    otpStore.delete(email);

    res.send('Email verified successfully');
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).send('Error verifying OTP');
  }
};


// export const SendUuid = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if OTP exists for this email
//     const otpData = otpStore.get(email);
//     if (!otpData) return res.status(400).send('OTP not found, please request a new OTP');

//     // Check if OTP has expired
//     if (Date.now() > otpData.expiresAt) {
//       otpStore.delete(email); // Delete expired OTP
//       return res.status(400).send('OTP has expired, please request a new OTP');
//     }

//     // Verify the OTP
//     if (otpData.otp !== otp) {
//       return res.status(400).send('Invalid OTP');
//     }

//     // OTP is valid, mark email as verified
//     const user = await User.findOne({ email });
//     if (user) {
//       user.emailVerified = true; // Update the user record (emailVerified field)
//       await user.save();
//     }

//     // Delete OTP from the store after use
//     otpStore.delete(email);

//     res.send('Email verified successfully');
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).send('Error verifying OTP');
//   }
// };


