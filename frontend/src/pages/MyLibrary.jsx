
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  Heart,
  Trash2,
  LoaderCircle,
  Library,
} from "lucide-react";

import api from "../services/api";
import "./MyLibrary.css";

const readingStatuses = [
  "Want to Read",
  "Currently Reading",
  "Completed",
];

const MyLibrary = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Books");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [favouriteUpdatingId, setFavouriteUpdatingId] =
    useState(null);

  // Normalize book data from MongoDB / Google Books
  const normalizeBook = (item) => {
    const details = item.book || item;
    const volumeInfo = details.volumeInfo || {};

    return {
      ...details,

      _id: item._id,
      libraryId: item._id,

      id:
        details.id ||
        details._id ||
        item.bookId,

      title:
        details.title ||
        volumeInfo.title ||
        item.title ||
        "Untitled Book",

      authors:
        details.authors ||
        volumeInfo.authors ||
        item.authors ||
        ["Unknown Author"],

      coverImage:
        details.coverImage ||
        details.image ||
        details.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.thumbnail ||
        item.coverImage ||
        "",

      status: item.status || "Want to Read",

      isFavourite: item.isFavourite === true,
    };
  };

  // Fetch library books
  const fetchLibrary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/library");

      const libraryBooks = Array.isArray(response.data)
        ? response.data
        : response.data.books ||
          response.data.library ||
          [];

      setBooks(libraryBooks.map(normalizeBook));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your library. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  // Get MongoDB library ID
  const getBookId = (book) =>
    book.libraryId || book._id;

  // Update reading status
  const handleStatusChange = async (book, newStatus) => {
    const bookId = getBookId(book);

    try {
      setUpdatingId(bookId);
      setMessage("");

      await api.patch(`/library/${bookId}`, {
        status: newStatus,
      });

      setBooks((previousBooks) =>
        previousBooks.map((item) =>
          getBookId(item) === bookId
            ? { ...item, status: newStatus }
            : item
        )
      );

      setMessage("Reading status updated successfully.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to update reading status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Update favourite status in MongoDB
  const handleFavourite = async (book) => {
    const bookId = getBookId(book);
    const newFavouriteStatus = !book.isFavourite;

    try {
      setFavouriteUpdatingId(bookId);
      setMessage("");

      await api.patch(`/library/${bookId}/favourite`, {
        isFavourite: newFavouriteStatus,
      });

      setBooks((previousBooks) =>
        previousBooks.map((item) =>
          getBookId(item) === bookId
            ? {
                ...item,
                isFavourite: newFavouriteStatus,
              }
            : item
        )
      );

      setMessage(
        newFavouriteStatus
          ? "Book added to favourites."
          : "Book removed from favourites."
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to update favourite status."
      );
    } finally {
      setFavouriteUpdatingId(null);
    }
  };

  // Remove book from library
  const handleRemoveBook = async (book) => {
    const bookId = getBookId(book);

    const confirmRemove = window.confirm(
      `Remove "${book.title}" from your library?`
    );

    if (!confirmRemove) return;

    try {
      await api.delete(`/library/${bookId}`);

      setBooks((previousBooks) =>
        previousBooks.filter(
          (item) => getBookId(item) !== bookId
        )
      );

      setMessage("Book removed from your library.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to remove this book."
      );
    }
  };

  // Search and filter books
  const filteredBooks = books.filter((book) => {
    const title = (book.title || "").toLowerCase();

    const authors = Array.isArray(book.authors)
      ? book.authors.join(" ").toLowerCase()
      : (book.authors || "").toLowerCase();

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      title.includes(search) ||
      authors.includes(search);

    const matchesStatus =
      activeFilter === "All Books" ||
      book.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="my-library-page">

      {/* Page Heading */}
      <div className="library-heading">
        <div>
          <span className="library-subtitle">
            YOUR PERSONAL COLLECTION
          </span>

          <h1>My Library</h1>

          <p>
            Keep all your favourite stories in one place.
          </p>
        </div>

        <div className="library-heading-icon">
          <Library size={32} />
        </div>
      </div>

      {/* Library Statistics */}
      <section className="library-stats">

        <div className="library-stat-card">
          <span>Total Books</span>
          <h2>{books.length}</h2>
        </div>

        <div className="library-stat-card">
          <span>Want to Read</span>
          <h2>
            {books.filter(
              (book) => book.status === "Want to Read"
            ).length}
          </h2>
        </div>

        <div className="library-stat-card">
          <span>Currently Reading</span>
          <h2>
            {books.filter(
              (book) => book.status === "Currently Reading"
            ).length}
          </h2>
        </div>

        <div className="library-stat-card">
          <span>Completed</span>
          <h2>
            {books.filter(
              (book) => book.status === "Completed"
            ).length}
          </h2>
        </div>

      </section>

      {/* Search Bar */}
      <div className="library-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search your books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Reading Status Filters */}
      <div className="library-filters">
        {["All Books", ...readingStatuses].map((filter) => (
          <button
            key={filter}
            className={
              activeFilter === filter ? "selected" : ""
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Success and Error Messages */}
      {message && (
        <div className="library-message">
          {message}
        </div>
      )}

      {error && (
        <div className="library-error">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="library-status">
          <LoaderCircle
            size={30}
            className="loading-icon"
          />
          <p>Loading your library...</p>
        </div>
      )}

      {/* Book Cards */}
      {!loading && filteredBooks.length > 0 && (
        <div className="my-library-grid">

          {filteredBooks.map((book) => {
            const bookId = getBookId(book);

            const authors = Array.isArray(book.authors)
              ? book.authors.join(", ")
              : book.authors || "Unknown Author";

            return (
              <div
                className="my-library-card"
                key={bookId}
              >

                {/* Book Cover */}
                <div className="my-library-cover">
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

                  {/* Favourite Button */}
                  <button
                    className={`library-favourite ${
                      book.isFavourite ? "active" : ""
                    }`}
                    onClick={() => handleFavourite(book)}
                    disabled={
                      favouriteUpdatingId === bookId
                    }
                    aria-label={
                      book.isFavourite
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                  >
                    <Heart
                      size={19}
                      fill={
                        book.isFavourite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                {/* Book Information */}
                <div className="my-library-info">

                  <h3>{book.title}</h3>

                  <p>{authors}</p>

                  {/* Reading Status */}
                  <label>Reading Status</label>

                  <select
                    value={book.status}
                    disabled={updatingId === bookId}
                    onChange={(e) =>
                      handleStatusChange(
                        book,
                        e.target.value
                      )
                    }
                  >
                    {readingStatuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                  {/* Action Buttons */}
                  <div className="my-library-actions">

                    <button
                      className="library-view-btn"
                      onClick={() =>
                        navigate(`/book/${book.id}`, {
                          state: { book },
                        })
                      }
                    >
                      <BookOpen size={15} />
                      Details
                    </button>

                    <button
                      className="library-remove-btn"
                      onClick={() =>
                        handleRemoveBook(book)
                      }
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>

                  </div>
                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* Empty Library */}
      {!loading && filteredBooks.length === 0 && (
        <div className="library-empty">

          <span>📚</span>

          <h3>
            {books.length === 0
              ? "Your library is waiting!"
              : "No books found"}
          </h3>

          <p>
            {books.length === 0
              ? "Explore books and add your favourite stories here."
              : "Try another search or select a different filter."}
          </p>

          {books.length === 0 && (
            <button
              onClick={() => navigate("/explore")}
            >
              Explore Books
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default MyLibrary;
