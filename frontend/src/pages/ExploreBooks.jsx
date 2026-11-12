
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

// Different colour themes for missing book covers
const placeholderThemes = [
  { bg: "#eee9f8", primary: "#8b78ad", secondary: "#d7c9ee" },
  { bg: "#e6f1ed", primary: "#527f70", secondary: "#bad8ca" },
  { bg: "#f8e9e7", primary: "#b46e69", secondary: "#edc4bd" },
  { bg: "#e8edf8", primary: "#637da9", secondary: "#c4d1ed" },
  { bg: "#f7f0df", primary: "#a48648", secondary: "#ead8a9" },
  { bg: "#f1e8f0", primary: "#986d91", secondary: "#dfc3da" },
  { bg: "#e9edf0", primary: "#637d89", secondary: "#c4d2d9" },
  { bg: "#f5e9df", primary: "#a97854", secondary: "#e8c9ae" },
];

const escapeXml = (text) => {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

// Generate a unique placeholder for every book
const createBookPlaceholder = (book) => {
  const title = book.title || "Untitled Book";

  const author = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.authors || "Unknown Author";

  const uniqueText = `${book.id}-${title}-${author}`;

  let hash = 0;

  for (let i = 0; i < uniqueText.length; i++) {
    hash = (hash * 31 + uniqueText.charCodeAt(i)) >>> 0;
  }

  const theme = placeholderThemes[hash % placeholderThemes.length];
  const design = hash % 4;

  const words = title.split(" ");
  const titleLines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).trim().length > 19) {
      if (currentLine) titleLines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = (currentLine + " " + word).trim();
    }
  });

  if (currentLine) titleLines.push(currentLine);

  const titleSvg = titleLines.slice(0, 3)
    .map(
      (line, index) => `
        <text
          x="150"
          y="${205 + index * 27}"
          text-anchor="middle"
          font-family="Georgia, serif"
          font-size="19"
          font-weight="bold"
          fill="${theme.primary}"
        >${escapeXml(line)}</text>
      `
    )
    .join("");

  const safeAuthor = escapeXml(
    author.length > 32 ? author.slice(0, 29) + "..." : author
  );

  let decoration = "";

  if (design === 0) {
    decoration = `
      <circle cx="150" cy="105" r="48"
        fill="${theme.secondary}" opacity="0.8"/>
      <circle cx="150" cy="105" r="30"
        fill="none" stroke="${theme.primary}" stroke-width="3"/>
      <path d="M130 105 L150 85 L170 105 L150 125 Z"
        fill="${theme.primary}" opacity="0.75"/>
    `;
  } else if (design === 1) {
    decoration = `
      <rect x="85" y="65" width="130" height="85"
        rx="12" fill="${theme.secondary}"/>
      <path d="M105 125 L150 80 L195 125"
        fill="none" stroke="${theme.primary}" stroke-width="5"/>
      <circle cx="150" cy="105" r="10"
        fill="${theme.primary}"/>
    `;
  } else if (design === 2) {
    decoration = `
      <path d="M150 55 L205 110 L150 165 L95 110 Z"
        fill="${theme.secondary}"/>
      <path d="M150 75 L185 110 L150 145 L115 110 Z"
        fill="none" stroke="${theme.primary}" stroke-width="4"/>
      <circle cx="150" cy="110" r="12"
        fill="${theme.primary}"/>
    `;
  } else {
    decoration = `
      <circle cx="150" cy="105" r="48"
        fill="${theme.secondary}"/>
      <path d="M150 65 C115 90 115 120 150 145
        C185 120 185 90 150 65 Z"
        fill="${theme.primary}" opacity="0.8"/>
      <path d="M150 75 L150 135"
        stroke="#ffffff" stroke-width="3"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="300" height="420" viewBox="0 0 300 420">

      <rect width="300" height="420" fill="${theme.bg}"/>

      <rect x="13" y="13" width="274" height="394"
        rx="9" fill="none"
        stroke="${theme.primary}" stroke-width="2" opacity="0.5"/>

      ${decoration}
      ${titleSvg}

      <line x1="75" y1="305" x2="225" y2="305"
        stroke="${theme.primary}" stroke-width="2" opacity="0.5"/>

      <text x="150" y="335"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="12"
        fill="${theme.primary}">
        ${safeAuthor}
      </text>

      <text x="150" y="375"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="13"
        font-weight="bold"
        letter-spacing="2"
        fill="${theme.primary}">
        BOOK BASKET
      </text>
    </svg>
  `;

  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(svg)
  );
};

