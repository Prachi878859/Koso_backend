const transporter = require('../config/emailConfig');

console.log("📧 Email service initialized");

const sendCredentialsEmail = async (toEmail, name, password) => {
  try {
    console.log(`📤 Preparing to send email to: ${toEmail}`);
    
    if (!toEmail || !name || !password) {
      console.error("❌ Missing required parameters for email");
      return false;
    }

    // Email content
    const mailOptions = {
      from: `"KOSO Application" <${process.env.SMTP_USER || 'companytest128@gmail.com'}>`,
      to: toEmail,
      subject: 'Welcome to KOSO Application - Your Account Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
            .header { background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { padding: 30px 20px; }
            .credentials { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb; margin: 20px 0; }
            .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
            .highlight { color: #2563eb; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>KOSO Application</h1>
              <p>Welcome to our platform</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your account has been successfully created in the KOSO Application.</p>
              
              <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> <span class="highlight">${toEmail}</span></p>
                <p><strong>Password:</strong> <span class="highlight">${password}</span></p>
              </div>
              
              <p><strong>Important Security Notes:</strong></p>
              <ul>
                <li>Please login and change your password immediately</li>
                <li>Never share your credentials with anyone</li>
                <li>This is an automated email, please do not reply</li>
              </ul>
              
              <p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="btn">
                  Login to Your Account
                </a>
              </p>
              
              <p>If you didn't request this account, please ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} KOSO Application. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to KOSO Application!

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
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${toEmail}`);
    console.log(`📫 Message ID: ${info.messageId}`);
    console.log(`📤 Response: ${info.response}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error sending email to ${toEmail}:`, error.message);
    console.error(`🔍 Full error:`, error);
    
    if (error.code) console.error(`Error code: ${error.code}`);
    if (error.command) console.error(`Command: ${error.command}`);
    if (error.response) console.error(`SMTP response: ${error.response}`);
    
    return false;
  }
};

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"KOSO Application" <${process.env.SMTP_USER || 'companytest128@gmail.com'}>`,
      to: toEmail,
      subject: 'Password Reset Request - KOSO Application',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #2563eb, #4f46e5); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Password Reset</h1>
          </div>
          <div style="padding: 30px; background: white; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <p>You requested a password reset for your KOSO Application account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
          </div>
        </div>
      `
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
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>',
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials-box { background: #fff; border-left: 4px solid #4CAF50; 
                              padding: 20px; margin: 20px 0; border-radius: 5px; 
                              box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; 
                       color: #856404; padding: 15px; border-radius: 5px; 
                       margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; 
                      font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            .button { display: inline-block; background: #4CAF50; color: white; 
                      padding: 12px 30px; text-decoration: none; border-radius: 5px; 
                      font-weight: bold; margin: 15px 0; }
            .highlight { background-color: #fffacd; padding: 2px 5px; 
                        border-radius: 3px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Account Updated</h1>
              <p>Your account information has been successfully updated</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name},</h2>
              
              <p>${message}</p>
              
              ${newPassword ? `
              <div class="credentials-box">
                <h3>📋 Your Updated Credentials</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>New Password:</strong> <span class="highlight">${newPassword}</span></p>
                <p style="margin-top: 15px;">
                  <a href="${process.env.APP_URL || 'http://localhost:5000'}/login" class="button">
                    🔑 Login Now
                  </a>
                </p>
              </div>
              ` : ''}
              
              ${newPassword ? `
              <div class="warning">
                <h4>⚠️ Security Notice</h4>
                <p>For your security, we recommend:</p>
                <ol>
                  <li>Logging in immediately with your new credentials</li>
                  <li>Changing your password after first login</li>
                  <li>Not sharing your credentials with anyone</li>
                </ol>
              </div>
              ` : ''}
              
              <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>If you have any questions, contact our support team.</p>
                <p>© ${new Date().getFullYear()} Your App. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email using your email transporter
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

    // Email content for resending credentials
    const mailOptions = {
      from: `"KOSO Application" <${process.env.SMTP_USER || 'companytest128@gmail.com'}>`,
      to: toEmail,
      subject: 'KOSO Application - Your Account Credentials (Resent)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
            .header { background: linear-gradient(to right, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { padding: 30px 20px; }
            .credentials { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50; margin: 20px 0; }
            .btn { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
            .highlight { color: #4CAF50; font-weight: bold; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>KOSO Application</h1>
              <p>Your Account Credentials (Resent)</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>We are resending your account credentials as requested.</p>
              
              <div class="warning">
                <p><strong>⚠️ Security Alert:</strong> This email contains your login credentials. Please keep them secure.</p>
              </div>
              
              <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> <span class="highlight">${toEmail}</span></p>
                <p><strong>Password:</strong> <span class="highlight">${password}</span></p>
              </div>
              
              <p><strong>Important Security Notes:</strong></p>
              <ul>
                <li>This is your current password</li>
                <li>We recommend changing your password after login</li>
                <li>Never share your credentials with anyone</li>
                <li>This email was sent at your request</li>
              </ul>
              
              <p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="btn">
                  Login to Your Account
                </a>
              </p>
              
              <p>If you didn't request these credentials, please contact our support team immediately.</p>
            </div>
            
            <div class="footer">
              <p><strong>Requested on:</strong> ${new Date().toLocaleString()}</p>
              <p>&copy; ${new Date().getFullYear()} KOSO Application. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
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
- This is your current password
- We recommend changing your password after login
- Never share your credentials with anyone
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
    console.log(`📤 Response: ${info.response}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error resending email to ${toEmail}:`, error.message);
    console.error(`🔍 Full error:`, error);
    return false;
  }
};



module.exports = {
  sendCredentialsEmail,
  sendPasswordResetEmail,
  sendUpdateEmail,
  resendCredentialsEmail
};