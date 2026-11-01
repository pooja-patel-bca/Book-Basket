
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  BookOpen,
  Trash2,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";
import "./Favourites.css";

const Favourites = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/library");

      const data = response.data;

      const libraryBooks = Array.isArray(data)
        ? data
        : data.books || data.library || [];

      const favouriteBooks = libraryBooks
        .filter((item) => item.isFavourite === true)
        .map((item) => {
          const details = item.book || item;
          const volumeInfo = details.volumeInfo || {};

          return {
            ...details,
            _id: item._id,
            libraryId: item._id,

            id: details.id || details._id || item.bookId,

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
        });

      setBooks(favouriteBooks);
    } catch (err) {
      console.error("Favourite page error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load favourites. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (book) => {
    try {
      await api.patch(`/library/${book.libraryId}/favourite`, {
        isFavourite: false,
      });

      setBooks((previousBooks) =>
        previousBooks.filter(
          (item) => item.libraryId !== book.libraryId
        )
      );

      setMessage("Book removed from favourites.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to remove favourite."
      );
    }
  };

  const filteredBooks = books.filter((book) => {
    const title = (book.title || "").toLowerCase();

    const authors = Array.isArray(book.authors)
      ? book.authors.join(" ").toLowerCase()
      : (book.authors || "").toLowerCase();

    const search = searchTerm.toLowerCase();

    return title.includes(search) || authors.includes(search);
  });

  return (
    <div className="favourites-page">

      <div className="favourites-heading">
        <div>
          <span className="favourites-subtitle">
            YOUR MOST LOVED READS
          </span>

          <h1>My Favourites</h1>

          <p>A special collection of books you love.</p>
        </div>

        <div className="favourites-heading-icon">
          <Heart size={32} />
        </div>
      </div>

      <div className="favourites-count">
        <Heart size={19} fill="currentColor" />
        <span>
          {books.length} Favourite {books.length === 1 ? "Book" : "Books"}
        </span>
      </div>

      <div className="favourites-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search favourite books or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {message && (
        <div className="favourites-message">
          {message}
        </div>
      )}

      {error && (
        <div className="favourites-error">
          {error}
        </div>
      )}

      {loading && (
        <div className="favourites-status">
          <LoaderCircle size={30} className="loading-icon" />
          <p>Loading your favourites...</p>
        </div>
      )}

      {!loading && filteredBooks.length > 0 && (
        <div className="favourites-grid">
          {filteredBooks.map((book) => {
            const authors = Array.isArray(book.authors)
              ? book.authors.join(", ")
              : book.authors || "Unknown Author";

            return (
              <div
                className="favourite-book-card"
                key={book.libraryId}
              >
                <div className="favourite-book-cover">
                  <img
                    src={book.coverImage || "/placeholder-book.png"}
                    alt={book.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder-book.png";
                    }}
                  />

                  <span className="favourite-heart">
                    <Heart size={19} fill="currentColor" />
                  </span>
                </div>

                <div className="favourite-book-info">
                  <h3>{book.title}</h3>

                  <p>{authors}</p>

                  <div className="favourite-book-actions">
                    <button
                      className="favourite-details-btn"
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
                      className="remove-favourite-btn"
                      onClick={() => handleRemoveFavourite(book)}
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

      {!loading && filteredBooks.length === 0 && (
        <div className="favourites-empty">
          <span>💗</span>

          <h3>
            {books.length === 0
              ? "No favourites yet!"
              : "No matching books found"}
          </h3>

          <p>
            {books.length === 0
              ? "Save books to your favourites and find them here whenever you want."
              : "Try searching with another book title or author."}
          </p>

          {books.length === 0 && (
            <button onClick={() => navigate("/explore")}>
              Explore Books
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default Favourites;
