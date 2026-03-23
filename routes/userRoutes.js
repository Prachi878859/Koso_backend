const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController")
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

// Protected routes (require authentication)
router.get("/",  userController.getAllUsers);
router.get("/search", authMiddleware, userController.searchUsers);
router.get("/profile", authMiddleware, userController.getProfile);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", userController.updateUser);
router.post('/:id/resend-credentials', userController.resendCredentials);

// User status update route
router.put('/:id/status',  userController.updateUserStatus);
router.put("/:id/password",  userController.updatePassword);
router.delete("/:id",  userController.deleteUser);


 // Test email configuration endpoint
router.get('/test-email-config', async (req, res) => {
  try {
    // Check if transporter exists
    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: "Email transporter not initialized"
      });
    }
    
    // Log current configuration
    console.log("Email config check:");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
    console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
    
    // Verify connection
    await transporter.verify();
    
    return res.status(200).json({
      success: true,
      message: "Email configuration is valid",
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        secure: process.env.SMTP_SECURE === 'true'
      }
    });
  } catch (error) {
    console.error("Email config test failed:", error);
    return res.status(500).json({
      success: false,
      message: "Email configuration failed",
      error: error.message,
      code: error.code
    });
  }
});

module.exports = router;