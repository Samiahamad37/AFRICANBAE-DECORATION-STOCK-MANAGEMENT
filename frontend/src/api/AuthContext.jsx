import React, { createContext, useState, useCallback, useEffect } from 'react'
import api from './client'

export const AuthContext = createContext()

const getApiErrorMessage = (err, fallback) => {
  if (!err.response) {
    return 'Cannot reach backend. Check the API URL, backend server, or CORS settings.'
  }

  const { data, status } = err.response

  if (typeof data === 'string' && data.trim()) {
    if (data.includes('<!DOCTYPE') || data.includes('<html')) {
      return `Server error (${status}). Check the backend logs for the exact failure.`
    }
    return data
  }

  if (data && typeof data === 'object') {
    const preferredFields = [
      'username',
      'email',
      'password',
      'password2',
      'old_password',
      'new_password',
      'new_password2',
      'non_field_errors',
      'detail',
      'message',
      'error',
    ]

    for (const field of preferredFields) {
      const value = data[field]
      if (Array.isArray(value) && value[0]) return value[0]
      if (typeof value === 'string' && value) return value
    }

    for (const value of Object.values(data)) {
      if (Array.isArray(value) && value[0]) return value[0]
      if (typeof value === 'string' && value) return value
    }
  }

  if (status >= 500) {
    return `Server error (${status}). Check the backend logs for the exact failure.`
  }

  return fallback
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [tokens, setTokens] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens')
    if (storedTokens) {
      try {
        const parsed = JSON.parse(storedTokens)
        setTokens(parsed)
        // Set the token in axios default header
        api.defaults.headers.common['Authorization'] = `Bearer ${parsed.access}`
        // Fetch user profile
        fetchUserProfile(parsed.access)
      } catch (err) {
        console.error('Error loading tokens:', err)
        localStorage.removeItem('tokens')
      }
    }
    setLoading(false)
  }, [])

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await api.get('/auth/profile/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setUser(response.data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const register = useCallback(async (username, email, password, password2) => {
    setError(null)
    try {
      const response = await api.post('/auth/register/', {
        username,
        email,
        password,
        password2,
      })
      return { success: true }
    } catch (err) {
      const errorMsg = getApiErrorMessage(err, 'Registration failed')
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }, [])

  const login = useCallback(async (username, password) => {
    setError(null)
    try {
      const response = await api.post('/auth/login/', {
        username,
        password,
      })
      setTokens(response.data)
      setUser({
        username: response.data.username || username,
        email: response.data.email || '',
      })
      localStorage.setItem('tokens', JSON.stringify(response.data))
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
      fetchUserProfile(response.data.access)
      return { success: true }
    } catch (err) {
      const errorMsg = getApiErrorMessage(err, 'Login failed')
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout/')
    } catch (err) {
      console.error('Error during logout:', err)
    }
    setUser(null)
    setTokens(null)
    localStorage.removeItem('tokens')
    delete api.defaults.headers.common['Authorization']
  }, [])

  const changePassword = useCallback(async (oldPassword, newPassword, newPassword2) => {
    setError(null)
    try {
      await api.post('/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      })
      return { success: true, message: 'Password changed successfully' }
    } catch (err) {
      const errorMsg = getApiErrorMessage(err, 'Failed to change password')
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }, [])

  const refreshToken = useCallback(async () => {
    if (!tokens?.refresh) return false
    try {
      const response = await api.post('/auth/refresh/', {
        refresh: tokens.refresh,
      })
      const newTokens = { ...tokens, access: response.data.access }
      setTokens(newTokens)
      localStorage.setItem('tokens', JSON.stringify(newTokens))
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
      return true
    } catch (err) {
      console.error('Token refresh failed:', err)
      logout()
      return false
    }
  }, [tokens, logout])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    user,
    tokens,
    loading,
    error,
    clearError,
    isAuthenticated: !!tokens,
    register,
    login,
    logout,
    changePassword,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}