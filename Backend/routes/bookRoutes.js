
import express from "express";

import {
  getAllBooks,
  searchBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

// Get all saved books
router.get("/", getAllBooks);

// Search books using Open Library API
router.get("/search", searchBooks);

// Add a new book
router.post("/", addBook);

// Get one book by ID
router.get("/:id", getBookById);

// Update a saved book
router.put("/:id", updateBook);

// Delete a saved book
router.delete("/:id", deleteBook);

export default router;
