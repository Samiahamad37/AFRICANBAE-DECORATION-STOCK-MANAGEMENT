import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/client";
import styles from "./AuthPages.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");
    setResetLink("");

    try {
      const res = await axios.post(
        "/password-reset/",
        { email }
      );

      const localResetLink = res.data.reset_path
        ? `${window.location.origin}${res.data.reset_path}`
        : res.data.reset_link;

      setResetLink(localResetLink || "");
      setMessage(
        localResetLink
          ? "Reset link generated. Click the button below to set a new password."
          : res.data.message || "If that email exists, a reset link has been generated."
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
          Enter your email and we will generate a reset link on this page.
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
            {loading ? "Generating..." : "Generate Reset Link"}

          </button>
        </form>

        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}

        {resetLink && (
          <a className={styles.resetLink} href={resetLink}>
            Open reset password page
          </a>
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