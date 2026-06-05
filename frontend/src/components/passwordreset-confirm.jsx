import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/client";
import styles from "./AuthPages.module.css";

function ResetPasswordConfirm() {
  const { uidb64, token } = useParams();

  const [new_password, setNewPassword] = useState("");
  const [new_password2, setNewPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(
        `/password-reset-confirm/${uidb64}/${token}/`,
        {
           new_password,
           new_password2,
        }
      );
      

      setMessage("Password reset successful!");
    } catch (err) {
      const errorMsg = err.response?.data?.new_password?.[0] ||
                       err.response?.data?.non_field_errors?.[0] ||
                       err.response?.data?.message ||
                       "Failed to reset password. Try again.";
      setError(errorMsg);
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
            <label>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingRight: '40px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword2 ? "text" : "password"}
                placeholder="Confirm password"
                value={new_password2}
                onChange={(e) => setNewPassword2(e.target.value)}
                style={{ paddingRight: '40px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword2 ? '🙈' : '👁️'}
              </button>
            </div>
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