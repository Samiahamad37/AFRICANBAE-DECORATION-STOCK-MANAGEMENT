import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('tokens')
  if (tokens) {
    try {
      const parsed = JSON.parse(tokens)
      config.headers.Authorization = `Bearer ${parsed.access}`
    } catch (e) {
      console.error('Error parsing tokens:', e)
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes('/auth/refresh/')
    ) {
      return Promise.reject(error)
    }

    const storedTokens = localStorage.getItem('tokens')
    if (!storedTokens) return Promise.reject(error)

    try {
      const tokens = JSON.parse(storedTokens)
      if (!tokens?.refresh) return Promise.reject(error)

      originalRequest._retry = true
      const response = await api.post('/auth/refresh/', {
        refresh: tokens.refresh,
      })
      const newTokens = { ...tokens, access: response.data.access }

      localStorage.setItem('tokens', JSON.stringify(newTokens))
      api.defaults.headers.common.Authorization = `Bearer ${newTokens.access}`
      originalRequest.headers.Authorization = `Bearer ${newTokens.access}`

      return api(originalRequest)
    } catch (refreshError) {
      localStorage.removeItem('tokens')
      delete api.defaults.headers.common.Authorization
      return Promise.reject(refreshError)
    }
  }
)

// ── Products ──────────────────────────────────────────────
export const getProducts = () => api.get('/products/')

export const createProduct = (formData) => api.post('/products/', formData)

export const updateProduct = (id, formData) => api.patch(`/products/${id}/`, formData)

export const deleteProduct = (id) => api.delete(`/products/${id}/`)

export const sellProduct = (id, quantity) =>
  api.post(`/products/${id}/sell/`, { quantity })

export const restockProduct = (id, quantity) =>
  api.post(`/products/${id}/restock/`, { quantity })

// ── Sales ─────────────────────────────────────────────────
export const getSales = () => api.get('/sales/')



// ── Password Reset ─────────────────────────────────────────

export const forgotPassword = (email) =>
  api.post('/password-reset/', {
    email,
  })

export const resetPassword = (
  uidb64,
  token,
  new_password,
  new_password2
) =>
  api.post(
    `/password-reset-confirm/${uidb64}/${token}/`,
    {
      new_password,
      new_password2,
    }
  )
export default api
