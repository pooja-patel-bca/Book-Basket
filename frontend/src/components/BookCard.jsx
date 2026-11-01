import { BookOpen, Heart } from "lucide-react";
import "./BookCard.css";

const BookCard = ({
  book,
  onViewDetails,
  onToggleFavourite,
  isFavourite = false,
}) => {
  const authors = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.authors || "Unknown Author";

  return (
    <div className="book-card">
      <div className="book-card-cover">
        <img
          src={book.coverImage || book.image || "/placeholder-book.png"}
          alt={book.title}
        />

        <button
          className={`favourite-btn ${isFavourite ? "active" : ""}`}
          onClick={() => onToggleFavourite?.(book)}
          aria-label="Toggle favourite"
        >
          <Heart
            size={18}
            fill={isFavourite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="book-card-info">
        <h3>{book.title}</h3>
        <p>{authors}</p>

        <button
          className="book-details-btn"
          onClick={() => onViewDetails?.(book)}
        >
          <BookOpen size={16} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;