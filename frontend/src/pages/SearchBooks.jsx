
import { useState } from "react";
import {
  Search,
  BookOpen,
  BookmarkPlus,
  CheckCircle,
  Sparkles,
  Library,
} from "lucide-react";

import api from "../services/api";
import BookCard from "../components/BookCard";

function SearchBooks() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedBooks, setAddedBooks] = useState([]);
  const [addingBook, setAddingBook] = useState(null);

  // Get a unique ID for every searched book
  const getBookId = (book) => {
    return (
      book.id ||
      book._id ||
      book.googleBooksId ||
      book.openLibraryId
    );
  };

  // Search Books
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setBooks([]);
      setError("Please enter a book title or author name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooks([]);

      const response = await api.get(
        `/books/search?q=${encodeURIComponent(query.trim())}`
      );

      const results =
        response.data?.data ||
        response.data?.books ||
        response.data ||
        [];

      setBooks(Array.isArray(results) ? results : []);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to find books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Add Book to My Library
  const handleAddToLibrary = async (book) => {
    const bookId = getBookId(book);

    if (!bookId) {
      setError("Book ID not found. Please try another book.");
      return;
    }

    if (addedBooks.includes(bookId) || addingBook) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first to add books to your library.");
      return;
    }

    try {
      setAddingBook(bookId);
      setError("");

      const bookDetails = {
        id: String(bookId),
        title: book.title || "Untitled",
        authors: book.authors || [],
        description: book.description || "",
        coverImage: book.coverImage || "",
        category: book.category || "General",
      };

      await api.post("/library", {
        book: bookDetails,
        status: "Want to Read",
      });

      setAddedBooks((previous) => [...previous, bookId]);

    } catch (err) {
      if (err.response?.status === 409) {
        setAddedBooks((previous) =>
          previous.includes(bookId)
            ? previous
            : [...previous, bookId]
        );
        setError("This book is already in your library.");
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to add this book to your library."
        );
      }
    } finally {
      setAddingBook(null);
    }
  };

  return (
    <div className="bb-explore-page">

      {/* Page Heading */}
      <section className="bb-explore-heading">
        <div>
          <span className="bb-dashboard-label">
            DISCOVER YOUR NEXT READ
          </span>

          <h1>Explore Books</h1>

          <p>
            Find inspiring stories, discover new authors and
            explore your favourite books.
          </p>
        </div>

        <div className="bb-explore-heading-icon">
          <Library size={45} />
        </div>
      </section>

      {/* Search Banner */}
      <section className="bb-explore-hero">
        <div className="bb-explore-hero-content">
          <span className="bb-explore-tag">
            <Sparkles size={15} />
            YOUR READING JOURNEY STARTS HERE
          </span>

          <h2>
            Find the Book That
            <br />
            <span>Inspires You.</span>
          </h2>

          <p>
            Search books by title or author and add your
            favourites to your personal library.
          </p>
        </div>

        <form className="bb-search-form" onSubmit={handleSearch}>
          <Search size={21} />

          <input
            type="text"
            placeholder="Search by book title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search Books"}
          </button>
        </form>
      </section>

      {/* Search Results */}
      <section className="bb-explore-results">

        <div className="bb-section-heading">
          <div>
            <span className="bb-dashboard-label">
              BOOK COLLECTION
            </span>

            <h2>Discover Books</h2>

            <p>
              Explore books selected for your reading journey.
            </p>
          </div>

          <span className="bb-results-count">
            {books.length} Books Found
          </span>
        </div>

        {error && (
          <div className="bb-error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bb-explore-empty">
            <BookOpen size={42} />
            <h3>Finding books for you...</h3>
            <p>Please wait while we search the collection.</p>
          </div>
        ) : books.length > 0 ? (
          <div className="bb-explore-grid">
            {books.map((book, index) => {
              const bookId = getBookId(book);
              const isAdded = addedBooks.includes(bookId);
              const isAdding = addingBook === bookId;

              return (
                <div
                  className="bb-explore-book-item"
                  key={bookId || index}
                >
                  <BookCard book={book}>
                    <button
                      type="button"
                      className={`bb-add-library-button ${
                        isAdded ? "added" : ""
                      }`}
                      onClick={() => handleAddToLibrary(book)}
                      disabled={isAdded || isAdding}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle size={16} />
                          Added to Library
                        </>
                      ) : isAdding ? (
                        "Adding..."
                      ) : (
                        <>
                          <BookmarkPlus size={16} />
                          Add to My Library
                        </>
                      )}
                    </button>
                  </BookCard>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bb-explore-empty">
            <div className="bb-explore-empty-icon">
              <BookOpen size={42} />
            </div>

            <h3>Discover Something New</h3>

            <p>
              Search for your favourite books, authors or topics
              to find your next read.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SearchBooks;
