import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBasket,
  Mail,
  Lock,
  BookOpen,
} from "lucide-react";
import api from "../services/api";
import "./Register.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your details."
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

        <h1>Welcome back, reader!</h1>
        <p>Continue your reading journey with Book Basket.</p>
      </div>

      <div className="register-form-section">
        <div className="register-brand">
          <ShoppingBasket size={28} />
          <span>Book Basket</span>
        </div>

        <div className="register-card">
          <h2>Welcome Back</h2>
          <p className="register-subtitle">
            Sign in to access your personal book collection.
          </p>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="register-input-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="register-input-wrapper">
                <Mail size={18} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="login-password">Password</label>
              <div className="register-input-wrapper">
                <Lock size={18} />
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="register-login-text">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>
        </div>

        <p className="register-footer-text">
          Made for readers, with love.
        </p>
      </div>
    </div>
  );
};

export default Login;