
import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    uploadProfilePhoto,
    removeProfilePhoto,
} from "../controllers/profileController.js";

const router = express.Router();

// Upload or update profile photo
router.put(
    "/photo",
    protect,
    upload.single("profileImage"),
    uploadProfilePhoto
);

// Remove profile photo
router.delete("/photo", protect, removeProfilePhoto);

export default router;
