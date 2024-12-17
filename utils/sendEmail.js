const nodemailer = require('nodemailer');

// Create a transporter for SMTP service
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any service like Gmail, SendGrid, etc.
  auth: {
    user: process.env.SMTP_EMAIL,  // Your email
    pass: process.env.SMTP_PASSWORD, // Your email password or app-specific password
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL, // Sender's email
      to: to, // Recipient's email
      subject: subject, // Email subject
      text: text, // Email body
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
