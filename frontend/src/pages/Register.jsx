import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBasket,
  UserRound,
  Mail,
  Lock,
  BookOpen,
} from "lucide-react";
import api from "../services/api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate(token ? "/" : "/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-decoration">
        <div className="register-decoration-icon">
          <BookOpen size={65} />
        </div>

        <h1>Your next chapter starts here.</h1>
        <p>Create your account and build your personal reading collection.</p>
      </div>

      <div className="register-form-section">
        <div className="register-brand">
          <ShoppingBasket size={28} />
          <span>Book Basket</span>
        </div>

        <div className="register-card">
          <h2>Create Account</h2>
          <p className="register-subtitle">
            Join Book Basket and organise your favourite books.
          </p>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="register-input-group">
              <label htmlFor="register-name">Full Name</label>
              <div className="register-input-wrapper">
                <UserRound size={18} />
                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="register-email">Email Address</label>
              <div className="register-input-wrapper">
                <Mail size={18} />
                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="register-password">Password</label>
              <div className="register-input-wrapper">
                <Lock size={18} />
                <input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="register-input-wrapper">
                <Lock size={18} />
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">Sign In</Link>
          </p>
        </div>

        <p className="register-footer-text">
          Made for readers, with love.
        </p>
      </div>
    </div>
  );
};

export default Register;