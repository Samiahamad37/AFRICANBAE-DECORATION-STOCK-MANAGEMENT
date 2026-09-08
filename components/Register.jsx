'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import styles from './AuthPages.module.css'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, error, clearError, isAuthenticated } = useAuth()
  const router = useRouter()
  const isPasswordTooShort = password.length > 0 && password.length < 8

  useEffect(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

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
      router.push('/login')
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
              pattern="^[^@]+$"
              title="Username cannot contain @"
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
            <div className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
                minLength={8}
                placeholder="Enter a strong password"
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
            {isPasswordTooShort && (
              <div className={styles.error}>
                Password must be at least 8 characters.
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password2">Confirm Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="password2"
                type={showPassword2 ? 'text' : 'password'}
                value={password2}
                onChange={handlePassword2Change}
                required
                minLength={8}
                placeholder="Confirm your password"
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
            {password2 && password !== password2 && (
              <div className={styles.error}>Passwords do not match.</div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading || !passwordMatch || isPasswordTooShort}
            className={styles.submitBtn}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
