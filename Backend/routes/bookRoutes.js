
import express from "express";

import {
  getAllBooks,
  searchBooks,
  getFeaturedBooks,
  getBooksByCategory,
  addBook,
  getBookById,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";

const router = express.Router();

console.log("Book search route loaded");

// Get all books from database
router.get("/", getAllBooks);

// Get popular books
router.get("/featured", getFeaturedBooks);

// Get books by category
router.get("/category/:category", getBooksByCategory);

// Search books by title or author
router.get("/search", searchBooks);

// Add a new book
router.post("/", addBook);

// Get book by ID
router.get("/:id", getBookById);

// Update book
router.put("/:id", updateBook);

// Delete book
router.delete("/:id", deleteBook);

export default router;
