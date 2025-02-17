import nodemailer from 'nodemailer';  // ES Modules import

// Create a transporter object using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'quantstechalgo@gmail.com',           // Your Gmail address
    pass: 'xgam sgiy qdna rphp',              // Your 16-character App Password
  },
});

// Define email details
const mailOptions = {
  from: 'krishna201sahu@gmail.com',             // Sender address
  to: 'ksahu20017@gmail.com',        // Recipient address
  subject: 'Test Email from Nodemailer',    // Subject
  text: 'Hello, this is a test email!'      // Body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});


