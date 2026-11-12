
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/middleware.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-basket-ecru.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Book Basket Backend!");
});

// API routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/profile", profileRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Book Basket backend running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
