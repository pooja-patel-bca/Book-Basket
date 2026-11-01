
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  CalendarDays,
  BookOpen,
  Heart,
  Library,
  Pencil,
} from "lucide-react";

import api from "../services/api";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await api.get("/library");

        const libraryBooks = Array.isArray(response.data)
          ? response.data
          : response.data.books || response.data.library || [];

        setBooks(libraryBooks);
      } catch (error) {
        console.error("Unable to load reading statistics:", error);
      }
    };

    fetchLibrary();
  }, []);

  const completedBooks = books.filter(
    (book) => book.status === "Completed"
  ).length;

  const readingBooks = books.filter(
    (book) => book.status === "Reading"
  ).length;

  const favouriteBooks = books.filter(
    (book) => book.isFavourite === true
  ).length;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Book Basket Member";

  const userName = user.name || user.fullName || "Reader";
  const userEmail = user.email || "Email not available";

  return (
    <div className="profile-page">
      {/* Page Heading */}
      <div className="profile-heading">
        <span className="profile-subtitle">
          YOUR PERSONAL SPACE
        </span>

        <h1>My Profile</h1>

        <p>Manage your account and reading journey.</p>
      </div>

      {/* Profile Card */}
      <section className="profile-main-card">
        <div className="profile-cover"></div>

        <div className="profile-user-info">
          <div className="profile-avatar">
            <UserRound size={42} />
          </div>

          <div className="profile-user-details">
            <h2>{userName}</h2>

            <p>
              <Mail size={16} />
              {userEmail}
            </p>

            <span className="profile-member">
              <CalendarDays size={15} />
              {memberSince}
            </span>
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>
      </section>

      {/* Reading Statistics */}
      <section className="profile-section">
        <div className="profile-section-heading">
          <h2>My Reading Statistics</h2>
          <p>A quick look at your book collection.</p>
        </div>

        <div className="profile-stats-grid">
          <div className="profile-stat-card profile-stat-peach">
            <div className="profile-stat-icon">
              <Library size={23} />
            </div>

            <div>
              <h3>{books.length}</h3>
              <p>Total Books</p>
            </div>
          </div>

          <div className="profile-stat-card profile-stat-lavender">
            <div className="profile-stat-icon">
              <BookOpen size={23} />
            </div>

            <div>
              <h3>{readingBooks}</h3>
              <p>Currently Reading</p>
            </div>
          </div>

          <div className="profile-stat-card profile-stat-mint">
            <div className="profile-stat-icon">
              <Heart size={23} />
            </div>

            <div>
              <h3>{favouriteBooks}</h3>
              <p>Favourite Books</p>
            </div>
          </div>

          <div className="profile-stat-card profile-stat-yellow">
            <div className="profile-stat-icon">
              <BookOpen size={23} />
            </div>

            <div>
              <h3>{completedBooks}</h3>
              <p>Books Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="profile-account-card">
        <h2>Account Information</h2>

        <div className="profile-information-row">
          <span>Full Name</span>
          <strong>{userName}</strong>
        </div>

        <div className="profile-information-row">
          <span>Email Address</span>
          <strong>{userEmail}</strong>
        </div>

        <div className="profile-information-row">
          <span>Membership</span>
          <strong>Book Basket Reader</strong>
        </div>

        <button
          className="profile-edit-bottom-btn"
          onClick={() => navigate("/edit-profile")}
        >
          <Pencil size={16} />
          Edit My Information
        </button>
      </section>
    </div>
  );
};

export default Profile;
