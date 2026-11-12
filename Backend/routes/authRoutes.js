
import express from "express";

import {
  registerUser,
  loginUser,
  verifyEmailOTP,
  resendEmailOTP,
  googleAuth,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Registration and email OTP
router.post("/register", registerUser);
router.post("/verify-otp", verifyEmailOTP);
router.post("/resend-otp", resendEmailOTP);

// Normal login
router.post("/login", loginUser);

// Google login and signup
router.post("/google", googleAuth);

// Verify JWT token
router.get("/verify", protect, (req, res) => {
  res.status(200).json({
    message: "Authentication successful.",
    userId: req.userId,
  });
});

export default router;
