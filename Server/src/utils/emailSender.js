import nodemailer from 'nodemailer';

// Fun lines for the email
const funLines = [
  "🤔 Lost your password? Let's fix that! 🛠️",
  "🚀 Quants Tech Algo is here to save the day! 💪",
  "🎉 Here's a magic number just for you! ✨",
  "🔒 Your security is our priority. Use this OTP wisely! 🧙",
  "🌟 Let the password-reset journey begin! 🌈",
];

// Helper function to send styled email
export const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service if not Gmail
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your app-specific password or regular password
    },
  });

  // Select a random fun line
  const funLine = funLines[Math.floor(Math.random() * funLines.length)];

  // HTML content for the email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px; max-width: 400px; margin: auto; background: #f9f9f9;">
      <h2 style="color: #4CAF50;">🔑 Reset Your Password - Quants Tech Algo</h2>
      <p style="font-size: 16px;">${funLine}</p>
      <p style="font-size: 18px; font-weight: bold; color: #333;">Your OTP: <span style="color: #4CAF50; font-size: 24px;">${otp}</span></p>
      <p style="font-size: 14px; color: #555;">(It will expire in 5 minutes, so be quick! ⏳)</p>
      <div style="margin-top: 20px;">
        <img src="https://via.placeholder.com/150x150?text=Quants+Tech+Algo" alt="Logo" style="width: 100px; border-radius: 50%;" />
      </div>
      <footer style="margin-top: 20px; font-size: 12px; color: #aaa;">
        <p>Made with ❤️ by Quants Tech Algo</p>
        <p>Contact us if you didn't request this email.</p>
      </footer>
    </div>
  `;

  // Sending the email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP - Quants Tech Algo",
    html: htmlContent,
  });
};
