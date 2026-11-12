
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBasket,
  UserRound,
  Mail,
  Lock,
  BookOpen,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
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

  // Email Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data.email) {
        navigate("/verify-otp", {
          state: { email: response.data.email },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError("");
      setLoading(true);

      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Google Sign-Up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Left Decoration Section */}
      <div className="register-decoration">
        <div className="register-decoration-icon">
          <BookOpen size={65} />
        </div>

        <h1>Your next chapter starts here.</h1>

        <p>
          Create your account and build your personal reading collection.
        </p>
      </div>

      {/* Right Registration Section */}
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

          {/* Error Message */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister}>

            <div className="register-input-group">
              <label htmlFor="register-name">
                Full Name
              </label>

              <div className="register-input-wrapper">
                <UserRound size={18} />

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">
                <Mail size={18} />

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">
                <Lock size={18} />

                <input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="register-input-wrapper">
                <Lock size={18} />

                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
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

          {/* OR Divider */}
          <div className="register-divider">
            <span>OR</span>
          </div>

          {/* Google Sign-Up */}
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign-Up failed.")}
              text="signup_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          {/* Login Link */}
          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">
              Sign In
            </Link>
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
