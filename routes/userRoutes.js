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

module.exports = router;