
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Heart,
  Library,
  TrendingUp,
  ArrowRight,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import api from "../services/api";
import BookCard from "../components/BookCard";
import "./Dashboard.css";

const categoryNames = [
  "Fiction", "Romance", "Mystery", "Thriller",
  "Fantasy", "Horror", "Adventure", "Science Fiction",
  "Self Help", "Motivation", "Personal Development",
  "Biography", "Autobiography", "History", "Science",
  "Technology", "Education", "Business", "Finance",
  "Psychology", "Philosophy", "Religion", "Spirituality",
  "Poetry", "Classics", "Literature", "Children's Books",
  "Comics", "Graphic Novels", "Health", "Travel",
  "Cooking", "Art",
];

const categoryEmojis = [
  "📖", "💕", "🔍", "🕵️", "🪄", "👻", "🏕️",
  "🚀", "🌱", "🔥", "🌟", "👤", "📚", "🏛️",
  "🔬", "💻", "🎓", "💼", "💰", "🧠", "💭",
  "🕌", "🕊️", "✍️", "📜", "📕", "🧸", "🎨",
  "🖼️", "❤️", "✈️", "🍳", "🎭",
];

const categoryColors = [
  "peach", "pink", "lavender", "mint", "yellow",
];

const categories = categoryNames.map((name, index) => ({
  name,
  emoji: categoryEmojis[index],
  color: categoryColors[index % categoryColors.length],
}));

const trendingBooks = [
  {
    id: 1,
    title: "The Alchemist",
    authors: ["Paulo Coelho"],
    coverImage:
      "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
  },
  {
    id: 2,
    title: "Atomic Habits",
    authors: ["James Clear"],
    coverImage:
      "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
  },
  {
    id: 3,
    title: "Ikigai",
    authors: ["Hector Garcia"],
    coverImage:
      "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg",
  },
  {
    id: 4,
    title: "The Psychology of Money",
    authors: ["Morgan Housel"],
    coverImage:
      "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const [libraryBooks, setLibraryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/library");
      const data = response.data;

      const savedBooks = Array.isArray(data)
        ? data
        : data.books || data.library || [];

      const normalizedBooks = savedBooks.map((item) => {
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

      setLibraryBooks(normalizedBooks);
    } catch (err) {
      console.error("Dashboard library error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load your library."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const totalBooks = libraryBooks.length;

  const favouriteBooks = libraryBooks.filter(
    (book) => book.isFavourite
  );

  const readingBooks = libraryBooks.filter(
    (book) => book.status === "Currently Reading"
  );

  const completedBooks = libraryBooks.filter(
    (book) => book.status === "Completed"
  );

  const handleViewDetails = (book) => {
    navigate(`/book/${encodeURIComponent(book.id)}`, {
      state: { book },
    });
  };

  const handleCategoryClick = (category) => {
    navigate("/explore", {
      state: { category },
    });
  };

  return (
    <div className="dashboard-page">

      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-label">
            <Sparkles size={15} />
            YOUR PERSONAL BOOK WORLD
          </span>

          <h1>Stories worth collecting.</h1>

          <p>
            Discover new adventures, explore your favourite
            genres and find your next great read.
          </p>

          <button onClick={() => navigate("/explore")}>
            Explore Books
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="welcome-illustration">
          <span>📚</span>
          <span>✨</span>
          <span>🌷</span>
        </div>
      </section>

      {/* Statistics */}
      <section className="dashboard-stats">
        <div
          className="stat-card stat-peach"
          onClick={() => navigate("/my-library")}
        >
          <div className="stat-icon">
            <Library size={22} />
          </div>
          <div>
            <h3>My Library</h3>
            <p>{loading ? "Loading..." : `${totalBooks} Books`}</p>
          </div>
        </div>

        <div
          className="stat-card stat-lavender"
          onClick={() => navigate("/my-library")}
        >
          <div className="stat-icon">
            <Heart size={22} />
          </div>
          <div>
            <h3>Favourites</h3>
            <p>
              {loading ? "Loading..." : `${favouriteBooks.length} Books`}
            </p>
          </div>
        </div>

        <div
          className="stat-card stat-mint"
          onClick={() => navigate("/my-library")}
        >
          <div className="stat-icon">
            <BookOpen size={22} />
          </div>
          <div>
            <h3>Reading</h3>
            <p>
              {loading ? "Loading..." : `${readingBooks.length} Books`}
            </p>
          </div>
        </div>

        <div
          className="stat-card stat-yellow"
          onClick={() => navigate("/my-library")}
        >
          <div className="stat-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3>Completed</h3>
            <p>
              {loading ? "Loading..." : `${completedBooks.length} Books`}
            </p>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="library-error">
          {error}
          <button onClick={fetchLibrary}>Retry</button>
        </div>
      )}

      {/* Favourite Books */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>
              <Heart
                size={21}
                color="#e56b91"
                fill="#e56b91"
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                }}
              />{" "}
              My Favourite Books
            </h2>
            <p>Your specially loved stories.</p>
          </div>

          <button
            className="view-all-btn"
            onClick={() => navigate("/my-library")}
          >
            View Library
            <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="library-status">
            <LoaderCircle size={28} className="loading-icon" />
            <p>Loading favourite books...</p>
          </div>
        ) : favouriteBooks.length > 0 ? (
          <div className="trending-books-grid">
            {favouriteBooks.map((book) => {
              const authors = Array.isArray(book.authors)
                ? book.authors.join(", ")
                : book.authors || "Unknown Author";

              return (
                <div
                  className="my-library-card"
                  key={book.libraryId}
                >
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

                    <span className="library-favourite active">
                      <Heart size={19} fill="currentColor" />
                    </span>
                  </div>

                  <div className="my-library-info">
                    <h3>{book.title}</h3>
                    <p>{authors}</p>

                    <button
                      className="library-view-btn"
                      onClick={() => handleViewDetails(book)}
                    >
                      <BookOpen size={16} />
                      <span>View Details</span>
                      <ArrowRight size={16} className="view-arrow" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="library-empty">
            <span>💗</span>
            <h3>No Favourite Books Yet</h3>
            <p>
              Add books to your favourites from My Library.
            </p>
            <button onClick={() => navigate("/my-library")}>
              Open My Library
            </button>
          </div>
        )}
      </section>

      {/* Explore Categories */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Explore by Category</h2>
            <p>
              Discover books from your favourite genres.
            </p>
          </div>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-card ${category.color}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="category-emoji">
                {category.emoji}
              </span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Books */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Trending Books</h2>
            <p>Popular reads you might love.</p>
          </div>

          <button
            className="view-all-btn"
            onClick={() => navigate("/explore")}
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="trending-books-grid">
          {trendingBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
