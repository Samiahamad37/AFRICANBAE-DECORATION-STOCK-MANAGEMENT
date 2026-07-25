import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/client";
import styles from "./AuthPages.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "/password-reset/",
        { email }
      );

      setMessage(
        res.data.message ||
        "Password reset link has been sent to your email."
      );
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMsg = err.response?.data?.message ||
                       err.response?.data?.error ||
                       err.response?.data?.detail ||
                       err.message ||
                       "Failed to send reset link. Try again.";
      setError(errorMsg);
      }
       finally {
    setLoading(false);     // ← This was missing
  }
  };


  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1>Forgot Password</h1>

        <p className={styles.subtitle}>
          Enter your email and we will send you a reset link
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}

          </button>
        </form>

        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.footer}>
          <p>
            Remember your password?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;