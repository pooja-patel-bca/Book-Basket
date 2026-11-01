import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Verify Authentication
router.get("/verify", protect, (req, res) => {
  res.status(200).json({
    message: "Authentication successful.",
    userId: req.userId,
  });
});

export default router;