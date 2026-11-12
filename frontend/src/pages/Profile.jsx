
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  CalendarDays,
  BookOpen,
  Heart,
  Library,
  Pencil,
  Camera,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import api from "../services/api";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [books, setBooks] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [uploading, setUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [imageError, setImageError] = useState(false);

  // Fetch library statistics
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

  // Update user information in state and localStorage
  const updateUserData = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Select profile photo
  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoMessage("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoMessage("Photo size must be less than 5 MB.");
      return;
    }

    setSelectedPhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));
    setPhotoMessage("");
    setImageError(false);
  };

  // Upload profile photo
  const handlePhotoUpload = async () => {
    if (!selectedPhoto) return;

    try {
      setUploading(true);
      setPhotoMessage("");

      const formData = new FormData();
      formData.append("profileImage", selectedPhoto);

      const response = await api.put(
        "/profile/photo",
        formData
      );

      const photoUrl = response.data.profileImage;

      updateUserData({
        profileImage: photoUrl,
      });

      setSelectedPhoto(null);
      setPreviewPhoto("");
      setImageError(false);
      setPhotoMessage("Profile photo updated successfully!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Photo upload error:", error);

      setPhotoMessage(
        error.response?.data?.message ||
        "Unable to upload photo. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // Cancel photo selection
  const cancelPhotoSelection = () => {
    setSelectedPhoto(null);
    setPreviewPhoto("");
    setPhotoMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove profile photo
  const handleRemovePhoto = async () => {
    if (!user.profileImage) return;

    try {
      setUploading(true);
      setPhotoMessage("");

      await api.delete("/profile/photo");

      updateUserData({
        profileImage: "",
      });

      setSelectedPhoto(null);
      setPreviewPhoto("");
      setImageError(false);
      setPhotoMessage("Profile photo removed successfully!");
    } catch (error) {
      console.error("Photo removal error:", error);

      setPhotoMessage(
        error.response?.data?.message ||
        "Unable to remove profile photo."
      );
    } finally {
      setUploading(false);
    }
  };

  const completedBooks = books.filter(
    (book) => book.status === "Completed"
  ).length;

  const readingBooks = books.filter(
    (book) =>
      book.status === "Currently Reading" ||
      book.status === "Reading"
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

  const displayedPhoto = previewPhoto || user.profileImage;

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
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {displayedPhoto && !imageError ? (
                <img
                  src={displayedPhoto}
                  alt="Profile"
                  className="profile-avatar-image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <UserRound size={42} />
              )}
            </div>

            <button
              type="button"
              className="profile-camera-btn"
              title="Choose profile photo"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera size={17} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={handlePhotoSelect}
            />
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

        {/* Photo Upload Controls */}
        <div className="profile-photo-controls">
          {selectedPhoto ? (
            <>
              <button
                type="button"
                className="profile-upload-btn"
                onClick={handlePhotoUpload}
                disabled={uploading}
              >
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>

              <button
                type="button"
                className="profile-cancel-btn"
                onClick={cancelPhotoSelection}
                disabled={uploading}
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="profile-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera size={16} />
                {user.profileImage ? "Change Photo" : "Add Photo"}
              </button>

              {user.profileImage && (
                <button
                  type="button"
                  className="profile-remove-btn"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                >
                  <Trash2 size={16} />
                  Remove Photo
                </button>
              )}
            </>
          )}

          {photoMessage && (
            <p className="profile-photo-message" role="status">
              {photoMessage}
            </p>
          )}
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
