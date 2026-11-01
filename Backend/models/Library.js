
import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    status: {
      type: String,
      enum: ["Want to Read", "Currently Reading", "Completed"],
      default: "Want to Read",
    },

    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate books for the same user
librarySchema.index(
  { user: 1, "book.id": 1 },
  { unique: true }
);

const Library = mongoose.model("Library", librarySchema);

export default Library;
