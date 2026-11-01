
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  Plus,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";
import "./ExploreBooks.css";

// Convert different API book formats into one format
const normalizeBook = (data) => {
  const details = data?.book || data || {};
  const volumeInfo = details.volumeInfo || {};

  return {
    id: String(
      details.id ||
      details._id ||
      details.googleBooksId ||
      details.openLibraryId ||
      ""
    ),

    title: details.title || volumeInfo.title || "",

    authors:
      details.authors ||
      volumeInfo.authors ||
      ["Unknown Author"],

    description:
      details.description ||
      volumeInfo.description ||
      "",

    coverImage:
      details.coverImage ||
      details.image ||
      details.imageLinks?.thumbnail ||
      volumeInfo.imageLinks?.thumbnail ||
      "",

    publisher:
      details.publisher ||
      volumeInfo.publisher ||
      "",

    publishedDate:
      details.publishedDate ||
      volumeInfo.publishedDate ||
      "",

    categories:
      details.categories ||
      details.category ||
      volumeInfo.categories ||
      [],
  };
};

const categories = [
  "All Books",
  "Fiction",
  "Romance",
  "Mystery",
  "Fantasy",
  "Self Help",
  "Science",
  "Biography",
];

const ExploreBooks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);

  const [activeCategory, setActiveCategory] = useState(
    location.state?.category || "All Books"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingBook, setAddingBook] = useState(null);
  const [message, setMessage] = useState("");

  // Search books
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setBooks([]);
      setError("");
      return;
    }

    const timer = setTimeout(() => {
      searchBooks();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/books/search", {
        params: {
          q: searchTerm.trim(),
        },
      });

      const results = Array.isArray(response.data)
        ? response.data
        : response.data.books || response.data.items || [];

      const normalizedBooks = results.map(normalizeBook);

      setBooks(normalizedBooks);
    } catch (err) {
      console.error("Search books error:", err);

      setBooks([]);

      setError(
        err.response?.data?.message ||
        "Unable to load books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // View book details
  const handleViewDetails = (book) => {
    if (!book.id || !book.title) {
      setMessage("Book details are incomplete.");
      return;
    }

    navigate(`/book/${book.id}`, {
      state: {
        book,
      },
    });
  };

  // Add book to library
  const handleAddToLibrary = async (book) => {
    try {
      setAddingBook(book.id);
      setMessage("");

      const bookData = normalizeBook(book);

      if (!bookData.id || !bookData.title) {
        setMessage("Book ID or title is missing.");
        return;
      }

      const payload = {
        book: bookData,
        status: "Want to Read",
      };

      const response = await api.post("/library", payload);

      setMessage(
        response.data.message ||
        `${bookData.title} added to your library!`
      );
    } catch (err) {
      console.error(
        "Add book error:",
        err.response?.data || err
      );

      setMessage(
        err.response?.data?.message ||
        "Unable to add book. Please try again."
      );
    } finally {
      setAddingBook(null);
    }
  };

  // Filter books by category
  const filteredBooks =
    activeCategory === "All Books"
      ? books
      : books.filter((book) => {
          const bookCategories = Array.isArray(book.categories)
            ? book.categories.join(" ")
            : book.categories || "";

          return bookCategories
            .toString()
            .toLowerCase()
            .includes(activeCategory.toLowerCase());
        });

  return (
    <div className="explore-page">

      {/* Page Heading */}
      <div className="explore-heading">
        <div>
          <span className="explore-subtitle">
            DISCOVER YOUR NEXT READ
          </span>

          <h1>Explore Books</h1>

          <p>
            Find stories, ideas and adventures waiting for you.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="explore-search">
        <Search size={21} />

        <input
          type="text"
          placeholder="Search by book title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm && (
          <button onClick={() => setSearchTerm("")}>
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <section className="explore-filters">
        <div className="filter-heading">
          <SlidersHorizontal size={18} />
          <span>Categories</span>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category ? "selected" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Results Heading */}
      <div className="explore-results-heading">
        <h2>
          {searchTerm
            ? "Search Results"
            : "Find Your Favourite Book"}
        </h2>

        {searchTerm && (
          <span>{filteredBooks.length} books found</span>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="explore-message">
          {message}
        </div>
      )}

      {error && (
        <div className="explore-error">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="explore-status">
          <LoaderCircle
            className="loading-icon"
            size={28}
          />
          <p>Finding your books...</p>
        </div>
      )}

      {/* Books Grid */}
      {!loading && filteredBooks.length > 0 && (
        <div className="explore-books-grid">
          {filteredBooks.map((book) => (
            <div
              className="explore-book-card"
              key={book.id}
            >
              <div className="explore-book-cover">
                <img
                  src={
                    book.coverImage ||
                    "/placeholder-book.png"
                  }
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "/placeholder-book.png";
                  }}
                />
              </div>

              <div className="explore-book-info">
                <h3>{book.title}</h3>

                <p>
                  {Array.isArray(book.authors)
                    ? book.authors.join(", ")
                    : book.authors || "Unknown Author"}
                </p>

                <div className="explore-book-actions">
                  <button
                    className="details-button"
                    onClick={() => handleViewDetails(book)}
                  >
                    <BookOpen size={15} />
                    Details
                  </button>

                  <button
                    className="add-book-button"
                    disabled={addingBook !== null}
                    onClick={() => handleAddToLibrary(book)}
                  >
                    {addingBook === book.id ? (
                      <LoaderCircle
                        size={15}
                        className="loading-icon"
                      />
                    ) : (
                      <Plus size={15} />
                    )}

                    {addingBook === book.id ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initial Empty State */}
      {!loading && searchTerm.trim().length < 2 && (
        <div className="explore-empty">
          <span>📚</span>
          <h3>Your next favourite book is waiting!</h3>
          <p>
            Enter a book title or author's name to get started.
          </p>
        </div>
      )}

      {/* No Results */}
      {!loading &&
        searchTerm.trim().length >= 2 &&
        filteredBooks.length === 0 &&
        !error && (
          <div className="explore-empty">
            <span>🔎</span>
            <h3>No books found</h3>
            <p>
              Try another title or author name.
            </p>
          </div>
        )}

    </div>
  );
};

export default ExploreBooks;
