
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, ShieldCheck, ShoppingBasket } from "lucide-react";
import api from "../services/api";
import "./Register.css";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Registration email not found. Please register again.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/verify-otp", {
                email,
                otp,
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "OTP verification failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setMessage("");

        if (!email) {
            setError("Registration email not found. Please register again.");
            return;
        }

        try {
            setResending(true);

            const response = await api.post("/auth/resend-otp", {
                email,
            });

            setMessage(
                response.data?.message || "A new OTP has been sent to your email."
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to resend OTP. Please try again later."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-decoration">
                <div className="register-decoration-icon">
                    <ShieldCheck size={65} />
                </div>

                <h1>One more step!</h1>

                <p>
                    Verify your email address and start your reading journey with
                    Book Basket.
                </p>
            </div>

            <div className="register-form-section">
                <div className="register-brand">
                    <ShoppingBasket size={28} />
                    <span>Book Basket</span>
                </div>

                <div className="register-card">
                    <h2>Verify Your Email</h2>

                    <p className="register-subtitle">
                        Enter the 6-digit OTP sent to your registered email address.
                    </p>

                    {email && (
                        <p className="register-subtitle">
                            <Mail size={16} /> {email}
                        </p>
                    )}

                    {error && (
                        <div className="register-error">{error}</div>
                    )}

                    {message && (
                        <div className="register-success">{message}</div>
                    )}

                    <form onSubmit={handleVerify}>
                        <div className="register-input-group">
                            <label htmlFor="register-otp">Enter OTP</label>

                            <div className="register-input-wrapper">
                                <ShieldCheck size={18} />

                                <input
                                    id="register-otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="register-submit-btn"
                            disabled={loading || !email}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>

                    <p className="register-login-text">
                        Didn't receive the OTP?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending || !email}
                            className="register-resend-btn"
                        >
                            {resending ? "Sending..." : "Resend OTP"}
                        </button>
                    </p>

                    <p className="register-login-text">
                        <Link to="/register">Back to Registration</Link>
                    </p>
                </div>

                <p className="register-footer-text">
                    Made for readers, with love.
                </p>
            </div>
        </div>
    );
};

export default VerifyOTP;
