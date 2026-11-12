
import express from "express";

import {
  addBookToLibrary,
  getMyLibrary,
  removeBookFromLibrary,
  updateBookStatus,
  updateBookFavourite,
} from "../controllers/libraryController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication middleware
router.use(protect);

// Add book to library
router.post("/", addBookToLibrary);

// Get user's library
router.get("/", getMyLibrary);

// Update book reading status
router.patch("/:id", updateBookStatus);

// Update book favourite status
router.patch("/:id/favourite", updateBookFavourite);

// Remove book from library
router.delete("/:id", removeBookFromLibrary);

// Debugging message
console.log("Book Basket Library Routes Loaded");

export default router;
