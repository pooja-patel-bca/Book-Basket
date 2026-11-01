
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Save,
  Lock,
} from "lucide-react";

import api from "../services/api";
import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [name, setName] = useState(
    user.name || user.fullName || ""
  );

  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/profile", {
        name: name.trim(),
        email: email.trim(),
      });

      const updatedUser =
        response.data.user || {
          ...user,
          name: name.trim(),
          email: email.trim(),
        };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <button
        className="edit-profile-back"
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft size={18} />
        Back to Profile
      </button>

      <div className="edit-profile-heading">
        <span>ACCOUNT SETTINGS</span>
        <h1>Edit Profile</h1>
        <p>Update your personal information.</p>
      </div>

      <section className="edit-profile-card">
        <div className="edit-profile-avatar">
          <UserRound size={38} />
        </div>

        <h2>Personal Information</h2>
        <p className="edit-profile-description">
          Keep your account details up to date.
        </p>

        {message && (
          <div className="edit-profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="edit-profile-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="edit-form-group">
            <label htmlFor="profile-name">
              Full Name
            </label>

            <div className="edit-input-wrapper">
              <UserRound size={18} />

              <input
                id="profile-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="edit-form-group">
            <label htmlFor="profile-email">
              Email Address
            </label>

            <div className="edit-input-wrapper">
              <Mail size={18} />

              <input
                id="profile-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="edit-profile-note">
            <Lock size={16} />
            Your account information is kept private.
          </div>

          <div className="edit-profile-actions">
            <button
              type="button"
              className="edit-cancel-btn"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={loading}
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditProfile;
