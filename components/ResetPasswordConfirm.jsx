'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/lib/api'
import styles from './AuthPages.module.css'

export default function ResetPasswordConfirm({ uidb64, token }) {
  const router = useRouter()

  const [new_password, setNewPassword] = useState('')
  const [new_password2, setNewPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const passwordsDoNotMatch = new_password2 && new_password !== new_password2
  const passwordTooShort = new_password && new_password.length < 8

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passwordsDoNotMatch || passwordTooShort) return

    setLoading(true)
    setError('')
    setMessage('')

    try {
      await resetPassword(uidb64, token, new_password, new_password2)

      setMessage('Password reset successful!')
      setTimeout(() => {
        router.replace('/login')
      }, 1200)
    } catch (err) {
      const errorMsg =
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.message ||
        'Failed to reset password. Try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1>Reset Password</h1>

        {error && <div className={styles.error}>{error}</div>}

        {message && <div className={styles.successMessage}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="new-password">New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {passwordTooShort && (
              <div className={styles.error}>
                Password must be at least 8 characters.
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="confirm-password"
                type={showPassword2 ? 'text' : 'password'}
                placeholder="Confirm password"
                value={new_password2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword2(!showPassword2)}
                aria-label={showPassword2 ? 'Hide password' : 'Show password'}
              >
                {showPassword2 ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {passwordsDoNotMatch && (
              <div className={styles.error}>Passwords do not match.</div>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || passwordsDoNotMatch || passwordTooShort}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
