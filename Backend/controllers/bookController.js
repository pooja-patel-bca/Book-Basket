
import Book from "../models/Book.js";

// Fetch books from Google Books and Open Library
const fetchBooksFromSources = async (query) => {
  let googleBooks = [];
  let openLibraryBooks = [];

  // 1. Google Books API - Maximum 30 books
  try {
    const googleURL =
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=30`;

    const googleResponse = await fetch(googleURL);

    if (googleResponse.ok) {
      const googleData = await googleResponse.json();

      googleBooks = (googleData.items || []).map((item) => {
        const info = item.volumeInfo || {};

        return {
          id: item.id,
          googleBooksId: item.id,
          title: info.title || "Unknown Title",
          authors: info.authors || ["Unknown Author"],
          description: info.description || "",
          coverImage:
            info.imageLinks?.thumbnail?.replace("http://", "https://") || "",
          category: info.categories?.[0] || "General",
          categories: info.categories || [],
          publisher: info.publisher || "",
          publishedDate: info.publishedDate || "",
          isbn: (info.industryIdentifiers || []).map(
            (identifier) => identifier.identifier
          ),
          source: "Google Books",
        };
      });
    } else {
      console.log("Google Books API error:", googleResponse.status);
    }
  } catch (error) {
    console.log("Google Books error:", error.message);
  }

  // 2. Open Library API - Maximum 30 books
  try {
    const openLibraryURL =
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=30`;

    const openLibraryResponse = await fetch(openLibraryURL);

    if (openLibraryResponse.ok) {
      const openLibraryData = await openLibraryResponse.json();

      openLibraryBooks = (openLibraryData.docs || []).map((book) => ({
        id: book.key || "",
        openLibraryId: book.key || "",
        title: book.title || "Unknown Title",
        authors: book.author_name || ["Unknown Author"],
        description: "",
        coverImage: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : "",
        category: book.subject?.[0] || "General",
        categories: book.subject || [],
        publisher: book.publisher?.[0] || "",
        publishedDate: book.first_publish_year
          ? String(book.first_publish_year)
          : "",
        isbn: book.isbn || [],
        source: "Open Library",
      }));
    } else {
      console.log("Open Library API error:", openLibraryResponse.status);
    }
  } catch (error) {
    console.log("Open Library error:", error.message);
  }

  // 3. Combine results and remove duplicates
  const combinedBooks = [...googleBooks];

  for (const openBook of openLibraryBooks) {
    const isDuplicate = combinedBooks.some((googleBook) => {
      const sameTitle =
        googleBook.title.toLowerCase() === openBook.title.toLowerCase();

      const googleAuthors = googleBook.authors.map((author) =>
        author.toLowerCase()
      );

      const openAuthors = openBook.authors.map((author) =>
        author.toLowerCase()
      );

      const sameAuthor = googleAuthors.some((author) =>
        openAuthors.includes(author)
      );

      return sameTitle && sameAuthor;
    });

    if (!isDuplicate) {
      combinedBooks.push(openBook);
    }
  }

  return {
    books: combinedBooks,
    sources: {
      googleBooks: googleBooks.length,
      openLibrary: openLibraryBooks.length,
    },
  };
};


// Get all books from MongoDB
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Search books by title or author
export const searchBooks = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a book title or author name.",
      });
    }

    console.log("Searching for:", query);

    const result = await fetchBooksFromSources(query.trim());

    console.log("Google Books results:", result.sources.googleBooks);
    console.log("Open Library results:", result.sources.openLibrary);
    console.log("Combined results:", result.books.length);

    res.status(200).json({
      success: true,
      query,
      count: result.books.length,
      sources: result.sources,
      books: result.books,
    });
  } catch (error) {
    console.error("Search error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to search books.",
      error: error.message,
    });
  }
};


// Get popular books for Explore Books page
export const getFeaturedBooks = async (req, res) => {
  try {
    const result = await fetchBooksFromSources(
      "bestselling popular books"
    );

    res.status(200).json({
      success: true,
      count: result.books.length,
      books: result.books,
    });
  } catch (error) {
    console.error("Featured books error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load popular books.",
    });
  }
};


// Get books by category
export const getBooksByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Please provide a book category.",
      });
    }

    const result = await fetchBooksFromSources(category);

    res.status(200).json({
      success: true,
      category,
      count: result.books.length,
      books: result.books,
    });
  } catch (error) {
    console.error("Category books error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load category books.",
    });
  }
};


// Add a new book
export const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: "Book added successfully.",
      book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Get a book by MongoDB ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Update a book
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully.",
      book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
