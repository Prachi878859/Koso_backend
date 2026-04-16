require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("📧 Loading email configuration...");
console.log("SMTP_USER from env:", process.env.SMTP_USER);
console.log("SMTP_HOST from env:", process.env.SMTP_HOST);
console.log("SMTP_PORT from env:", process.env.SMTP_PORT);

// Remove spaces from password if they exist
const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s/g, '') : '';

// Email configuration - USE HOST/PORT instead of service
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // false for port 587
  auth: {
    user: process.env.SMTP_USER || 'companytest128@gmail.com',
    pass: smtpPass
  },
  // Add this for better debugging
  debug: true,
  logger: true
};

console.log("📧 Email config:", {
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  user: emailConfig.auth.user,
  passExists: !!emailConfig.auth.pass
});

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection with better error handling
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email server connection error:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error command:', error.command);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 For Gmail App Password issues:');
      console.log('1. Make sure you are using an App Password (16 chars) not regular password');
      console.log('2. Enable 2-Step Verification in Google Account');
      console.log('3. Generate App Password at: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ESOCKET') {
      console.log('\n🔧 Connection refused - Your hosting provider is blocking SMTP ports');
      console.log('Contact SparklersTech support to open outbound ports 587 or 465');
    }
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log(`📧 Using: ${emailConfig.auth.user} on port ${emailConfig.port}`);
  }
});





module.exports = transporter;


///// for the server 

// emailConfig.js - TEMPORARY for testing
// const nodemailer = require('nodemailer');

// // HARDCODE for testing (REMOVE AFTER TESTING)
// const emailConfig = {
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'companytest128@gmail.com',
//     pass: 'gyedosbrwtytakzj' // Your app password
//   },
//   debug: true,
//   logger: true,
//   tls: {
//     rejectUnauthorized: false
//   }
// };

// console.log("📧 Using hardcoded email config for testing");

// const transporter = nodemailer.createTransport(emailConfig);

// transporter.verify(function(error, success) {
//   if (error) {
//     console.error('❌ Email server connection error:', error);
//   } else {
//     console.log('✅ Email server is ready to send messages');
//   }
// });

// module.exports = transporter;