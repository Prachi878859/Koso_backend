require('dotenv').config(); // Add this line to load .env file
const nodemailer = require('nodemailer');

console.log("📧 Loading email configuration...");
console.log("SMTP_USER from env:", process.env.SMTP_USER);

// Email configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'companytest128@gmail.com',
    pass: process.env.SMTP_PASS || 'gyed osbr wtyt akzj'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection with better error handling
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email server connection error:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error command:', error.command);
    
    // Common solutions
    if (error.code === 'EAUTH') {
      console.log('\n🔧 For Gmail App Password issues:');
      console.log('1. Make sure you are using an App Password (16 chars) not regular password');
      console.log('2. Enable 2-Step Verification in Google Account');
      console.log('3. Generate App Password at: https://myaccount.google.com/apppasswords');
      console.log('4. Select "Mail" and "Other" when generating');
    }
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log(`📧 Using: ${process.env.SMTP_USER}`);
  }
});

module.exports = transporter;