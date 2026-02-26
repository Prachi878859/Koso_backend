const transporter = require('../config/emailConfig');
const fs = require('fs');
const path = require('path');

console.log("📧 Email service initialized");

// Helper function to get logo attachment and HTML
const getLogoAttachment = () => {
  try {
    const logoPath = path.join(__dirname, '../assets/images/koso-logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      return {
        attachment: {
          filename: 'koso-logo.png',
          content: logoBuffer,
          cid: 'companylogo'
        },
        logoHtml: '<img src="cid:companylogo" alt="KOSO Application Logo" class="logo" />'
      };
    }
  } catch (error) {
    console.error("⚠️ Error reading logo file:", error.message);
  }
  
  // Fallback text logo
  return {
    attachment: null,
    logoHtml: '<h1 style="color: white; margin:0; font-size: 32px;">KOSO</h1>'
  };
};

const sendCredentialsEmail = async (toEmail, name, password) => {
  try {
    console.log(`📤 Preparing to send email to: ${toEmail}`);
    
    if (!toEmail || !name || !password) {
      console.error("❌ Missing required parameters for email");
      return false;
    }

    const { attachment, logoHtml } = getLogoAttachment();
    const attachments = attachment ? [attachment] : [];

    // Email content
    const mailOptions = {
      from: `"KOSO Application" <${process.env.SMTP_USER || 'companytest128@gmail.com'}>`,
      to: toEmail,
      subject: 'Welcome to KOSO Application - Your Account Credentials',
      attachments: attachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
            .header { background: linear-gradient(to right, rgb(255, 97, 97), #FF4D57); color: white; padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .logo-container { margin-bottom: 20px; }
            .logo { max-width: 150px; height: auto; display: inline-block; background: white; padding: 10px; border-radius: 10px; }
            .header h1 { margin: 10px 0 5px; font-size: 28px; }
            .header p { margin: 0; opacity: 0.9; }
            .content { padding: 30px 20px; background: #ffffff; }
            .credentials { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FF4D57; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .btn { display: inline-block; padding: 12px 30px; background: #FF4D57; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
            .btn:hover { background: #e0444d; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
            .highlight { color: #FF4D57; font-weight: bold; font-size: 16px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .security-box { background: #e8f4fd; border: 1px solid #b8e1ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                ${logoHtml}
              </div>
              <h1>KOSO Application</h1>
              <p>Welcome to our platform</p>
            </div>
            
            <div class="content">
              <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
              <p style="font-size: 16px;">Your account has been successfully created in the KOSO Application.</p>
              
              <div class="credentials">
                <h3 style="margin-top: 0; color: #FF4D57;">🔐 Your Login Credentials</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; width: 100px;"><strong>Email:</strong></td>
                    <td style="padding: 10px 0;"><span class="highlight">${toEmail}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong>Password:</strong></td>
                    <td style="padding: 10px 0;"><span class="highlight">${password}</span></td>
                  </tr>
                </table>
              </div>
              
              <div class="security-box">
                <h4 style="margin-top: 0; color: #0066cc;">📋 Important Security Notes:</h4>
                <ul>
                  <li>Please login and change your password immediately</li>
                  <li>Never share your credentials with anyone</li>
                  <li>This is an automated email, please do not reply</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="btn">
                  🔑 Login to Your Account
                </a>
              </div>
              
              <p style="margin-top: 25px; font-size: 14px; color: #666; text-align: center;">
                If you didn't request this account, please ignore this email.
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} KOSO Application. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `KOSO Application - Welcome!

Hello ${name},

Your account has been successfully created.

Your Login Credentials:
Email: ${toEmail}
Password: ${password}

Important Security Notes:
- Please login and change your password immediately
- Never share your credentials with anyone
- This is an automated email, please do not reply

Login URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

If you didn't request this account, please ignore this email.

© ${new Date().getFullYear()} KOSO Application. All rights reserved.`
    };

    console.log(`📨 Sending email from: ${mailOptions.from}`);
    console.log(`📨 Sending email to: ${mailOptions.to}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${toEmail}`);
    console.log(`📫 Message ID: ${info.messageId}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error sending email to ${toEmail}:`, error.message);
    return false;
  }
};

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  try {
    const { attachment, logoHtml } = getLogoAttachment();
    const attachments = attachment ? [attachment] : [];
    
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"KOSO Application" <${process.env.SMTP_USER || 'companytest128@gmail.com'}>`,
      to: toEmail,
      subject: 'Password Reset Request - KOSO Application',
      attachments: attachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
            .header { background: linear-gradient(to right, rgb(255, 97, 97), #FF4D57); color: white; padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .logo-container { margin-bottom: 20px; }
            .logo { max-width: 150px; height: auto; display: inline-block; background: white; padding: 10px; border-radius: 10px; }
            .header h1 { margin: 10px 0 5px; font-size: 28px; }
            .header p { margin: 0; opacity: 0.9; }
            .content { padding: 30px 20px; background: #ffffff; }
            .btn { display: inline-block; padding: 12px 30px; background: #FF4D57; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .btn:hover { background: #e0444d; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
            .note { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF4D57; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                ${logoHtml}
              </div>
              <h1>KOSO Application</h1>
              <p>Password Reset Request</p>
            </div>
            
            <div class="content">
              <h2 style="color: #333; margin-top: 0;">Hello,</h2>
              <p style="font-size: 16px;">You requested a password reset for your KOSO Application account.</p>
              
              <div class="note">
                <p style="margin: 0;">Click the button below to reset your password. This link will expire in 1 hour.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="btn">
                  🔑 Reset Password
                </a>
              </div>
              
              <p style="margin-top: 25px; font-size: 14px; color: #666; text-align: center;">
                If you didn't request this, please ignore this email or contact support if you have concerns.
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} KOSO Application. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `KOSO Application - Password Reset Request

Hello,

You requested a password reset for your KOSO Application account.

Click the link below to reset your password (expires in 1 hour):
${resetLink}

If you didn't request this, please ignore this email or contact support.

© ${new Date().getFullYear()} KOSO Application. All rights reserved.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${toEmail}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error sending password reset email:`, error);
    return false;
  }
};

const sendUpdateEmail = async (email, name, subject, message, newPassword = null) => {
  try {
    console.log(`📧 Preparing to send update email to: ${email}`);
    
    const { attachment, logoHtml } = getLogoAttachment();
    const attachments = attachment ? [attachment] : [];
    
    const mailOptions = {
      from: `"KOSO Application" <${process.env.SMTP_USER || 'companytest128@gmail.com'}>`,
      to: email,
      subject: subject || 'KOSO Application - Account Update',
      attachments: attachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
            .header { background: linear-gradient(to right, rgb(255, 97, 97), #FF4D57); color: white; padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .logo-container { margin-bottom: 20px; }
            .logo { max-width: 150px; height: auto; display: inline-block; background: white; padding: 10px; border-radius: 10px; }
            .header h1 { margin: 10px 0 5px; font-size: 28px; }
            .header p { margin: 0; opacity: 0.9; }
            .content { padding: 30px 20px; background: #ffffff; }
            .credentials-box { background: #f8f9fa; border-left: 4px solid #4CAF50; 
                              padding: 20px; margin: 20px 0; border-radius: 8px; 
                              box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; 
                       color: #856404; padding: 15px; border-radius: 8px; 
                       margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; 
                      font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            .btn { display: inline-block; padding: 12px 30px; background: #FF4D57; 
                   color: white; text-decoration: none; border-radius: 5px; 
                   font-weight: bold; margin: 15px 0; }
            .btn:hover { background: #e0444d; }
            .highlight { background-color: #fffacd; padding: 2px 8px; 
                        border-radius: 3px; font-weight: bold; color: #FF4D57; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                ${logoHtml}
              </div>
              <h1>KOSO Application</h1>
              <p>Account Update Notification</p>
            </div>
            
            <div class="content">
              <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
              
              <p style="font-size: 16px;">${message}</p>
              
              ${newPassword ? `
              <div class="credentials-box">
                <h3 style="margin-top: 0; color: #4CAF50;">📋 Your Updated Credentials</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; width: 120px;"><strong>Email:</strong></td>
                    <td style="padding: 10px 0;"><span class="highlight">${email}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong>New Password:</strong></td>
                    <td style="padding: 10px 0;"><span class="highlight">${newPassword}</span></td>
                  </tr>
                </table>
                
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="btn">
                    🔑 Login Now
                  </a>
                </div>
              </div>
              ` : ''}
              
              ${newPassword ? `
              <div class="warning">
                <h4 style="margin-top: 0;">⚠️ Security Notice</h4>
                <p>For your security, we recommend:</p>
                <ul>
                  <li>Logging in immediately with your new credentials</li>
                  <li>Changing your password after first login</li>
                  <li>Not sharing your credentials with anyone</li>
                </ul>
              </div>
              ` : ''}
              
              <p style="margin-top: 25px; font-size: 14px; color: #666; text-align: center;">
                If you have any questions, please contact our support team.
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} KOSO Application. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `KOSO Application - Account Update

Hello ${name},

${message}

${newPassword ? `
Your Updated Credentials:
Email: ${email}
New Password: ${newPassword}

Login URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

Security Notice:
- Log in immediately with your new credentials
- Change your password after first login
- Never share your credentials with anyone
` : ''}

If you have any questions, please contact our support team.

© ${new Date().getFullYear()} KOSO Application. All rights reserved.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Update email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending update email to ${email}:`, error);
    return false;
  }
};

// config/emailService.js - Add this function

const resendCredentialsEmail = async (toEmail, name, password) => {
  try {
    console.log(`📤 Preparing to resend credentials email to: ${toEmail}`);
    
    if (!toEmail || !name || !password) {
      console.error("❌ Missing required parameters for resend email");
      return false;
    }

    // Path to your logo image
    const logoPath = path.join(__dirname, '../assets/images/koso-logo.png');
    
    // Read the image file
    const logoBuffer = fs.readFileSync(logoPath);

    // Email content with CID reference
    const mailOptions = {
      from: `"KOSO Application" <${process.env.SMTP_USER || 'companytest128@gmail.com'}>`,
      to: toEmail,
      subject: 'KOSO Application - Your Account Credentials (Resent)',
      attachments: [
        {
          filename: 'logo.png',
          content: logoBuffer,
          cid: 'companylogo' // Same CID used in img src
        }
      ],
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
            .header { background: linear-gradient(to right, rgb(255, 97, 97), #FF4D57); color: white; padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .logo-container { margin-bottom: 20px; }
            .logo { max-width: 150px; height: auto; display: inline-block; background: white; padding: 10px; border-radius: 10px; }
            .header h1 { margin: 10px 0 5px; font-size: 28px; }
            .header p { margin: 0; opacity: 0.9; }
            .content { padding: 30px 20px; background: #ffffff; }
            .credentials { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FF4D57; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .btn { display: inline-block; padding: 12px 30px; background: #FF4D57; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
            .btn:hover { background: #e0444d; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
            .highlight { color: #FF4D57; font-weight: bold; font-size: 16px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .security-box { background: #e8f4fd; border: 1px solid #b8e1ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-container">
                <!-- Image referenced by CID -->
                <img src="cid:companylogo" alt="KOSO Application Logo" class="logo" />
              </div>
              <h1>KOSO Application</h1>
              <p>Your Account Credentials (Resent)</p>
            </div>
            
            <div class="content">
              <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
              <p style="font-size: 16px;">We are resending your account credentials as requested.</p>
              
              <div class="warning">
                <p><strong>⚠️ Security Alert:</strong> This email contains your login credentials. Please keep them secure and do not share them with anyone.</p>
              </div>
              
              <div class="credentials">
                <h3 style="margin-top: 0; color: #FF4D57;">🔐 Your Login Credentials</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; width: 100px;"><strong>Email:</strong></td>
                    <td style="padding: 10px 0;"><span class="highlight">${toEmail}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong>Password:</strong></td>
                    <td style="padding: 10px 0;"><span class="highlight">${password}</span></td>
                  </tr>
                </table>
              </div>
              
              <div class="security-box">
                <h4 style="margin-top: 0; color: #0066cc;">📋 Important Security Notes:</h4>
                <ul>
                 
                  <li>Never share your credentials with anyone</li>
                  <li>Enable two-factor authentication for additional security</li>
                  <li>This email was sent at your request on ${new Date().toLocaleString()}</li>
                </ul>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="btn">
                  🔑 Login to Your Account
                </a>
              </div>
              
              <p style="margin-top: 25px; font-size: 14px; color: #666; text-align: center;">
                If you didn't request these credentials, please contact our support team immediately.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Requested on:</strong> ${new Date().toLocaleString()}</p>
              <p>&copy; ${new Date().getFullYear()} KOSO Application. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 11px;">This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `KOSO Application - Your Account Credentials (Resent)

Hello ${name},

We are resending your account credentials as requested.

⚠️ SECURITY ALERT: This email contains your login credentials. Please keep them secure.

Your Login Credentials:
Email: ${toEmail}
Password: ${password}

Important Security Notes:
- This is your current password - we recommend changing it after login
- Never share your credentials with anyone
- Enable two-factor authentication for additional security
- This email was sent at your request

Login URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

If you didn't request these credentials, please contact our support team immediately.

Requested on: ${new Date().toLocaleString()}

© ${new Date().getFullYear()} KOSO Application. All rights reserved.`
    };

    console.log(`📨 Resending email from: ${mailOptions.from}`);
    console.log(`📨 Resending email to: ${mailOptions.to}`);
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Credentials resent successfully to ${toEmail}`);
    console.log(`📫 Message ID: ${info.messageId}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error resending email to ${toEmail}:`, error.message);
    return false;
  }
};



module.exports = {
  sendCredentialsEmail,
  sendPasswordResetEmail,
  sendUpdateEmail,
  resendCredentialsEmail
};