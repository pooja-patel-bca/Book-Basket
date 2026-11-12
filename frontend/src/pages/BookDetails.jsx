
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Heart,
  LoaderCircle,
  Plus,
} from "lucide-react";

import api from "../services/api";
import "./BookDetails.css";

// Normalize book data
const normalizeBook = (data, fallbackId) => {
  const details = data?.book || data || {};
  const volumeInfo = details.volumeInfo || {};

  return {
    id: String(
      details.id ||
      details._id ||
      details.bookId ||
      fallbackId ||
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

const BookDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [book, setBook] = useState(
    location.state?.book
      ? normalizeBook(location.state.book, id)
      : null
  );

  const [loading, setLoading] = useState(!location.state?.book);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (location.state?.book) {
        setBook(normalizeBook(location.state.book, id));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/books/${id}`);

        const normalizedBook = normalizeBook(
          response.data.book || response.data,
          id
        );

        setBook(normalizedBook);
      } catch (err) {
        console.error("Fetch book error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load book details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, location.state]);

  // Add book to library
  const handleAddToLibrary = async () => {
    if (!book) return;

    try {
      setAdding(true);
      setMessage("");

      const bookData = normalizeBook(book, id);

      if (!bookData.id || !bookData.title) {
        setMessage("Book ID or title is missing.");
        return;
      }

      const payload = {
        book: {
          id: bookData.id,
          title: bookData.title,
          authors: bookData.authors,
          description: bookData.description,
          coverImage: bookData.coverImage,
          publisher: bookData.publisher,
          publishedDate: bookData.publishedDate,
          categories: bookData.categories,
        },
        status: "Want to Read",
      };

      const response = await api.post("/library", payload);

      setMessage(
        response.data.message ||
        "Book added to your library successfully!"
      );
    } catch (err) {
      console.error("Add book error:", err.response?.data || err);

      setMessage(
        err.response?.data?.message ||
        "Unable to add book. Please try again."
      );
    } finally {
      setAdding(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="book-details-status">
        <LoaderCircle size={30} className="loading-icon" />
        <p>Loading book details...</p>
      </div>
    );
  }

  // Error screen
  if (error || !book) {
    return (
      <div className="book-details-status">
        <h2>Book not found</h2>
        <p>{error || "The requested book could not be found."}</p>

        <button onClick={() => navigate("/explore")}>
          <ArrowLeft size={17} />
          Back to Explore
        </button>
      </div>
    );
  }

  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.authors || "Unknown Author";

  const categories = Array.isArray(book.categories)
    ? book.categories.join(", ")
    : book.categories || "Not specified";

  return (
    <div className="book-details-page">

      <button
        className="back-to-explore"
        onClick={() => navigate("/explore")}
      >
        <ArrowLeft size={18} />
        Back to Explore
      </button>

      <section className="book-details-container">

        <div className="book-details-cover">
          <img
            src={book.coverImage || "/placeholder-book.png"}
            alt={book.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-book.png";
            }}
          />
        </div>

        <div className="book-details-info">

          <span className="book-details-label">
            BOOK DETAILS
          </span>

          <h1>{book.title || "Untitled Book"}</h1>

          <p className="book-details-author">
            By {authors}
          </p>

          <div className="book-details-meta">

            <div>
              <BookOpen size={18} />
              <span>{categories}</span>
            </div>

            <div>
              <Calendar size={18} />
              <span>
                {book.publishedDate ||
                  "Publication date unavailable"}
              </span>
            </div>

            <div>
              <span className="meta-label">Publisher:</span>
              <span>{book.publisher || "Not available"}</span>
            </div>

          </div>

          <div className="book-details-actions">

            <button
              className="add-to-library-btn"
              onClick={handleAddToLibrary}
              disabled={adding}
            >
              {adding ? (
                <LoaderCircle
                  size={18}
                  className="loading-icon"
                />
              ) : (
                <Plus size={18} />
              )}

              {adding ? "Adding..." : "Add to My Library"}
            </button>

            <button
              className={`book-favourite-btn ${
                isFavourite ? "active" : ""
              }`}
              onClick={() => setIsFavourite(!isFavourite)}
              aria-label="Toggle favourite"
            >
              <Heart
                size={20}
                fill={isFavourite ? "currentColor" : "none"}
              />
            </button>

          </div>

          {message && (
            <p className="book-details-message">
              {message}
            </p>
          )}

        </div>
      </section>

      <section className="book-description-section">
        <h2>About This Book</h2>

        <p>
          {book.description ||
            "No description is available for this book."}
        </p>
      </section>

    </div>
  );
};

export default BookDetails;
