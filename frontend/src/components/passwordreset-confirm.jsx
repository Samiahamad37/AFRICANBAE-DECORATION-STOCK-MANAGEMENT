import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../api/client";
import styles from "./AuthPages.module.css";

function ResetPasswordConfirm() {
  const { uidb64, token } = useParams();

  const [new_password, setNewPassword] = useState("");
  const [new_password2, setNewPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resetPassword(
        uidb64,
        token,
        new_password,
        new_password2
      );

      setMessage("Password reset successful!");
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
        "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1>Reset Password</h1>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="New Password"
              value={new_password}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={new_password2}
              onChange={(e) =>
                setNewPassword2(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordConfirm;