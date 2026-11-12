
import Library from "../models/Library.js";

// ADD BOOK TO LIBRARY
export const addBookToLibrary = async (req, res) => {
  try {
    console.log("REQUEST BODY:", JSON.stringify(req.body, null, 2));

    const { book, status } = req.body || {};

    if (!book || typeof book !== "object") {
      return res.status(400).json({
        message: "Book details are missing.",
        receivedBody: req.body,
      });
    }

    const details = book.book || book;
    const volumeInfo = details.volumeInfo || {};

    const bookId = details.id || details._id || details.bookId;
    const title = details.title || volumeInfo.title;

    if (!bookId || !title) {
      return res.status(400).json({
        message: "Book ID or title is missing.",
        receivedBook: details,
      });
    }

    const existingBook = await Library.findOne({
      user: req.userId,
      "book.id": String(bookId),
    });

    if (existingBook) {
      return res.status(409).json({
        message: "Book already exists in your library.",
      });
    }

    const libraryBook = await Library.create({
      user: req.userId,
      book: {
        id: String(bookId),
        title,
        authors: details.authors || volumeInfo.authors || ["Unknown Author"],
        description: details.description || volumeInfo.description || "",
        coverImage:
          details.coverImage ||
          details.image ||
          details.imageLinks?.thumbnail ||
          volumeInfo.imageLinks?.thumbnail ||
          "",
        publisher: details.publisher || volumeInfo.publisher || "",
        publishedDate: details.publishedDate || volumeInfo.publishedDate || "",
        categories:
          details.categories ||
          details.category ||
          volumeInfo.categories ||
          [],
      },
      status: status || "Want to Read",
      isFavourite: false,
    });

    return res.status(201).json({
      message: "Book added to your library successfully.",
      libraryBook,
    });
  } catch (error) {
    console.error("Add book error:", error);

    return res.status(500).json({
      message: "Unable to add book.",
      error: error.message,
    });
  }
};


// GET MY LIBRARY
export const getMyLibrary = async (req, res) => {
  try {
    const books = await Library.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get library error:", error);

    return res.status(500).json({
      message: "Unable to fetch your library.",
      error: error.message,
    });
  }
};


// REMOVE BOOK
export const removeBookFromLibrary = async (req, res) => {
  try {
    const book = await Library.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found in your library.",
      });
    }

    return res.status(200).json({
      message: "Book removed from your library.",
    });
  } catch (error) {
    console.error("Remove book error:", error);

    return res.status(500).json({
      message: "Unable to remove book.",
      error: error.message,
    });
  }
};


// UPDATE READING STATUS
export const updateBookStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Want to Read",
      "Currently Reading",
      "Completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid reading status.",
      });
    }

    const book = await Library.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { status },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found in your library.",
      });
    }

    return res.status(200).json({
      message: "Reading status updated successfully.",
      book,
    });
  } catch (error) {
    console.error("Update status error:", error);

    return res.status(500).json({
      message: "Unable to update reading status.",
      error: error.message,
    });
  }
};


// UPDATE FAVOURITE
export const updateBookFavourite = async (req, res) => {
  try {
    const { isFavourite } = req.body;

    if (typeof isFavourite !== "boolean") {
      return res.status(400).json({
        message: "Valid favourite status is required.",
      });
    }

    const book = await Library.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      { isFavourite },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found in your library.",
      });
    }

    return res.status(200).json({
      message: isFavourite
        ? "Book added to favourites."
        : "Book removed from favourites.",
      book,
    });
  } catch (error) {
    console.error("Update favourite error:", error);

    return res.status(500).json({
      message: "Unable to update favourite.",
      error: error.message,
    });
  }
};
