import axios from 'axios'

const api = axios.create({
 baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
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

// ── Products ──────────────────────────────────────────────
export const getProducts = () => api.get('/products/')

export const createProduct = (formData) =>
  api.post('/products/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteProduct = (id) => api.delete(`/products/${id}/`)

export const sellProduct = (id, quantity) =>
  api.post(`/products/${id}/sell/`, { quantity })

export const restockProduct = (id, quantity) =>
  api.post(`/products/${id}/restock/`, { quantity })

// ── Sales ─────────────────────────────────────────────────
export const getSales = () => api.get('/sales/')

export default api
