
import mongoose from "mongoose";
import Book from "../models/Book.js";

// Allowed book fields
const allowedFields = [
  "title",
  "authors",
  "description",
  "coverImage",
  "category",
  "status",
];

// Validate MongoDB Book ID
const validateBookId = (id) => {
  return mongoose.isObjectIdOrHexString(id);
};

// Validate book request data
const validateBookData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Invalid request data";
  }

  if (Object.keys(data).length === 0) {
    return "Please provide book details";
  }

  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return `Invalid fields: ${invalidFields.join(", ")}`;
  }

  return null;
};

// 1. Get all saved books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json(books);
  } catch (error) {
    console.error("Get books error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

// 2. Search books using Google Books API
// Open Library is used as a fallback
export const searchBooks = async (req, res) => {
  try {
    const query = req.query.q;

    if (typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        message: "Please enter a book name to search",
      });
    }

    const searchQuery = encodeURIComponent(query.trim());
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    // Search Google Books
    if (apiKey) {
      try {
        const googleUrl =
          `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=10&key=${apiKey}`;

        const googleResponse = await fetch(googleUrl, {
          signal: AbortSignal.timeout(10000),
        });

        if (googleResponse.ok) {
          const googleData = await googleResponse.json();

          const googleBooks = (googleData.items || []).map((item) => {
            const info = item.volumeInfo || {};
            const imageLinks = info.imageLinks || {};

            return {
              googleBooksId: item.id || "",
              title: info.title || "Untitled",
              authors: info.authors || [],
              description: info.description || "",
              coverImage: (
                imageLinks.thumbnail ||
                imageLinks.smallThumbnail ||
                ""
              ).replace("http://", "https://"),
              category: info.categories?.[0] || "General",
              publisher: info.publisher || "",
              publishedDate: info.publishedDate || "",
              isbn: (info.industryIdentifiers || []).map(
                (identifier) => identifier.identifier
              ),
            };
          });

          if (googleBooks.length > 0) {
            return res.status(200).json(googleBooks);
          }
        }
      } catch (googleError) {
        console.error(
          "Google Books request failed:",
          googleError.message
        );
      }
    }

    // 3. Search Open Library
    const openLibraryUrl =
      `https://openlibrary.org/search.json?title=${searchQuery}&limit=10`;

    const openLibraryResponse = await fetch(openLibraryUrl, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!openLibraryResponse.ok) {
      return res.status(502).json({
        message: "Book search services are unavailable",
      });
    }

    const openLibraryData = await openLibraryResponse.json();

    const openLibraryBooks = (openLibraryData.docs || []).map((item) => {
      let coverImage = "";

      if (item.cover_i) {
        coverImage =
          `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`;
      } else if (item.isbn?.length > 0) {
        coverImage =
          `https://covers.openlibrary.org/b/isbn/${item.isbn[0]}-M.jpg`;
      }

      return {
        openLibraryId: item.key || "",
        title: item.title || "Untitled",
        authors: item.author_name || [],
        isbn: item.isbn || [],
        description: "",
        coverImage,
        category: "General",
      };
    });

    return res.status(200).json(openLibraryBooks);

  } catch (error) {
    console.error("Book search error:", error.message);

    return res.status(
      error.name === "TimeoutError" ? 504 : 502
    ).json({
      message: "Failed to search books. Please try again.",
    });
  }
};

// 4. Add a new book
export const addBook = async (req, res) => {
  try {
    const validationError = validateBookData(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const book = await Book.create(req.body);

    return res.status(201).json(book);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// 5. Get one book by MongoDB, Google Books or Open Library ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ID
    if (validateBookId(id)) {
      const book = await Book.findById(id);

      if (book) {
        return res.status(200).json(book);
      }
    }

    // Check Google Books ID
    if (!id.startsWith("/")) {
      try {
        const googleUrl =
          `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;

        const googleResponse = await fetch(googleUrl, {
          signal: AbortSignal.timeout(10000),
        });

        if (googleResponse.ok) {
          const item = await googleResponse.json();
          const info = item.volumeInfo || {};

          return res.status(200).json({
            googleBooksId: item.id,
            title: info.title || "Untitled",
            authors: info.authors || [],
            description: info.description || "",
            coverImage: (
              info.imageLinks?.thumbnail ||
              info.imageLinks?.smallThumbnail ||
              ""
            ).replace("http://", "https://"),
            category: info.categories?.[0] || "General",
            publisher: info.publisher || "",
            publishedDate: info.publishedDate || "",
          });
        }
      } catch (googleError) {
        console.error(
          "Google Books lookup failed:",
          googleError.message
        );
      }
    }

    // Check Open Library ID
    if (id.startsWith("/works/")) {
      const openLibraryUrl =
        `https://openlibrary.org${id}.json`;

      const openLibraryResponse = await fetch(openLibraryUrl, {
        signal: AbortSignal.timeout(10000),
      });

      if (openLibraryResponse.ok) {
        const item = await openLibraryResponse.json();

        return res.status(200).json({
          openLibraryId: id,
          title: item.title || "Untitled",
          authors: [],
          description:
            typeof item.description === "string"
              ? item.description
              : item.description?.value || "",
          coverImage: item.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-L.jpg`
            : "",
          category: "General",
        });
      }
    }

    return res.status(404).json({
      message: "Book not found",
    });

  } catch (error) {
    console.error("Get book details error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch book details",
    });
  }
};

// 6. Update a saved book
export const updateBook = async (req, res) => {
  try {
    if (!validateBookId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const validationError = validateBookData(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// 7. Delete a saved book
export const deleteBook = async (req, res) => {
  try {
    if (!validateBookId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error.message);

    return res.status(500).json({
      message: "Failed to delete book",
    });
  }
};