// Convert different API book formats into one format
const normalizeBook = (data) => {
  const details = data?.book || data || {};
  const volumeInfo = details.volumeInfo || {};

  const openLibraryId = details.openLibraryId || "";

  const openLibraryKey = openLibraryId
    .replace("/works/", "")
    .replace("/books/", "");

  const coverCandidates = [
    details.coverImage,
    details.image,
    details.imageLinks?.thumbnail,
    volumeInfo.imageLinks?.thumbnail,

    openLibraryKey
      ? `https://covers.openlibrary.org/b/olid/${openLibraryKey}-L.jpg?default=false`
      : "",

    details.googleBooksId
      ? `https://books.google.com/books/content?id=${details.googleBooksId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
      : "",
  ]
    .filter(Boolean)
    .map((url) => url.replace("http://", "https://"))
    .filter((url, index, array) => array.indexOf(url) === index);

  const book = {
    id: String(
      details.id ||
      details._id ||
      details.googleBooksId ||
      openLibraryId ||
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

    coverCandidates,
    coverImage: coverCandidates[0] || "",

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

  book.placeholderCover = createBookPlaceholder(book);

  return book;
};

// Book categories
const categories = [
  "All Books",
  "Fiction",
  "Romance",
  "Mystery",
  "Thriller",
  "Fantasy",
  "Horror",
  "Adventure",
  "Science Fiction",
  "Self Help",
  "Motivation",
  "Personal Development",
  "Biography",
  "Autobiography",
  "History",
  "Science",
  "Technology",
  "Education",
  "Business",
  "Finance",
  "Psychology",
  "Philosophy",
  "Religion",
  "Spirituality",
  "Poetry",
  "Classics",
  "Literature",
  "Children's Books",
  "Comics",
  "Graphic Novels",
  "Health",
  "Travel",
  "Cooking",
  "Art",
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

  // Load popular books, category books or search results
  useEffect(() => {
    let isActive = true;

    const loadBooks = async () => {
      try {
        setLoading(true);
        setError("");

        let response;

        if (searchTerm.trim().length >= 2) {
          // Search by book title or author
          response = await api.get("/books/search", {
            params: {
              q: searchTerm.trim(),
            },
          });
        } else if (activeCategory === "All Books") {
          // Load popular books when page opens
          response = await api.get("/books/featured");
        } else {
          // Load selected category
          response = await api.get(
            `/books/category/${encodeURIComponent(activeCategory)}`
          );
        }

        if (!isActive) return;

        const results = Array.isArray(response.data)
          ? response.data
          : response.data.books || response.data.items || [];

        const normalizedBooks = results
          .map(normalizeBook)
          .filter((book) => book.id && book.title);

        setBooks(normalizedBooks);
      } catch (err) {
        if (!isActive) return;

        console.error("Load books error:", err);

        setBooks([]);

        setError(
          err.response?.data?.message ||
          "Unable to load books. Please try again."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    // Debounce search; load categories immediately
    const delay = searchTerm.trim().length >= 2 ? 500 : 0;

    const timer = setTimeout(loadBooks, delay);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [searchTerm, activeCategory]);

  // Try the next available original cover
  const handleCoverError = (event) => {
    const image = event.currentTarget;

    const candidates = JSON.parse(
      image.dataset.coverCandidates || "[]"
    );

    const currentIndex = Number(
      image.dataset.coverIndex || 0
    );

    const nextIndex = currentIndex + 1;

    if (nextIndex < candidates.length) {
      image.dataset.coverIndex = String(nextIndex);
      image.src = candidates[nextIndex];
    } else {
      image.onerror = null;
      image.src = image.dataset.placeholder;
    }
  };

  // View book details
  const handleViewDetails = (book) => {
    if (!book.id || !book.title) {
      setMessage("Book details are incomplete.");
      return;
    }

    navigate(`/book/${encodeURIComponent(book.id)}`, {
      state: { book },
    });
  };

  // Add book to My Library
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
      console.error("Add book error:", err.response?.data || err);

      setMessage(
        err.response?.data?.message ||
        "Unable to add book. Please try again."
      );
    } finally {
      setAddingBook(null);
    }
  };

  // Change selected category
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchTerm("");
    setMessage("");
    setError("");
  };

  const headingText = searchTerm.trim().length >= 2
    ? "Search Results"
    : activeCategory === "All Books"
      ? "Popular Books"
      : `${activeCategory} Books`;

  return (
    <div className="explore-page">

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
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Results Heading */}
      <div className="explore-results-heading">
        <h2>{headingText}</h2>

        {!loading && (
          <span>
            {books.length} books found
          </span>
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
      {!loading && books.length > 0 && (
        <div className="explore-books-grid">
          {books.map((book) => (
            <div
              className="explore-book-card"
              key={book.id}
            >
              <div className="explore-book-cover">
                <img
                  src={book.coverImage || book.placeholderCover}
                  data-cover-candidates={JSON.stringify(
                    book.coverCandidates
                  )}
                  data-cover-index="0"
                  data-placeholder={book.placeholderCover}
                  alt={book.title}
                  onError={handleCoverError}
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

      {/* Empty State */}
      {!loading && books.length === 0 && !error && (
        <div className="explore-empty">
          <span>
            {searchTerm.trim().length >= 2 ? "🔎" : "📚"}
          </span>

          <h3>
            {searchTerm.trim().length >= 2
              ? "No books found"
              : "No books available"}
          </h3>

          <p>
            {searchTerm.trim().length >= 2
              ? "Try another title or author name."
              : "Please try another category or check again later."}
          </p>
        </div>
      )}

    </div>
  );
};

export default ExploreBooks;
