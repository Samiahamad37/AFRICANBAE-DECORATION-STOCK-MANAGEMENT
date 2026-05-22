import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import styles from './AuthPages.module.css'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { register, error } = useAuth()
  const navigate = useNavigate()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setPasswordMatch(e.target.value === password2)
  }

  const handlePassword2Change = (e) => {
    setPassword2(e.target.value)
    setPasswordMatch(password === e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      setPasswordMatch(false)
      return
    }
    setIsLoading(true)
    const result = await register(username, email, password, password2)
    setIsLoading(false)
    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              placeholder="Enter a strong password"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password2">Confirm Password</label>
            <input
              id="password2"
              type="password"
              value={password2}
              onChange={handlePassword2Change}
              required
              placeholder="Confirm your password"
            />
            {!passwordMatch && <div className={styles.error}>Passwords do not match</div>}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !passwordMatch}
            className={styles.submitBtn}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
