import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [1, "Book title cannot be empty"],
      maxlength: [200, "Book title cannot exceed 200 characters"],
    },

    authors: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [1, "Author name cannot be empty"],
        },
      ],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    coverImage: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: (value) => {
          if (!value) return true;

          try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        message: "Cover image must be a valid HTTP or HTTPS URL",
      },
    },

    category: {
      type: String,
      trim: true,
      default: "General",
      maxlength: [100, "Category cannot exceed 100 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["Want to Read", "Reading", "Completed"],
        message: "Invalid reading status",
      },
      default: "Want to Read",
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;