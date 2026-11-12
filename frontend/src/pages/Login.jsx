
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBasket,
  Mail,
  Lock,
  BookOpen,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        identifier: email.trim().toLowerCase(),
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Login
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
        "Google Sign-In failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left Decoration Section */}
      <div className="login-decoration">

        <div className="login-decoration-icon">
          <BookOpen size={65} />
        </div>

        <h1>Welcome back, reader!</h1>

        <p>
          Continue your reading journey with Book Basket.
        </p>

      </div>

      {/* Right Login Section */}
      <div className="login-form-section">

        {/* Brand */}
        <Link to="/" className="login-brand">
          <ShoppingBasket size={28} />
          <span>Book Basket</span>
        </Link>

        {/* Login Card */}
        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Sign in to access your personal book collection.
          </p>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>

            <div className="login-input-group">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="login-input-wrapper">
                <Mail size={18} />

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

            </div>

            <div className="login-input-group">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">
                <Lock size={18} />

                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          {/* OR Divider */}
          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* Google Login */}
          <div className="google-login-wrapper">

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setError("Google Sign-In was unsuccessful.")
              }
              text="continue_with"
              shape="rectangular"
              theme="outline"
              width="100%"
            />

          </div>

          {/* Register Link */}
          <p className="login-register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create Account
            </Link>
          </p>

        </div>

        {/* Footer */}
        <p className="login-footer-text">
          Made for readers, with love.
        </p>

      </div>

    </div>
  );
};

export default Login;
